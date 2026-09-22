import { useEffect, useState } from 'react';
import {
	getStockSolutions,
	type StockSolution,
} from '../../api/stock-solutions';
import { Card } from '../../components/molecules/Card';
import './StockSolutions.css';

export const StockSolutions = () => {
	const [stocks, setStocks] = useState<StockSolution[]>([]);

	useEffect(() => {
		getStockSolutions().then((result) => {
			if (result.ok) {
				setStocks(result.data.stocks);
			} else {
				console.log(result.message);
			}
		});
	}, []);

	return (
		<div className="stocks__container">
			{stocks.map((stock) => (
				<Card key={stock.name} title={stock.name}>
					<div className="stock__row">
						<div className="stock__section stock__box">
							<h3 className="stock__label">Composition</h3>
							<div className="stock__composition">
								{Object.entries(stock.composition).map(
									([ingredient, concentration]) => (
										<p key={ingredient}>
											{ingredient}, {concentration.value} {concentration.unit}
										</p>
									),
								)}
							</div>
						</div>
						{stock.ph !== null && (
							<div className="stock__section stock__box">
								<h3 className="stock__label">pH</h3>
								<p>{stock.ph.toFixed(1)}</p>
							</div>
						)}
					</div>
					{stock.note !== null && (
						<div className="stock__section">
							<h3 className="stock__label">Note</h3>
							<p>{stock.note}</p>
						</div>
					)}
					{stock.citation !== null && (
						<div className="stock__section">
							<h3 className="stock__label">Citation</h3>
							<a
								className="stock__citation"
								href={stock.citation}
								target="_blank"
								rel="noreferrer"
							>
								{stock.citation}
							</a>
						</div>
					)}
				</Card>
			))}
		</div>
	);
};
