// src/firestoreService.js
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTIONS = {
  BLOG_SUBMISSIONS: 'blogSubmissions',
  GET_INVOLVED: 'getInvolvedSubmissions',
  DONATIONS: 'donations'
};

// Submit a blog post
export const submitBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_SUBMISSIONS), {
      ...blogData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Submit get involved form
export const submitGetInvolved = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GET_INVOLVED), {
      ...formData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Submit donation with receipt
export const submitDonation = async (donationData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.DONATIONS), {
      email: donationData.email || null,
      message: donationData.message || null,
      isAnonymous: donationData.isAnonymous || false,
      receiptUrl: donationData.receiptUrl,
      receiptPublicId: donationData.receiptPublicId,
      status: 'pending',
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all donations (admin only)
export const getAllDonations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.DONATIONS));
    const donations = [];
    querySnapshot.forEach((doc) => {
      donations.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: donations };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update donation status (admin only)
export const updateDonationStatus = async (donationId, status, adminEmail) => {
  try {
    const donationRef = doc(db, COLLECTIONS.DONATIONS, donationId);
    await updateDoc(donationRef, {
      status: status,
      reviewedAt: serverTimestamp(),
      reviewedBy: adminEmail
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all blog submissions (admin only)
export const getAllBlogs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.BLOG_SUBMISSIONS));
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: blogs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update blog status (admin only)
export const updateBlogStatus = async (blogId, status, adminEmail) => {
  try {
    const blogRef = doc(db, COLLECTIONS.BLOG_SUBMISSIONS, blogId);
    await updateDoc(blogRef, {
      status: status,
      reviewedAt: serverTimestamp(),
      reviewedBy: adminEmail
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all get involved submissions (admin only)
export const getAllGetInvolved = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.GET_INVOLVED));
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update get involved status (admin only)
export const updateGetInvolvedStatus = async (submissionId, status, adminEmail) => {
  try {
    const submissionRef = doc(db, COLLECTIONS.GET_INVOLVED, submissionId);
    await updateDoc(submissionRef, {
      status: status,
      reviewedAt: serverTimestamp(),
      reviewedBy: adminEmail
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};