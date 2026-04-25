// src/components/GetInvolvedForm.jsx
import React, { useState } from 'react';
import { submitGetInvolved } from '../firestoreService.js';

const GetInvolvedForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skillsOrInterests: '',
    availableHours: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      setLoading(false);
      return;
    }

    const result = await submitGetInvolved({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      skillsOrInterests: formData.skillsOrInterests || null,
      availableHours: formData.availableHours || null,
      message: formData.message || null,
      status: 'pending'
    });

    if (result.success) {
      setSuccess(`Thank you for your interest! Submission ID: ${result.id}`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        skillsOrInterests: '',
        availableHours: '',
        message: ''
      });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Get Involved</h2>
      <p>Join the Yellow Movement and make a difference!</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Full Name *:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email *:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone (optional):</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="skillsOrInterests" style={{ display: 'block', marginBottom: '5px' }}>Skills or Interests:</label>
          <textarea
            id="skillsOrInterests"
            name="skillsOrInterests"
            value={formData.skillsOrInterests}
            onChange={handleInputChange}
            placeholder="e.g., Coding, Design, Writing, Event Planning..."
            rows="3"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="availableHours" style={{ display: 'block', marginBottom: '5px' }}>Available Hours per Week:</label>
          <input
            type="text"
            id="availableHours"
            name="availableHours"
            value={formData.availableHours}
            onChange={handleInputChange}
            placeholder="e.g., 5-10 hours"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message (optional):</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#39365d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default GetInvolvedForm;