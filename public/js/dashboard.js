const socket = io('http://localhost:5000');
let chart;

function fetchJobRequests() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/login';
        return [];
    }
    return Storage.getJobRequests(userId);
}

function updateStreakChart(jobs) {
    const ctx = document.getElementById('streakChart').getContext('2d');
    const dates = {};
    jobs.forEach(job => {
        const date = job.createdAt.split('T')[0];
        dates[date] = (dates[date] || 0) + 1;
    });

    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        labels.push(date);
        data.push(dates[date] || 0);
    }

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Job Requests',
                data,
                backgroundColor: data.map(count => count > 0 ? '#f97316' : '#e5e7eb'),
                borderColor: '#2563eb',
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Requests' } },
                x: { title: { display: true, text: 'Date' } },
            },
            plugins: { legend: { display: false } },
            animation: { duration: 1000, easing: 'easeOutBounce' },
        },
    });
}

document.getElementById('jobRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const jobTitle = document.getElementById('jobTitle').value;
    const jobBtnText = document.getElementById('jobBtnText');
    const jobSpinner = document.getElementById('jobSpinner');
    const userId = sessionStorage.getItem('userId');

    jobBtnText.textContent = 'Submitting...';
    jobSpinner.classList.remove('hidden');

    try {
        const response = await fetch('/api/jobs/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: jobTitle }),
        });
        if (response.ok) {
            const job = await response.json();
            Storage.saveJobRequest(job);
            document.getElementById('jobTitle').value = '';
            updateStreakChart(fetchJobRequests());
        } else {
            alert('Failed to submit job request.');
        }
    } catch (error) {
        alert('Error submitting job request.');
    } finally {
        jobBtnText.textContent = 'Submit Request';
        jobSpinner.classList.add('hidden');
    }
});

socket.on('jobRequestUpdate', (job) => {
    const userId = sessionStorage.getItem('userId');
    if (job.userId === userId) {
        Storage.saveJobRequest(job);
        updateStreakChart(fetchJobRequests());
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('userId');
    window.location.href = '/';
});

document.getElementById('mobileLogoutBtn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('userId');
    window.location.href = '/';
});

updateStreakChart(fetchJobRequests());