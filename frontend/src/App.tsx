import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

const Home = () => <h2 className="text-2xl text-white">Inicio</h2>;
const Departments = () => (
  <h2 className="text-2xl text-white">Departamentos</h2>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <nav className="mb-8 flex gap-4 text-sky-400">
        <Link to="/" className="hover:underline">
          Inicio
        </Link>
        <Link to="/depts" className="hover:underline">
          Departamentos
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/depts" element={<Departments />} />
      </Routes>
    </div>
  );
}

export default App;
