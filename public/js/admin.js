document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeBtn = document.getElementById('homeBtn');
    const themeBtn = document.getElementById('themeBtn');
    const adminSidebarItems = document.querySelectorAll('.admin-sidebar li');
    const usersTableBody = document.getElementById('usersTableBody');
    const animeManagementContent = document.getElementById('animeManagementContent');
    const clubManagementContent = document.getElementById('clubManagementContent');
    const reportsContent = document.getElementById('reportsContent');
    
    // Initialize the app
    function init() {
        // Check if user is admin
        if (!db.isAdmin()) {
            window.location.href = 'index.html';
            return;
        }
        
        renderUsersTable();
        setupEventListeners();
        checkThemePreference();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Home button
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Theme toggle
        themeBtn.addEventListener('click', toggleTheme);
        
        // Admin sidebar items
        adminSidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                adminSidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show selected tab content
                document.getElementById(`${item.dataset.tab}Tab`).style.display = 'block';
                
                // Load content if needed
                switch(item.dataset.tab) {
                    case 'anime':
                        renderAnimeManagement();
                        break;
                    case 'clubs':
                        renderClubManagement();
                        break;
                    case 'reports':
                        renderReports();
                        break;
                }
            });
        });
    }
    
    // Render users table
    function renderUsersTable() {
        const users = db.getUserData();
        usersTableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn edit-btn" data-user-id="${user.id}">Edit</button>
                    <button class="action-btn delete-btn" data-user-id="${user.id}">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = parseInt(btn.dataset.userId);
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = parseInt(btn.dataset.userId);
                deleteUser(userId);
            });
        });
    }
    
    // Edit user
    function editUser(userId) {
        const users = db.getUserData();
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        const newRole = prompt('Enter new role (admin/user):', user.role);
        if (newRole && (newRole === 'admin' || newRole === 'user')) {
            const updatedUsers = users.map(u => {
                if (u.id === userId) {
                    return { ...u, role: newRole };
                }
                return u;
            });
            
            db.updateUserData(updatedUsers);
            renderUsersTable();
        }
    }
    
    // Delete user
    function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            const users = db.getUserData();
            const updatedUsers = users.filter(u => u.id !== userId);
            
            db.updateUserData(updatedUsers);
            renderUsersTable();
        }
    }
    
    // Render anime management
    function renderAnimeManagement() {
        const animeData = db.getAnimeData();
        animeManagementContent.innerHTML = `
            <div class="admin-anime-list">
                <h3>All Anime (${animeData.length})</h3>
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="animeTableBody">
                        <!-- Anime will be inserted here -->
                    </tbody>
                </table>
            </div>
        `;
        
        const animeTableBody = document.getElementById('animeTableBody');
        animeData.forEach(anime => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${anime.id}</td>
                <td>${anime.title}</td>
                <td>${anime.genre}</td>
                <td>${anime.status}</td>
                <td>
                    <button class="action-btn edit-btn" data-anime-id="${anime.id}">Edit</button>
                    <button class="action-btn delete-btn" data-anime-id="${anime.id}">Delete</button>
                </td>
            `;
            animeTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('#animeTableBody .edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const animeId = parseInt(btn.dataset.animeId);
                editAnime(animeId);
            });
        });
        
        document.querySelectorAll('#animeTableBody .delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const animeId = parseInt(btn.dataset.animeId);
                deleteAnime(animeId);
            });
        });
    }
    
    // Edit anime
    function editAnime(animeId) {
        const animeData = db.getAnimeData();
        const anime = animeData.find(a => a.id === animeId);
        if (!anime) return;
        
        const newStatus = prompt('Enter new status (watching/completed/on-hold/dropped/plan-to-watch):', anime.status);
        if (newStatus && ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch'].includes(newStatus)) {
            const updatedAnimeData = animeData.map(a => {
                if (a.id === animeId) {
                    return { ...a, status: newStatus };
                }
                return a;
            });
            
            db.updateAnimeData(updatedAnimeData);
            renderAnimeManagement();
        }
    }
    
    // Delete anime
    function deleteAnime(animeId) {
        if (confirm('Are you sure you want to delete this anime?')) {
            const animeData = db.getAnimeData();
            const updatedAnimeData = animeData.filter(a => a.id !== animeId);
            
            db.updateAnimeData(updatedAnimeData);
            renderAnimeManagement();
        }
    }
    
    // Render club management
    function renderClubManagement() {
        const communityData = db.getCommunityData();
        clubManagementContent.innerHTML = `
            <div class="admin-club-list">
                <h3>All Clubs (${communityData.clubs.length})</h3>
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Members</th>
                            <th>Discussions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="clubTableBody">
                        <!-- Clubs will be inserted here -->
                    </tbody>
                </table>
            </div>
        `;
        
        const clubTableBody = document.getElementById('clubTableBody');
        communityData.clubs.forEach(club => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${club.id}</td>
                <td>${club.name}</td>
                <td>${club.members.length}</td>
                <td>${club.discussions.length}</td>
                <td>
                    <button class="action-btn edit-btn" data-club-id="${club.id}">Edit</button>
                    <button class="action-btn delete-btn" data-club-id="${club.id}">Delete</button>
                </td>
            `;
            clubTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('#clubTableBody .edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const clubId = parseInt(btn.dataset.clubId);
                editClub(clubId);
            });
        });
        
        document.querySelectorAll('#clubTableBody .delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const clubId = parseInt(btn.dataset.clubId);
                deleteClub(clubId);
            });
        });
    }
    
    // Edit club
    function editClub(clubId) {
        const communityData = db.getCommunityData();
        const club = communityData.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        const newName = prompt('Enter new club name:', club.name);
        if (newName) {
            const updatedClubs = communityData.clubs.map(c => {
                if (c.id === clubId) {
                    return { ...c, name: newName };
                }
                return c;
            });
            
            db.updateCommunityData({ ...communityData, clubs: updatedClubs });
            renderClubManagement();
        }
    }
    
    // Delete club
    function deleteClub(clubId) {
        if (confirm('Are you sure you want to delete this club?')) {
            const communityData = db.getCommunityData();
            const updatedClubs = communityData.clubs.filter(c => c.id !== clubId);
            
            db.updateCommunityData({ ...communityData, clubs: updatedClubs });
            renderClubManagement();
        }
    }
    
    // Render reports
    function renderReports() {
        // In a real app, this would show user reports, flagged content, etc.
        reportsContent.innerHTML = `
            <div class="report-card">
                <h3>No reports at this time</h3>
                <p>The system will display user reports and flagged content here.</p>
            </div>
        `;
    }
    
    // Theme functions
    function checkThemePreference() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        if (isDarkMode) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Initialize the app
    init();
});