import z from 'zod';
import { CONCENTRATION_UNIT_VALUES } from '../features/calculators/utils/units';
import { type ApiResult, api } from './client';

const concentrationSchema = z.object({
	value: z.number().positive(),
	unit: z.enum(CONCENTRATION_UNIT_VALUES),
});

const stockSchema = z.object({
	name: z.string(),
	composition: z.record(z.string(), concentrationSchema),
	pH: z.number().nullable(),
	note: z.string().nullable(),
	citation: z.string().nullable(),
});

const stockSolutionsResponseSchema = z.object({
	stocks: z.array(stockSchema),
});

export type StockSolution = z.infer<typeof stockSchema>;
export type StockSolutionsResponse = z.infer<
	typeof stockSolutionsResponseSchema
>;

export const getStockSolutions = (): Promise<
	ApiResult<StockSolutionsResponse>
> => {
	return api.get('/api/stocks', stockSolutionsResponseSchema);
};
