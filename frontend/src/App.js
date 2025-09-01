import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JiraProvider } from './contexts/JiraContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import QueryTester from './pages/QueryTester';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import About from './pages/About';
import Login from './pages/login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <JiraProvider>
        <Router>
          <div className="min-h-screen bg-secondary-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                 {/* Páginas públicas */}
                 <Route path="/login" element={<Login />} />
                 <Route path="/register" element={<Register />} />
                 <Route path="/about" element={<About />} />
                 
                 {/* Páginas protegidas - precisam de login */}
                 <Route path="/" element={
                   <ProtectedRoute>
                     <Home />
                   </ProtectedRoute>
                 } />
                 <Route path="/query" element={
                   <ProtectedRoute>
                     <QueryTester />
                   </ProtectedRoute>
                 } />
                 <Route path="/favorites" element={
                   <ProtectedRoute>
                     <Favorites />
                   </ProtectedRoute>
                 } />
                 <Route path="/settings" element={
                   <ProtectedRoute>
                     <Settings />
                   </ProtectedRoute>
                 } />
               </Routes>
            </main>
          </div>
        </Router>
      </JiraProvider>
    </AuthProvider>
  );
}

export default App;