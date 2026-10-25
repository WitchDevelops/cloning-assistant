from typing import NamedTuple


class Dilution(NamedTuple):
    """Volumes to combine, µL."""

    stock: float
    diluent: float


def dilution(stock_conc: float, final_conc: float, final_volume: float) -> Dilution:
    """Volumes of stock and diluent for a C1V1 = C2V2 dilution.

    Args:
        stock_conc: Stock concentration in the family's base unit (ng/µL or nM).
        final_conc: Desired concentration, same base unit as stock_conc.
        final_volume: Desired final volume, µL.


    Returns:
        Volumes of stock and diluent to combine, µL.
    """
    stock_volume = (final_conc * final_volume) / stock_conc
    diluent_volume = final_volume - stock_volume
    return Dilution(stock=stock_volume, diluent=diluent_volume)


# Values based on Ligation Protocol with T4 DNA Ligase (NEB# M0202)
# 2 µL 10× buffer and 1 µL ligase per 20 µL.
BUFFER_FRACTION = 0.1
LIGASE_FRACTION = 0.05


class LigationMix(NamedTuple):
    """Volumes for one T4 ligation reaction: vector, insert, 10x ligase buffer, T4 ligase, water.
    All in µL."""

    vector_volume: float
    insert_volume: float
    ligase_buffer_volume: float
    ligase_volume: float
    water_volume: float


def _assemble_ligation_mix(
    vector_volume: float, insert_volume: float, final_volume: float
) -> LigationMix:
    """Completes a ligation mix from the DNA volumes: adds 10× buffer, T4 ligase and water.

    Args:
        vector_volume: Vector to pipette, µL.
        insert_volume: Insert to pipette, µL. Zero for a vector-only control.
        final_volume: Final reaction volume, µL.

    Returns:
        All five volumes, µL.

    Raises:
        ValueError: If the DNA, buffer and ligase exceed the final volume.
    """

    ligase_buffer_volume = final_volume * BUFFER_FRACTION
    ligase_volume = final_volume * LIGASE_FRACTION
    water_volume = final_volume - (
        vector_volume + insert_volume + ligase_buffer_volume + ligase_volume
    )

    if water_volume < 0:
        raise ValueError(
            f"Reagents need {final_volume - water_volume:.1f} µL"
            f" but the reaction volume is {final_volume} µL. "
            f"Negative water volume: {-water_volume:.1f} µL. "
            "Increase the reaction volume, use less vector, or concentrate the insert."
        )

    return LigationMix(
        vector_volume=vector_volume,
        insert_volume=insert_volume,
        ligase_buffer_volume=ligase_buffer_volume,
        ligase_volume=ligase_volume,
        water_volume=water_volume,
    )


def ligation(
    vector_mass: float,
    vector_length: float,
    insert_length: float,
    vector_conc: float,
    insert_conc: float,
    ratio: float,
    final_volume: float,
) -> LigationMix:
    """Values needed to calculate the volumes for a ligation mixture.
    Uses formula `ng insert = ng vector × (bp insert / bp vector) × ratio`.
    Based on Ligation Protocol with T4 DNA Ligase (NEB# M0202) (https://www.neb.com/en/protocols/dna-ligation-with-t4-dna-ligase-m0202).

    Args:
        vector_mass: Desired mass of the vector, ng.
        vector_length: Length of the vector, bp.
        insert_length: Length of the insert, bp.
        vector_conc: Vector concentration as measured with nanodrop, ng/µL.
        insert_conc: Insert concentration, ng/µL.
        ratio: Desired ratio, (insert:vector).
        final_volume: Final reaction volume, µL.

    Returns:
        Volumes of reactants needed for a single ligation reaction with T4 DNA ligase.

    Raises:
        ValueError for negative water volume.
    """

    insert_mass = vector_mass * (insert_length / vector_length) * ratio
    vector_volume = vector_mass / vector_conc
    insert_volume = insert_mass / insert_conc

    return _assemble_ligation_mix(
        vector_volume=vector_volume, insert_volume=insert_volume, final_volume=final_volume
    )


def ligation_control(vector_mass: float, vector_conc: float, final_volume: float) -> LigationMix:
    """Vector-only control for a ligation: same vector mass, no insert, water in its place.

    Args:
        vector_mass: Mass of vector, ng. Use the same value as the main reaction.
        vector_conc: Vector concentration, ng/µL.
        final_volume: Final reaction volume, µL.

    Returns:
        Volumes for one control reaction, µL.

    Raises:
        ValueError: If the vector, buffer and ligase exceed the final volume.
    """
    vector_volume = vector_mass / vector_conc
    return _assemble_ligation_mix(vector_volume, 0.0, final_volume)
