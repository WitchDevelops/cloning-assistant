from typing import NamedTuple


class Dilution(NamedTuple):
    """Volumes to combine, µL."""

    stock: float
    diluent: float


def dilution(stock_conc: float, final_conc: float, final_volume: float) -> Dilution:
    """Volumes of stock and diluent for a C1V1 = C2V2 dilution.

    Args:
        stock_conc: Concentration of the stock, any unit.
        final_conc: Desired concentration, same unit as stock_conc.
        final_volume: Desired final volume, µL.

    Returns:
        Volumes of stock and diluent to combine, µL.
    """
    stock_volume = (final_conc * final_volume) / stock_conc
    diluent_volume = final_volume - stock_volume
    return Dilution(stock=stock_volume, diluent=diluent_volume)
