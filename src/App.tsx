import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import TeamPage from './pages/TeamPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
        <Route path="/blog" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;