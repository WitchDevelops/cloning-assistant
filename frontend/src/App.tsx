import { Route, Routes } from "react-router"
import { Layout } from "./components/Layout"
import { Calculators } from "./features/calculators/Calculators"
import { Protocols } from "./features/protocols/Protocols"
import { StockSolutions } from "./features/stock-solutions/StockSolutions"
import './App.css'

function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Calculators />} />
        <Route path="/protocols" element={<Protocols />} />
        <Route path="/stock-solutions" element={<StockSolutions />} />
      </Route>
    </Routes>
  )
}

export default App
