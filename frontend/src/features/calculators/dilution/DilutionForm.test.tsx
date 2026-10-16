import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { postDilution } from '@/api/dilution';
import { DilutionForm } from './DilutionForm';

const renderForm = () => {
	render(<DilutionForm />);
	return screen.getByRole('status');
};

vi.mock('@/api/dilution', () => ({
	postDilution: vi.fn(),
}));

afterEach(() => {
	cleanup();
});

describe('Dilution result live region', () => {
	it('is present and empty before the first calculation', () => {
		const liveRegion = renderForm();
		expect(liveRegion).toBeEmptyDOMElement();
	});
	it('renders the result in live region after the calculation', async () => {
		const user = userEvent.setup();
		// fill in the form with the placeholder values, so 100mM stock concentration, 50mM working concentration, 100uL final volume and submit
		const liveRegion = renderForm();
		const stockConc = screen.getByLabelText('Stock concentration value');
		const workingConc = screen.getByLabelText('Working concentration value');
		const finalVolume = screen.getByLabelText('Final volume value');
		const submitBtn = screen.getByRole('button', { name: /calculate/i });

		await user.type(stockConc, '100');
		await user.type(workingConc, '50');
		await user.type(finalVolume, '100');

		vi.mocked(postDilution).mockResolvedValue({
			ok: true,
			data: { stock: 50, diluent: 50 },
		});

		await user.click(submitBtn);

		await waitFor(() => {
			expect(liveRegion).toHaveTextContent('Stock solution: 50 µL');
		});
	});
});
