// Admin frontend helper
const API = '/api';

async function adminLogin(email, password) {
  try {
    const res = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  } catch (err) {
    return { error: err.message };
  }
}

// Login page wiring
if (document.getElementById('loginBtn')) {
  document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const msg = document.getElementById('loginMessage');
    msg.textContent = 'Signing in...';

    const result = await adminLogin(email, password);
    if (result && result.token) {
      localStorage.setItem('adminToken', result.token);
      window.location.href = '/admin/dashboard.html';
    } else {
      msg.textContent = result.error || (result && result.message) || 'Login failed';
    }
  });
}

// Dashboard wiring
if (document.getElementById('stats')) {
  (async function loadStats(){
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login.html';
      return;
    }

    try {
      const res = await fetch(`${API}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Unauthorized');
      const stats = await res.json();
      const el = document.getElementById('stats');
      el.innerHTML = `
        <ul>
          <li><strong>Total users:</strong> ${stats.total_users}</li>
          <li><strong>Total donations:</strong> ${stats.total_donations}</li>
          <li><strong>Total donated:</strong> ${stats.total_donated || 0}</li>
          <li><strong>Job applications:</strong> ${stats.total_job_applications}</li>
          <li><strong>Volunteers:</strong> ${stats.total_volunteers}</li>
          <li><strong>Subscribers:</strong> ${stats.total_subscribers}</li>
        </ul>
      `;
    } catch (err) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login.html';
    }
  })();
}

// Logout
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login.html';
  });
}
