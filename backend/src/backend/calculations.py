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
