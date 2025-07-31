function loadJobs() {
    const jobs = Storage.getJobOpenings();
    const jobList = document.getElementById('jobList');
    const jobSelect = document.getElementById('jobId');
    jobList.innerHTML = '';
    jobSelect.innerHTML = '<option value="">Select a job</option>';

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'bg-blue-50 rounded-lg p-6 shadow-md card';
        jobCard.innerHTML = `
            <h3 class="text-lg font-medium text-blue-800">${job.title}</h3>
            <p class="mt-2 text-gray-600">${job.description}</p>
            <p class="mt-2 text-gray-600"><i class="fas fa-map-marker-alt mr-2"></i>${job.location}</p>
        `;
        jobList.appendChild(jobCard);

        const option = document.createElement('option');
        option.value = job.id;
        option.textContent = job.title;
        jobSelect.appendChild(option);
    });
}

document.getElementById('applicationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const jobId = document.getElementById('jobId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const applyBtnText = document.getElementById('applyBtnText');
    const applySpinner = document.getElementById('applySpinner');

    applyBtnText.textContent = 'Submitting...';
    applySpinner.classList.remove('hidden');

    setTimeout(() => {
        alert('Application submitted successfully!');
        document.getElementById('applicationForm').reset();
        applyBtnText.textContent = 'Submit Application';
        applySpinner.classList.add('hidden');
    }, 1000);
});

loadJobs();