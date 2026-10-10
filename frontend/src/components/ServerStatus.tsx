import { useEffect, useState } from 'react';
import { getApiHealth } from '@/api/health';

export const ServerStatus = () => {
	const [waking, setWaking] = useState(false);
	useEffect(() => {
		let ignore = false;
		const timeout = setTimeout(() => setWaking(true), 3000);

		// Ping the /api/health endpoint to check if the free Render service is running or waking up
		getApiHealth().then(() => {
			if (ignore) return;
			clearTimeout(timeout);
			setWaking(false);
		});

		// cleanup
		return () => {
			ignore = true;
			clearTimeout(timeout);
		};
	}, []);
	return (
		<p role="status" aria-live="polite" className="info">
			{waking
				? 'Waking up the free service. This may take up to a minute.'
				: ''}
		</p>
	);
};
