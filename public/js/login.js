const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();

        message.classList.remove('text-green-600', 'text-red-600');
        message.classList.add(result.success ? 'text-green-600' : 'text-red-600');
        message.textContent = result.message;

        if (result.success) {
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }
    } catch (error) {
        message.classList.remove('text-green-600');
        message.classList.add('text-red-600');
        message.textContent = 'An error occurred. Please try again.';
    }
});