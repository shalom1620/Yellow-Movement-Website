// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  getAllDonations,
  updateDonationStatus,
  getAllBlogs,
  updateBlogStatus,
  getAllGetInvolved,
  updateGetInvolvedStatus
} from '../firestoreService.js';
import { logoutAdmin } from '../authService.js';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('donations');
  const [donations, setDonations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [getInvolved, setGetInvolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [donResult, blogResult, involvedResult] = await Promise.all([
        getAllDonations(),
        getAllBlogs(),
        getAllGetInvolved()
      ]);

      if (donResult.success) setDonations(donResult.data);
      if (blogResult.success) setBlogs(blogResult.data);
      if (involvedResult.success) setGetInvolved(involvedResult.data);

      if (!donResult.success || !blogResult.success || !involvedResult.success) {
        setError('Some data failed to load');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDonationStatusUpdate = async (donationId, newStatus) => {
    const result = await updateDonationStatus(donationId, newStatus, user.email);
    if (result.success) {
      loadAllData();
    } else {
      alert('Error updating status: ' + result.error);
    }
  };

  const handleBlogStatusUpdate = async (blogId, newStatus) => {
    const result = await updateBlogStatus(blogId, newStatus, user.email);
    if (result.success) {
      loadAllData();
    } else {
      alert('Error updating status: ' + result.error);
    }
  };

  const handleGetInvolvedStatusUpdate = async (submissionId, newStatus) => {
    const result = await updateGetInvolvedStatus(submissionId, newStatus, user.email);
    if (result.success) {
      loadAllData();
    } else {
      alert('Error updating status: ' + result.error);
    }
  };

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      onLogout();
    } else {
      alert('Error logging out: ' + result.error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate?.()?.toLocaleString?.() || new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const SubmissionCard = ({ item, type, onStatusChange }) => (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      marginBottom: '15px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          {type === 'donation' && (
            <>
              <p><strong>Email:</strong> {item.email || 'Anonymous'}</p>
              <p><strong>Message:</strong> {item.message || 'No message'}</p>
              {item.receiptUrl && <p><strong>Receipt:</strong> <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</a></p>}
            </>
          )}
          {type === 'blog' && (
            <>
              <p><strong>Title:</strong> {item.title}</p>
              <p><strong>Author:</strong> {item.author || 'Anonymous'}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Content:</strong> {item.content?.substring(0, 100)}...</p>
            </>
          )}
          {type === 'involved' && (
            <>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Phone:</strong> {item.phone || 'N/A'}</p>
              <p><strong>Skills:</strong> {item.skillsOrInterests || 'Not specified'}</p>
              <p><strong>Hours/Week:</strong> {item.availableHours || 'Not specified'}</p>
            </>
          )}
          <p><strong>Submitted:</strong> {formatDate(item.createdAt)}</p>
          <p><strong>Status:</strong> <span style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            backgroundColor: item.status === 'approved' ? '#d4edda' : item.status === 'rejected' ? '#f8d7da' : '#fff3cd',
            color: item.status === 'approved' ? '#155724' : item.status === 'rejected' ? '#721c24' : '#856404'
          }}>{item.status}</span></p>
          {item.reviewedAt && (
            <p><strong>Reviewed:</strong> {formatDate(item.reviewedAt)} by {item.reviewedBy}</p>
          )}
        </div>
        <div style={{ marginLeft: '20px', minWidth: '150px' }}>
          {item.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(item.id, 'approved')}
                style={{
                  display: 'block',
                  width: '100%',
                  marginBottom: '10px',
                  padding: '8px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange(item.id, 'rejected')}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading && !donations.length && !blogs.length && !getInvolved.length) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading submissions...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard - Yellow Movement</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, <strong>{user.email}</strong></span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('donations')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'donations' ? '#39365d' : '#f0f0f0',
            color: activeTab === 'donations' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'donations' ? '3px solid #f0c346' : 'none',
            fontWeight: 'bold'
          }}
        >
          Donations ({donations.length})
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'blogs' ? '#39365d' : '#f0f0f0',
            color: activeTab === 'blogs' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'blogs' ? '3px solid #f0c346' : 'none',
            fontWeight: 'bold'
          }}
        >
          Blog Submissions ({blogs.length})
        </button>
        <button
          onClick={() => setActiveTab('involved')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeTab === 'involved' ? '#39365d' : '#f0f0f0',
            color: activeTab === 'involved' ? 'white' : '#333',
            cursor: 'pointer',
            borderBottom: activeTab === 'involved' ? '3px solid #f0c346' : 'none',
            fontWeight: 'bold'
          }}
        >
          Get Involved ({getInvolved.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'donations' && (
          <div>
            <h2>Donation Submissions</h2>
            {donations.length === 0 ? (
              <p>No donations yet.</p>
            ) : (
              donations.map((donation) => (
                <SubmissionCard
                  key={donation.id}
                  item={donation}
                  type="donation"
                  onStatusChange={handleDonationStatusUpdate}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <h2>Blog Submissions</h2>
            {blogs.length === 0 ? (
              <p>No blog submissions yet.</p>
            ) : (
              blogs.map((blog) => (
                <SubmissionCard
                  key={blog.id}
                  item={blog}
                  type="blog"
                  onStatusChange={handleBlogStatusUpdate}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'involved' && (
          <div>
            <h2>Get Involved Submissions</h2>
            {getInvolved.length === 0 ? (
              <p>No get involved submissions yet.</p>
            ) : (
              getInvolved.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  item={submission}
                  type="involved"
                  onStatusChange={handleGetInvolvedStatusUpdate}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;