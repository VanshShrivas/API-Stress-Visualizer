import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/compare" element={<ComparePage />} />
    </Routes>
  );
};

export default AppRouter;
