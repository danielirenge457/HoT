// API Client for frontend (to integrate with your HTML pages)
// Save this as assets/js/api-client.js and include in your HTML pages

const API_BASE_URL = 'http://localhost:5000/api';

// Users API
async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

async function updateUserProfile(profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

// Donations API
async function createDonation(donationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating donation:', error);
  }
}

async function getDonations() {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching donations:', error);
  }
}

async function getDonationStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching donation stats:', error);
  }
}

// Job Applications API
async function createJobApplication(applicationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting job application:', error);
  }
}

async function getJobApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching job applications:', error);
  }
}

async function updateJobApplicationStatus(applicationId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating application status:', error);
  }
}

// Volunteer API
async function submitVolunteerApplication(volunteerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
  }
}

async function getVolunteerApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
  }
}

async function updateVolunteerStatus(volunteerId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers/${volunteerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating volunteer status:', error);
  }
}

// Job Postings API
async function getJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

async function getJobById(jobId) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
  }
}

async function createJobPosting(jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating job posting:', error);
  }
}

// Health check
async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend is not running:', error);
    return null;
  }
}
