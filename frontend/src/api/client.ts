import type { z } from 'zod';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export type ApiResult<T> =
	| { ok: true; data: T }
	| {
			ok: false;
			kind: 'network' | 'client' | 'server' | 'parse';
			message: string;
	  };

// FastAPI/Pydantic validation errors have this shape:
// { "detail": [{ "loc": [...], "msg": "...", "type": "..." }, ...] }
// Returns undefined if the body isn't JSON, or doesn't look like that.
const pydanticDetail = async (res: Response): Promise<string | undefined> => {
	try {
		const body = await res.json();
		if (!Array.isArray(body?.detail)) return undefined;
		return body.detail
			.map((issue: { msg?: string }) => issue.msg)
			.filter(Boolean)
			.join(' ');
	} catch {
		return undefined;
	}
};

// Shared by GET and POST: status check, JSON parse, and Zod validation
const parseResponse = async <T>(
	res: Response,
	schema: z.ZodType<T>,
): Promise<ApiResult<T>> => {
	if (!res.ok) {
		const detail = await pydanticDetail(res);
		if (res.status >= 500) {
			return {
				ok: false,
				kind: 'server',
				message: detail ?? `Server error (${res.status}). Please try again.`,
			};
		}
		return {
			ok: false,
			kind: 'client',
			message: detail ?? `Server rejected the request (${res.status}).`,
		};
	}

	try {
		const json = await res.json();
		const parsed = schema.safeParse(json);

		if (!parsed.success) {
			return {
				ok: false,
				kind: 'parse',
				message: 'The server sent a response in an unexpected shape.',
			};
		}

		return { ok: true, data: parsed.data };
	} catch {
		return {
			ok: false,
			kind: 'parse',
			message: 'The server sent a response that could not be parsed.',
		};
	}
};

export const api = {
	get: async <T>(path: string, schema: z.ZodType<T>): Promise<ApiResult<T>> => {
		let res: Response;
		try {
			res = await fetch(`${BASE}${path}`);
		} catch {
			return {
				ok: false,
				kind: 'network',
				message: 'Could not reach the server. Is it running?',
			};
		}

		return parseResponse(res, schema);
	},

	post: async <T>(
		path: string,
		body: unknown,
		schema: z.ZodType<T>,
	): Promise<ApiResult<T>> => {
		let res: Response;
		try {
			res = await fetch(`${BASE}${path}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
		} catch {
			return {
				ok: false,
				kind: 'network',
				message: 'Could not reach the server. Is it running?',
			};
		}

		return parseResponse(res, schema);
	},
};
