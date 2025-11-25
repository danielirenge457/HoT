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

// Generic fetch list and render helpers for admin pages
async function fetchAndRender(endpoint, renderFn) {
  const token = localStorage.getItem('adminToken');
  if (!token) return window.location.href = '/admin/login.html';
  const res = await fetch(`${API}/admin/${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) return window.location.href = '/admin/login.html';
  const data = await res.json();
  renderFn(data);
}

// Users page
if (document.getElementById('usersTable')) {
  fetchAndRender('users', (rows) => {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = rows.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.name || ''}</td>
        <td>${u.email || ''}</td>
        <td>${u.phone || ''}</td>
        <td>${u.role || ''}</td>
        <td><button onclick="adminDelete('users', ${u.id})" class="btn-secondary">Delete</button></td>
      </tr>
    `).join('');
  });
}

// Donations page
if (document.getElementById('donationsTable')) {
  fetchAndRender('donations', (rows) => {
    const tbody = document.querySelector('#donationsTable tbody');
    tbody.innerHTML = rows.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${d.donor_name}</td>
        <td>${d.donor_email || ''}</td>
        <td>${d.amount}</td>
        <td>${d.payment_method || ''}</td>
        <td>${new Date(d.created_at).toLocaleString()}</td>
        <td><button onclick="adminDelete('donations', ${d.id})" class="btn-secondary">Delete</button></td>
      </tr>
    `).join('');
  });
}

// Job applications page
if (document.getElementById('jobsTable')) {
  fetchAndRender('job-applications', (rows) => {
    const tbody = document.querySelector('#jobsTable tbody');
    tbody.innerHTML = rows.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.name || a.email || ''}</td>
        <td>${a.job_title || a.job_id}</td>
        <td>${a.application_status || ''}</td>
        <td>${new Date(a.applied_at).toLocaleString()}</td>
        <td></td>
      </tr>
    `).join('');
  });
}

// Volunteers
if (document.getElementById('volunteersTable')) {
  fetchAndRender('volunteers', (rows) => {
    const tbody = document.querySelector('#volunteersTable tbody');
    tbody.innerHTML = rows.map(v => `
      <tr>
        <td>${v.id}</td>
        <td>${v.full_name || ''}</td>
        <td>${v.email || ''}</td>
        <td>${v.phone || ''}</td>
        <td>${v.status || ''}</td>
        <td>${new Date(v.applied_at).toLocaleString()}</td>
        <td></td>
      </tr>
    `).join('');
  });
}

// Delete helper
async function adminDelete(resource, id) {
  if (!confirm('Are you sure?')) return;
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API}/admin/${resource}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  if (res.ok) location.reload(); else alert('Failed');
}
