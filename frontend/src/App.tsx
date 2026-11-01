import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Calculators } from './features/calculators/Calculators';
import { DilutionCalculatorPage } from './features/calculators/dilution/DilutionCalculatorPage';
import { LigationCalculatorPage } from './features/calculators/ligation/LigationCalculatorPage';
import { Protocols } from './features/protocols/Protocols';
import { StockSolutions } from './features/stock-solutions/StockSolutions';
import { ROUTES } from './routes';
import './App.css';

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path={ROUTES.home} element={<Calculators />} />
				<Route
					path={ROUTES.dilutionCalculator}
					element={<DilutionCalculatorPage />}
				/>
				<Route
					path={ROUTES.ligationCalculator}
					element={<LigationCalculatorPage />}
				/>
				<Route path={ROUTES.protocols} element={<Protocols />} />
				<Route path={ROUTES.stockSolutions} element={<StockSolutions />} />
			</Route>
		</Routes>
	);
}

export default App;
