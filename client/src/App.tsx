import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import AppLayout from './components/layout/AppLayout';
import Goats from './components/pages/Goats';
import Breeds from './components/pages/Breeds';
import Breeding from './components/pages/Breeding';
import Vendor from './components/pages/Vendor';
import Medicines from './components/pages/Medicines';
import Feed from './components/pages/Feed';
import Tags from './components/pages/Tags';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      ) : (
        <Routes>
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/goats" element={
              <AppLayout>
                <Goats />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/breeds" element={
              <AppLayout>
                <Breeds />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/medicines" element={
              <AppLayout>
                <Medicines />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/feed" element={
              <AppLayout>
                <Feed />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/vendor" element={
              <AppLayout>
                <Vendor />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/breeding" element={
              <AppLayout>
                <Breeding />
              </AppLayout>
            } />
            <Route path="/dashboard/livestock/tags" element={
              <AppLayout>
                <Tags />
              </AppLayout>
            } />
          </Routes>

      )}
    </Router>
  );
}

export default App;
