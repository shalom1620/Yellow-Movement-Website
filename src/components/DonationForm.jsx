// src/components/DonationForm.jsx
import React, { useState } from 'react';
import { submitDonation } from '../firestoreService.js';

const DonationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    isAnonymous: false
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', file);
      cloudinaryData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryData
        }
      );

      const data = await response.json();
      return {
        receiptUrl: data.secure_url,
        receiptPublicId: data.public_id
      };
    } catch (error) {
      throw new Error('Failed to upload receipt: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let receiptUrl = '';
      let receiptPublicId = '';

      // Upload receipt to Cloudinary if provided
      if (receiptFile) {
        const uploadResult = await uploadToCloudinary(receiptFile);
        receiptUrl = uploadResult.receiptUrl;
        receiptPublicId = uploadResult.receiptPublicId;
      }

      // Submit to Firestore
      const result = await submitDonation({
        email: formData.isAnonymous ? '' : formData.email,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
        receiptUrl,
        receiptPublicId
      });

      if (result.success) {
        setSuccess(`Thank you for your donation! Submission ID: ${result.id}`);
        setFormData({ email: '', message: '', isAnonymous: false });
        setReceiptFile(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
            />
            Donate Anonymously
          </label>
        </div>

        {!formData.isAnonymous && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email (optional):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        )}

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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="receipt" style={{ display: 'block', marginBottom: '5px' }}>Upload Receipt (JPG, PNG):</label>
          <input
            type="file"
            id="receipt"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '8px' }}
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
            backgroundColor: '#f0c346',
            color: '#39365d',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Donation'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;