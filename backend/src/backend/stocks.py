from backend.schemas import Concentration, ConcentrationUnit, Stock

STANDARD_STOCKS: list[Stock] = [
    Stock(
        name="NaCl",
        composition={"NaCl": Concentration(value=5, unit=ConcentrationUnit.M)},
        citation="https://cshprotocols.cshlp.org/content/2006/1/pdb.rec8038",
    ),
    Stock(
        name="Tris-HCl",
        composition={"Tris": Concentration(value=1, unit=ConcentrationUnit.M)},
        ph=8.0,
        note="pH adjusted with HCl to the desired value",
        citation="https://cshprotocols.cshlp.org/content/2006/1/pdb.rec8747",
    ),
    Stock(
        name="TE Buffer 5x",
        composition={
            "Tris": Concentration(value=50, unit=ConcentrationUnit.MM),
            "EDTA": Concentration(value=5, unit=ConcentrationUnit.MM),
        },
        note="TE Buffer 5x concentrated. Dilute before use.",
        citation="https://cshprotocols.cshlp.org/content/2016/5/pdb.rec092320.full",
    ),
]
