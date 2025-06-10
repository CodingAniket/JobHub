// Handle registration
const registerForm = document.querySelector('.auth-form');
if (registerForm && window.location.pathname.includes('register')) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('fullname').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirm-password').value
    };

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/frontend/index.html';
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed');
    }
  });
}

// Handle login
const loginForm = document.querySelector('.auth-form');
if (loginForm && window.location.pathname.includes('login')) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/frontend/index.html';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed');
    }
  });
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const protectedPages = ['/frontend/jobs.html', '/frontend/resume-builder.html',"/frontend/payment.html","/frontend/create-job-alert.html","/frontend/career-advice.html"];
  
    // Debugging log
    console.log('Current Path:', window.location.pathname);
    console.log('Token:', token);
  
    if (protectedPages.some(page => window.location.pathname.endsWith(page)) && !token) {
      alert('You must be logged in to access this page.');
      window.location.href = '/frontend/login.html';
    }
  }
  

// Update UI based on auth status
function updateUI() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navButtons = document.querySelector('.nav-buttons');
  
  if (token && user && navButtons) {
    navButtons.innerHTML = `
      <span class="user-name">Welcome, ${user.name}</span>
      <button onclick="logout()" class="btn logout">Logout</button>
    `;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/frontend/login.html';
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateUI();
});