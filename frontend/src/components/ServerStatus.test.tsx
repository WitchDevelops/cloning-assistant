import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ApiResult } from '@/api/client';
import { type ApiHealthResponse, getApiHealth } from '@/api/health';
import { ServerStatus } from './ServerStatus';

vi.mock('@/api/health', () => ({
	getApiHealth: vi.fn(),
}));

afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

describe('Server status', () => {
	it("Displays server waking message if the service doesn't answer within 3s", () => {
		vi.useFakeTimers();
		vi.mocked(getApiHealth).mockReturnValue(new Promise(() => {}));

		render(<ServerStatus />);

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(screen.getByRole('status')).toHaveTextContent('Waking up');
	});

	it('Does not display waking up message when the service is running', async () => {
		let answer!: (value: ApiResult<ApiHealthResponse>) => void;
		vi.useFakeTimers();

		vi.mocked(getApiHealth).mockReturnValue(
			new Promise((resolve) => {
				answer = resolve;
			}),
		);

		render(<ServerStatus />);

		await act(async () => {
			answer({ ok: true, data: { status: 'ok' } });
		});

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(screen.getByRole('status')).toBeEmptyDOMElement();
	});

	it('Displays the message when the service is waking up but it dissapears when it answers', async () => {
		let answer!: (value: ApiResult<ApiHealthResponse>) => void;

		// service is asleep or slow: request pending past the 3s threshold
		vi.useFakeTimers();

		vi.mocked(getApiHealth).mockReturnValue(
			new Promise((resolve) => {
				answer = resolve;
			}),
		);

		render(<ServerStatus />);

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(screen.getByRole('status')).toHaveTextContent('Waking up');

		// then it answers, so the message disapears
		await act(async () => {
			answer({ ok: true, data: { status: 'ok' } });
		});

		expect(screen.getByRole('status')).toBeEmptyDOMElement();
	});
});
