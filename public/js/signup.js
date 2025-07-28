document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            // Show verification message
            document.getElementById('signupForm').innerHTML = `
                <p class="text-center text-green-600">Please check your email to verify your account.</p>
            `;
        }
    } catch (error) {
        alert('Error signing up');
    }
});