from backend.calculations import Dilution, dilution


def test_dilution_returns_stock_and_diluent_volumes():
    # 100 µM stock, want 500 µL at 10 µM
    # c1 V1 = c2 V2
    result = dilution(stock_conc=100, final_conc=10, final_volume=500)
    assert result == Dilution(stock=50.0, diluent=450.0)
