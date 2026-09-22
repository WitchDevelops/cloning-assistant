import { afterEach, beforeEach, expect, it, type Mock, vi } from 'vitest';
import { postDilution } from './dilution';

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => {
	vi.unstubAllGlobals();
});

it('sends the request to the backend', async () => {
	(fetch as Mock).mockResolvedValueOnce(
		new Response(JSON.stringify({ stock: 5, diluent: 8 }), { status: 200 }),
	);

	const result = await postDilution({
		stockConc: { value: 100, unit: 'mM' },
		finalConc: { value: 10, unit: 'mM' },
		finalVolume: { value: 500, unit: 'µL' },
	});

	expect(fetch).toHaveBeenCalledWith(
		expect.stringContaining('/dilution'),
		expect.objectContaining({ method: 'POST' }),
	);

	expect(result.ok).toBe(true);
});
