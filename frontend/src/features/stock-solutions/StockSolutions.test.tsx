import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getStockSolutions, type StockSolution } from '@/api/stock-solutions';
import { DilutionCalculatorPage } from '@/features/calculators/dilution/DilutionCalculatorPage';
import { ROUTES } from '@/routes';
import { StockSolutions } from './StockSolutions';

vi.mock('@/api/stock-solutions', () => ({
	getStockSolutions: vi.fn(),
}));

afterEach(() => {
	cleanup();
});

const tris: StockSolution = {
	name: 'Tris-HCl',
	composition: {
		'Tris-HCl': { value: 100, unit: 'mM' },
	},
	concentrationFactor: null,
	ph: 8.0,
	note: null,
	citation: null,
};

describe('Diluting a stock solution', () => {
	it('navigates to the dilution calculator prefilled with the stock', async () => {
		vi.mocked(getStockSolutions).mockResolvedValue({
			ok: true,
			data: { stocks: [tris] },
		});

		render(
			<MemoryRouter initialEntries={[ROUTES.stockSolutions]}>
				<Routes>
					<Route path={ROUTES.stockSolutions} element={<StockSolutions />} />
					<Route
						path={ROUTES.dilutionCalculator}
						element={<DilutionCalculatorPage />}
					/>
				</Routes>
			</MemoryRouter>,
		);
		const trigger = await screen.findByRole('button', {
			name: 'Tris-HCl actions',
		});
		const user = userEvent.setup();
		await user.click(trigger);
		await user.click(screen.getByRole('menuitem', { name: 'Dilute' }));

		// we landed in the correct route (crucial)
		expect(
			screen.getByRole('heading', { level: 1, name: 'Dilution calculator' }),
		).toBeInTheDocument();

		// the page reads the state correctly
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
			'Diluting 100mM Tris-HCl, pH = 8',
		);

		// the data reached the form fields
		expect(screen.getByLabelText('Stock concentration value')).toHaveValue(
			'100',
		);
	});
});
