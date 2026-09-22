import { afterEach, beforeEach, expect, it, type Mock, vi } from 'vitest';
import { type DilutionRequest, postDilution } from './dilution';

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => {
	vi.unstubAllGlobals();
});

const request: DilutionRequest = {
	stockConc: { value: 100, unit: 'mM' },
	finalConc: { value: 10, unit: 'mM' },
	finalVolume: { value: 500, unit: 'µL' },
};

it('sends the request to the backend', async () => {
	(fetch as Mock).mockResolvedValueOnce(
		new Response(JSON.stringify({ stock: 5, diluent: 8 }), { status: 200 }),
	);

	const result = await postDilution(request);

	expect(fetch).toHaveBeenCalledWith(
		expect.stringContaining('/dilution'),
		expect.objectContaining({ method: 'POST', body: JSON.stringify(request) }),
	);

	expect(result.ok).toBe(true);
});
