import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotesList from './pages/NotesList';
import NoteEditor from './pages/NoteEditor';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /** Root application component defining routes and protected areas. */
  return (
    <Routes>
      <Route path="/login" element={<AuthShell><Login /></AuthShell>} />
      <Route path="/register" element={<AuthShell><Register /></AuthShell>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Small wrapper to reuse auth screen styling
function AuthShell({ children }) {
  return <div className="App">{children}</div>;
}

export default App;
