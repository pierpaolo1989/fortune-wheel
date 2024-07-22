import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoPage from "./pages/NoPage";
import MainPage from './pages/MainPage';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/fortune-wheel" element={<MainPage />} />
        <Route path="/*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
  );
}