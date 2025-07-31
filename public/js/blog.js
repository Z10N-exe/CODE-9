function loadPosts() {
    const posts = Storage.getBlogPosts();
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'bg-blue-50 rounded-lg p-6 shadow-md card';
        postCard.innerHTML = `
            <h3 class="text-lg font-medium text-blue-800">${post.title}</h3>
            <p class="mt-2 text-gray-600">${post.content.substring(0, 100)}...</p>
            <p class="mt-2 text-gray-600"><i class="fas fa-user mr-2"></i>${post.author}</p>
            <p class="mt-2 text-gray-600"><i class="fas fa-calendar-alt mr-2"></i>${new Date(post.createdAt).toLocaleDateString()}</p>
        `;
        blogList.appendChild(postCard);
    });
}

loadPosts();