import type { StockSolution } from '../../api/stock-solutions';
import type { DilutionFormValues } from '../calculators/dilution/dilutionSchema';

export const toDilutionPrefill = (stock: StockSolution) => {
	const [bufferConcentration] = Object.values(stock.composition);

	if (!bufferConcentration) return {};

	// take the values from the selected stock buffer card
	const prefill: Partial<DilutionFormValues> = {
		stockConcValue: String(bufferConcentration.value),
		stockConcUnit: bufferConcentration.unit,
	};

	// for composite buffers: ensure the "x" times final dilution
	if (stock.concentrationFactor) {
		prefill.finalConcValue = String(
			bufferConcentration.value / stock.concentrationFactor,
		);
		prefill.finalConcUnit = bufferConcentration.unit;
	}

	return prefill;
};
