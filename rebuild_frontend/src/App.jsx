import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Register from "./components/Register";

// temporary page

function Placeholder({ title }) {
    return (
        <h2 className="text-xl font-semibold text-gray-800">
            {title} page (coming soon)
        </h2>
    );
}

function NavLink({ to, label }) {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
        to={to}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
            active
            ? "bg-primary text-white shadow-sm"
            : "text-gray-700 hover:text-primary hover:bg-gray-100"
        }`}
        >
            {label}
        </Link>
    );
}

export default function App() {
    return (
        <div className="min-h-dvh flex flex-col bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
            <Header />
            <main className="max-w-[1100px] w-full mx-auto mt-10 mb-12 px-6 sm:px-10 py-8 rounded-2xl min-h-[400px] bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-gray-200">
                <nav className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-3">
                    <NavLink to="/login" label="Login" />
                    <NavLink to="/register" label="Register" />
                    <NavLink to="/report" label="Report" />
                    <NavLink to="/reports" label="View Reports" />
                    <NavLink to="/myreports" label="My Reports" />
                </nav>
                
                <div className="mt-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Placeholder title="Login" />} />
                        <Route path="/register" element={<Register title="Register" />} />
                        <Route path="/report" element={<Placeholder title="Report" />} />
                        <Route path="/reports" element={<Placeholder title="View Reports" />} />
                        <Route path="/myreports" element={<Placeholder title="My Reports" />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}