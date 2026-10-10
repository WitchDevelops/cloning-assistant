import z from 'zod';
import { type ApiResult, api } from './client';

export const apiHealthResponseSchema = z.object({
	status: z.literal('ok'),
});

export type ApiHealthResponse = z.infer<typeof apiHealthResponseSchema>;

export const getApiHealth = (): Promise<ApiResult<ApiHealthResponse>> => {
	return api.get('/api/health', apiHealthResponseSchema);
};
