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


class LigationMix(NamedTuple):
    """Volumes for one T4 ligation reaction: vector, insert, 10x ligase buffer, T4 ligase, water.
    All in µL."""

    vector_volume: float
    insert_volume: float
    ligase_buffer_volume: float
    ligase_volume: float
    water_volume: float


def ligation(
    vector_mass: float,
    vector_length: float,
    insert_length: float,
    vector_conc: float,
    insert_conc: float,
    ratio: float,
    final_volume: float,
    *,
    with_insert: bool = True,
) -> LigationMix:
    """Values needed to calculate the volumes for a ligation mixture.
    Uses formula `ng insert = ng vector × (bp insert / bp vector) × ratio`.

    Args:
        vector_mass: Desired mass of the vector, ng.
        vector_length: Length of the vector, bp.
        insert_length: Length of the insert, bp.
        vector_conc: Vector concentration as measured with nanodrop, ng/µL.
        insert_conc: Insert concentration, ng/µL.
        ratio: Desired ratio, (insert:vector).
        final_volume: Final reaction volume, µL.
        with_insert: When set to False means it's a negative control for vector background.

    Returns:
        Volumes of reactants needed for a single ligation reaction with T4 DNA ligase."""

    insert_mass = vector_mass * (insert_length / vector_length) * ratio if with_insert else 0.0
    vector_volume = vector_mass / vector_conc
    insert_volume = insert_mass / insert_conc if with_insert else 0.0
    ligase_buffer_volume = final_volume / 10
    ligase_volume = final_volume / 20
    water_volume = final_volume - (
        vector_volume + insert_volume + ligase_buffer_volume + ligase_volume
    )

    if water_volume < 0:
        raise ValueError(
            f"Negative water volume: {-water_volume:.1f}µL. "
            "Increase the reaction volume, use less vector, or concentrate the insert."
        )

    return LigationMix(
        vector_volume=vector_volume,
        insert_volume=insert_volume,
        ligase_buffer_volume=ligase_buffer_volume,
        ligase_volume=ligase_volume,
        water_volume=water_volume,
    )
