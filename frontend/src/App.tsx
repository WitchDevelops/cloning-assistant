import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Calculators } from './features/calculators/Calculators';
import { Protocols } from './features/protocols/Protocols';
import { StockSolutions } from './features/stock-solutions/StockSolutions';
import './App.css';
import { DilutionCalculatorPage } from './features/calculators/dilution/DilutionCalculatorPage';
import { LigationCalculatorPage } from './features/calculators/ligation/LigationCalculatorPage';

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Calculators />} />
				<Route
					path="/calculators/dilution"
					element={<DilutionCalculatorPage />}
				/>
				<Route
					path="/calculators/ligation"
					element={<LigationCalculatorPage />}
				/>
				<Route path="/protocols" element={<Protocols />} />
				<Route path="/stock-solutions" element={<StockSolutions />} />
			</Route>
		</Routes>
	);
}

export default App;
