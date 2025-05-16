document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('postsContainer');
    const userFilter = document.getElementById('userFilter');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('userModal');
    const closeBtn = document.querySelector('.close');
    
    let posts = [];
    let users = [];
    
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
        fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
    ]).then(([postsData, usersData]) => {
        posts = postsData;
        users = usersData;
        
        renderUserFilter();
        renderPosts(posts);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
    
    function renderUserFilter() {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name}`;
            userFilter.appendChild(option);
        });
    }
    
    function renderPosts(postsToRender) {
        postsContainer.innerHTML = '';
        
        postsToRender.forEach(post => {
            const user = users.find(u => u.id === post.userId);
            if (!user) return;
        
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-body">${post.body}</p>
                    <p class="post-author" data-userid="${user.id}">
                        <i class="fas fa-user-edit"></i>
                        ${user.name}
                    </p>
                </div>
            `;
        
            postsContainer.appendChild(postElement);
        });
        
        
        document.querySelectorAll('.post-author').forEach(author => {
            author.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-userid'));
                showUserModal(userId);
            });
        });
    }

    
    function showUserModal(userId) {
        const user = users.find(u => u.id === userId);
        if (!user) return;
    
        const address = user.address ? 
            `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}` : 'N/A';
        const geo = user.address && user.address.geo ? 
            `Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}` : 'N/A';
    
        document.getElementById('modalUserName').innerHTML = `
            <i class="fas fa-user-circle"></i> ${user.name}
        `;
    
        document.getElementById('modalContent').innerHTML = `
            <div class="modal-columns">
                <div class="modal-column">
                    <div class="modal-section">
                        <h6><i class="fas fa-user-tag"></i> BASIC INFO</h6>
                        <p><strong>Name:</strong> ${user.name}</p>
                        <p><strong>Username:</strong> ${user.username}</p>
                    </div>
                    
                    <div class="modal-section">
                        <h6><i class="fas fa-envelope"></i> CONTACT</h6>
                        <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
                        <p><strong>Phone:</strong> ${user.phone}</p>
                        <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
                    </div>
                </div>
                
                <div class="modal-column">
                    <div class="modal-section">
                        <h6><i class="fas fa-building"></i> COMPANY</h6>
                        <p><strong>${user.company.name}</strong></p>
                        <p><strong>Catchphrase: </strong>
                        <br>"${user.company.catchPhrase}"</br></p>
                        <p><strong>BS: </strong><br><em>${user.company.bs}</em></br></p>
                    </div>
                </div>
            </div>
            
            <div class="modal-divider"></div>
            
            <div class="modal-section">
                <h6><i class="fas fa-map-marked-alt"></i> ADDRESS</h6>
                <div class="address-card">
                    <p><strong>Street:</strong> ${user.address.street}</p>
                    <p><strong>Suite:</strong> ${user.address.suite}</p>
                    <p><strong>City:</strong> ${user.address.city}</p>
                    <p><strong>Zipcode:</strong> ${user.address.zipcode}</p>
                    <p><strong>Geo Location:</strong> ${geo}</p>
                </div>
            </div>
        `;
    
        modal.style.display = 'block';
    }


    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    

    userFilter.addEventListener('change', filterPosts);
    searchInput.addEventListener('input', filterPosts);
    
    function filterPosts() {
        const selectedUserId = userFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredPosts = posts;
        

        if (selectedUserId !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.userId === parseInt(selectedUserId));
        }
        

        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm)
            );
        }
        
        renderPosts(filteredPosts);
    }
});