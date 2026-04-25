// src/App.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DonationForm from './components/DonationForm.jsx';
import BlogForm from './components/BlogForm.jsx';
import GetInvolvedForm from './components/GetInvolvedForm.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (user) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Page Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {currentPage === 'home' && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h1>Welcome to Yellow Movement</h1>
            <p style={{ fontSize: '18px', color: '#666' }}>
              Join us in making a positive impact. Donate, share your story, or get involved!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #f0c346' }}>
                <h3>Donate</h3>
                <p>Support our cause with a financial contribution</p>
                <button onClick={() => setCurrentPage('donate')} style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0c346',
                  color: '#39365d',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>Donate Now</button>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #39365d' }}>
                <h3>Share a Story</h3>
                <p>Publish your blog post and inspire others</p>
                <button onClick={() => setCurrentPage('blog')} style={{
                  padding: '10px 20px',
                  backgroundColor: '#39365d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>Share Blog</button>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #39365d' }}>
                <h3>Get Involved</h3>
                <p>Volunteer and be part of the movement</p>
                <button onClick={() => setCurrentPage('involved')} style={{
                  padding: '10px 20px',
                  backgroundColor: '#39365d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>Join Us</button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'donate' && <DonationForm />}
        {currentPage === 'blog' && <BlogForm />}
        {currentPage === 'involved' && <GetInvolvedForm />}
        {currentPage === 'login' && <Login onLogin={handleLogin} />}
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#39365d',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px'
      }}>
        <p>© 2026 Yellow Movement. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;