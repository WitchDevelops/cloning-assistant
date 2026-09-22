import type { z } from 'zod';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export type ApiResult<T> =
	| { ok: true; data: T }
	| { ok: false; kind: 'validation' | 'network'; message: string };

export const api = {
	post: async <T>(
		path: string,
		body: unknown,
		schema: z.ZodType<T>,
	): Promise<ApiResult<T>> => {
		try {
			const res = await fetch(`${BASE}${path}`, {
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
			const parsed = schema.safeParse(json);

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
	},
};
