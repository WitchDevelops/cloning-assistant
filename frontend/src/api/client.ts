import { z } from 'zod';
import type { Unit } from '../features/calculators/units';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const dilutionResponseSchema = z.object({
	stock: z.number().positive(),
	diluent: z.number().positive(),
});

export type DilutionResponse = z.infer<typeof dilutionResponseSchema>;

export type ApiResult<T> =
	| { ok: true; data: T }
	| { ok: false; kind: 'validation' | 'network'; message: string };

type Quantity = { value: number; unit: Unit };

export type DilutionRequest = {
	stockConc: Quantity;
	finalConc: Quantity;
	finalVolume: Quantity;
};

export const postDilution = async (
	body: DilutionRequest,
): Promise<ApiResult<DilutionResponse>> => {
	try {
		const res = await fetch(`${BASE}/api/dilution`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			return {
				ok: false,
				kind: 'validation',
				message: `Server rejected the request (${res.status}).`,
			};
		}

		const json = await res.json();
		const parsed = dilutionResponseSchema.safeParse(json);

		if (!parsed.success) {
			return {
				ok: false,
				kind: 'validation',
				message: 'The server sent a response in an unexpected shape.',
			};
		}

		return { ok: true, data: parsed.data };
	} catch {
		return {
			ok: false,
			kind: 'network',
			message: 'Could not reach the server. Is it running?',
		};
	}
};
