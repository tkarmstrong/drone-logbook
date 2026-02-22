import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Aircraft from './pages/Aircraft';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="flights" element={<Flights />} />
        <Route path="aircraft" element={<Aircraft />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
