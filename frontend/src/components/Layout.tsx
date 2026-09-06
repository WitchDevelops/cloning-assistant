import { NavLink, Outlet } from 'react-router'

export function Layout() {
    return (
        <div className="layout">
            <nav className="nav" aria-label="Sections">
                <NavLink to="/">Calculators</NavLink>
                <NavLink to="/protocols">Protocols</NavLink>
                <NavLink to="/stock-solutions">Stock solutions</NavLink>
            </nav>
            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}
