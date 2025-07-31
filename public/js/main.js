// Load bcryptjs for client-side hashing (for demo only; move to server in production)
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js';
document.head.appendChild(script);

// LocalStorage Utilities
const Storage = {
    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },
    findUser(email) {
        return this.getUsers().find(u => u.email === email);
    },
    getJobRequests(userId) {
        return JSON.parse(localStorage.getItem('jobRequests'))?.filter(j => j.userId === userId) || [];
    },
    saveJobRequest(job) {
        const jobs = JSON.parse(localStorage.getItem('jobRequests')) || [];
        jobs.push(job);
        localStorage.setItem('jobRequests', JSON.stringify(jobs));
    },
    getBlogPosts() {
        return JSON.parse(localStorage.getItem('blogPosts')) || [
            { id: 1, title: 'Why Choose Code 9?', content: 'Discover the benefits of partnering with us...', author: 'Admin', createdAt: new Date().toISOString() },
            { id: 2, title: 'Tech Trends 2025', content: 'Stay ahead with the latest innovations...', author: 'Admin', createdAt: new Date().toISOString() },
        ];
    },
    saveBlogPost(post) {
        const posts = this.getBlogPosts();
        posts.push(post);
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    },
    getJobOpenings() {
        return JSON.parse(localStorage.getItem('jobOpenings')) || [
            { id: 1, title: 'Frontend Developer', description: 'Build stunning UIs...', location: 'Remote' },
            { id: 2, title: 'Backend Engineer', description: 'Develop robust APIs...', location: 'San Francisco' },
        ];
    },
    saveJobOpening(job) {
        const jobs = this.getJobOpenings();
        jobs.push(job);
        localStorage.setItem('jobOpenings', JSON.stringify(jobs));
    },
};

// Mobile Menu Toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});