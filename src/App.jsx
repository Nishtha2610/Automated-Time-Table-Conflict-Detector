import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TimetableProvider } from './context/TimetableContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import WeeklyMatrix from './pages/WeeklyMatrix';
import ScheduleBuilder from './pages/ScheduleBuilder';
import ConflictReports from './pages/ConflictReports';
import ResourceManagement from './pages/ResourceManagement';

import './App.css';

export default function App() {
  return (
    <TimetableProvider>
      <BrowserRouter>
        <div className="app-layout">
          {/* Left-Hand Side Navigation Panel */}
          <Sidebar />

          {/* Right-Hand Side Main Content Area */}
          <div className="app-main-viewport">
            <Header />
            <main className="content-scroll-area">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/matrix" element={<WeeklyMatrix />} />
                <Route path="/builder" element={<ScheduleBuilder />} />
                <Route path="/conflicts" element={<ConflictReports />} />
                <Route path="/resources" element={<ResourceManagement />} />
              </Routes>
            </main>
          </div>

          {/* Toast Notification Container */}
          <ToastContainer position="bottom-right" autoClose={3500} theme="dark" />
        </div>
      </BrowserRouter>
    </TimetableProvider>
  );
}
