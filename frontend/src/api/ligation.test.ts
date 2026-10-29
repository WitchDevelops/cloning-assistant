import { afterEach, beforeEach, expect, it, type Mock, vi } from 'vitest';
import {
	type LigationRequest,
	type LigationResponse,
	postLigation,
} from './ligation';

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => {
	vi.unstubAllGlobals();
});

const request: LigationRequest = {
	vectorLength: { unit: 'kb', value: 4 },
	vectorConc: { unit: 'ng/µL', value: 100 },
	vectorMass: { unit: 'ng', value: 50 },
	insertLength: { unit: 'bp', value: 1200 },
	insertConc: { unit: 'ng/µL', value: 20 },
	molarRatio: 3,
	finalVolume: { unit: 'µL', value: 20 },
};

const response: LigationResponse = {
	insertMass: 45,
	reaction: {
		vectorVolume: 0.5,
		insertVolume: 2.25,
		ligaseVolume: 1,
		ligaseBufferVolume: 2,
		waterVolume: 14.25,
	},
	control: {
		vectorVolume: 0.5,
		insertVolume: 0,
		ligaseVolume: 1,
		ligaseBufferVolume: 2,
		waterVolume: 16.5,
	},
};

it('sends the ligation request to the backend', async () => {
	(fetch as Mock).mockResolvedValueOnce(new Response(JSON.stringify(response)));

	const result = await postLigation(request);

	expect(fetch).toHaveBeenCalledWith(
		expect.stringContaining('/ligation'),
		expect.objectContaining({ method: 'POST', body: JSON.stringify(request) }),
	);

	expect(result.ok).toBe(true);
});

it('parses the backend response, including a zero-insert control', async () => {
	(fetch as Mock).mockResolvedValueOnce(new Response(JSON.stringify(response)));

	const result = await postLigation(request);

	if (!result.ok) throw new Error(result.message);
	expect(result.data.control.insertVolume).toBe(0);
});

it('reports a parse failure when the response is missing the control reaction', async () => {
	const { insertMass, reaction } = response;
	(fetch as Mock).mockResolvedValueOnce(
		new Response(JSON.stringify({ insertMass, reaction })),
	);

	const result = await postLigation(request);

	expect(result).toMatchObject({ ok: false, kind: 'parse' });
});
