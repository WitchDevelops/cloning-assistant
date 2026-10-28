import pytest

from backend.calculations import (
    Dilution,
    LigationMix,
    compute_insert_mass,
    dilution,
    ligation,
    ligation_control,
)


def test_dilution_returns_stock_and_diluent_volumes():
    # 100 µM stock, want 500 µL at 10 µM
    # c1 V1 = c2 V2
    result = dilution(stock_conc=100, final_conc=10, final_volume=500)
    assert result == Dilution(stock=50.0, diluent=450.0)


def test_ligation_returns_correct_reactant_volumes():
    # 50 ng vector, 4000 bp vector length, 1000 bp insert length, ratio 3:1, 20 µL final volume
    # 50 ng/µL vector, 25 ng/µL insert
    result = ligation(
        vector_mass=50.0,
        vector_length=4_000,
        insert_length=1_000,
        vector_conc=50.0,
        insert_conc=25.0,
        ratio=3,
        final_volume=20.0,
    )
    assert result == pytest.approx(
        LigationMix(
            vector_volume=1.0,
            insert_volume=1.5,
            ligase_buffer_volume=2.0,
            ligase_volume=1.0,
            water_volume=14.5,
        )
    )


def test_compute_insert_mass_for_3_to_1_ratio():
    # 50 ng vector, 4000 bp vector, 1200 bp insert, 3:1 insert:vector
    # 50 × (1200 / 4000) × 3 = 50 × 0.3 × 3 = 45 ng
    result = compute_insert_mass(
        vector_mass=50.0, vector_length=4_000, insert_length=1_200, ratio=3
    )
    assert result == 45.0


@pytest.mark.parametrize(
    ("vector_mass", "vector_length", "insert_length", "ratio", "expected"),
    [
        (100.0, 3_000, 3_000, 1, 100.0),  # equal lengths, ratio 1: mass unchanged
        (100.0, 3_000, 6_000, 1, 200.0),  # insert twice the vector: mass doubles
        (100.0, 4_000, 1_000, 1, 25.0),  # insert a quarter of the vector: mass quarters
        (100.0, 3_000, 3_000, 3, 300.0),  # equal lengths, ratio 3: mass triples
        (100.0, 3_000, 3_000, 0.5, 50.0),  # ratio below 1: mass halves
    ],
)
def test_compute_insert_mass_isolates_each_term(
    vector_mass, vector_length, insert_length, ratio, expected
):
    assert compute_insert_mass(vector_mass, vector_length, insert_length, ratio) == expected


def test_ligation_returns_correct_reactant_volumes_for_negative_control():
    # 50 ng vector, 4000 bp vector length, no insert, 20 µL final volume, 50 ng/µL vector
    result = ligation_control(
        vector_mass=50.0,
        vector_conc=50.0,
        final_volume=20.0,
    )
    assert result == pytest.approx(
        LigationMix(
            vector_volume=1.0,
            insert_volume=0.0,
            ligase_buffer_volume=2.0,
            ligase_volume=1.0,
            water_volume=16,
        )
    )


def test_ligation_raises_value_error_for_negative_water_volume():
    # 50 ng vector, 4000 bp vector length, 1000 bp insert length, ratio 3:1, 20 µL final volume
    # 5 ng/µL vector, 5 ng/µL insert
    with pytest.raises(ValueError):
        ligation(
            vector_mass=50.0,
            vector_length=4_000,
            insert_length=1_000,
            vector_conc=5.0,
            insert_conc=5.0,
            ratio=3,
            final_volume=20.0,
        )
