const socket = io();
const token = localStorage.getItem('token'); // Assume token stored after login

if (!token) {
    window.location.href = '/signup.html';
}

// Fetch user data and initialize streak calendar
async function loadDashboard() {
    try {
        const response = await fetch('/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const user = await response.json();
        renderStreakCalendar(user.jobRequests);
        document.getElementById('streakCount').textContent = user.streak;
        renderJobRequests(user.jobRequests);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Render GitHub-like streak calendar
function renderStreakCalendar(jobRequests) {
    const calendar = document.getElementById('streakCalendar');
    const today = new Date();
    const days = Array(35).fill(0); // 5 weeks
    jobRequests.forEach((job) => {
        const jobDate = new Date(job.date);
        const diffDays = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));
        if (diffDays < 35) days[diffDays]++;
    });

    calendar.innerHTML = '';
    days.forEach((count, i) => {
        const intensity = count > 0 ? Math.min(count, 4) : 0;
        calendar.innerHTML += `
            <div class="w-4 h-4 rounded-sm ${intensity === 0 ? 'bg-gray-200' : `bg-green-${intensity * 100}`}" title="${count} job requests on ${new Date(today - i * 86400000).toLocaleDateString()}"></div>
        `;
    });
}

// Render job requests
function renderJobRequests(jobRequests) {
    const list = document.getElementById('jobRequestsList');
    list.innerHTML = jobRequests.map((job) => `
        <li class="text-gray-600">${job.jobTitle} - ${new Date(job.date).toLocaleDateString()}</li>
    `).join('');
}

// Handle job request form
document.getElementById('jobRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const jobTitle = document.getElementById('jobTitle').value;
    try {
        const response = await fetch('/api/auth/job-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: 'user_id_from_token', jobTitle }), // Replace with actual user ID from token
        });
        const data = await response.json();
        alert(data.message);
        document.getElementById('jobTitle').value = '';
    } catch (error) {
        alert('Error submitting job request');
    }
});

// Real-time streak updates
socket.on('streakUpdate', (data) => {
    document.getElementById('streakCount').textContent = data.streak;
    renderStreakCalendar(data.jobRequests);
    renderJobRequests(data.jobRequests);
});

// Logout
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/signup.html';
});

loadDashboard();