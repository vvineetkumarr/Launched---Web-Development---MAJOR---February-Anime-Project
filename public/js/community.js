document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const clubsContainer = document.getElementById('clubsContainer');
    const homeBtn = document.getElementById('homeBtn');
    const themeBtn = document.getElementById('themeBtn');
    const createClubBtn = document.getElementById('createClubBtn');
    const clubModal = document.getElementById('clubModal');
    const clubModalBody = document.getElementById('clubModalBody');
    const createClubModal = document.getElementById('createClubModal');
    const createClubForm = document.getElementById('createClubForm');
    
    // Current state
    let communityData = db.getCommunityData();
    
    // Initialize the app
    function init() {
        renderClubs();
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
        
        // Create club button
        createClubBtn.addEventListener('click', () => {
            createClubModal.style.display = 'block';
        });
        
        // Create club form submit
        createClubForm.addEventListener('submit', handleCreateClub);
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === clubModal) {
                clubModal.style.display = 'none';
            }
            if (e.target === createClubModal) {
                createClubModal.style.display = 'none';
            }
        });
        
        // Add close buttons for modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                clubModal.style.display = 'none';
                createClubModal.style.display = 'none';
            });
        });
    }
    
    // Render clubs
    function renderClubs() {
        clubsContainer.innerHTML = '';
        
        if (communityData.clubs.length === 0) {
            clubsContainer.innerHTML = '<p>No clubs found. Create one to get started!</p>';
            return;
        }
        
        communityData.clubs.forEach(club => {
            const clubCard = document.createElement('div');
            clubCard.className = 'club-card';
            
            // Get member count
            const memberCount = club.members.length;
            
            clubCard.innerHTML = `
                <h3>${club.name}</h3>
                <p>${club.description}</p>
                <div class="club-meta">
                    <span><i class="fas fa-users"></i> ${memberCount} members</span>
                    <span><i class="fas fa-comments"></i> ${club.discussions.length} discussions</span>
                </div>
                <button class="view-club-btn" data-club-id="${club.id}">View Club</button>
            `;
            
            clubsContainer.appendChild(clubCard);
        });
        
        // Add event listeners to view club buttons
        document.querySelectorAll('.view-club-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const clubId = parseInt(btn.dataset.clubId);
                openClubModal(clubId);
            });
        });
    }
    
    // Open club modal
    function openClubModal(clubId) {
        const club = communityData.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        const user = db.getCurrentUser();
        const isMember = club.members.includes(user.id);
        
        // Render club content
        clubModalBody.innerHTML = `
            <div class="club-header">
                <h2>${club.name}</h2>
                ${!isMember ? `<button id="joinClubBtn" data-club-id="${club.id}">Join Club</button>` : ''}
            </div>
            <p>${club.description}</p>
            
            <div class="club-tabs">
                <button class="tab-btn active" data-tab="discussions">Discussions</button>
                <button class="tab-btn" data-tab="polls">Polls</button>
                <button class="tab-btn" data-tab="members">Members</button>
            </div>
            
            <div class="tab-content" id="discussionsTab">
                <div class="discussions-list" id="discussionsList">
                    ${renderDiscussions(club.discussions)}
                </div>
                <div class="new-discussion">
                    <h3>Start New Discussion</h3>
                    <input type="text" id="newDiscussionTitle" placeholder="Discussion title">
                    <button id="startDiscussionBtn">Start Discussion</button>
                </div>
            </div>
            
            <div class="tab-content" id="pollsTab" style="display: none;">
                ${renderPolls(club.polls, club.id)}
                <div class="new-poll">
                    <h3>Create New Poll</h3>
                    <input type="text" id="newPollQuestion" placeholder="Poll question">
                    <div id="pollOptions">
                        <input type="text" class="poll-option" placeholder="Option 1">
                        <input type="text" class="poll-option" placeholder="Option 2">
                    </div>
                    <button id="addPollOptionBtn">Add Option</button>
                    <button id="createPollBtn">Create Poll</button>
                </div>
            </div>
            
            <div class="tab-content" id="membersTab" style="display: none;">
                <div class="members-list">
                    ${renderMembers(club.members)}
                </div>
            </div>
        `;
        
        // Set up tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                document.getElementById(`${btn.dataset.tab}Tab`).style.display = 'block';
            });
        });
        
        // Set up join club button
        if (!isMember) {
            document.getElementById('joinClubBtn').addEventListener('click', () => {
                db.joinClub(club.id, user.id);
                communityData = db.getCommunityData();
                openClubModal(clubId); // Refresh the modal
            });
        }
        
        // Set up new discussion
        document.getElementById('startDiscussionBtn').addEventListener('click', () => {
            const title = document.getElementById('newDiscussionTitle').value.trim();
            if (!title) return;
            
            const discussion = { title };
            const newDiscussion = db.addClubDiscussion(club.id, discussion);
            
            // Refresh discussions list
            const updatedClub = communityData.clubs.find(c => c.id === club.id);
            document.getElementById('discussionsList').innerHTML = renderDiscussions(updatedClub.discussions);
            document.getElementById('newDiscussionTitle').value = '';
        });
        
        // Set up poll creation
        document.getElementById('addPollOptionBtn').addEventListener('click', () => {
            const optionsContainer = document.getElementById('pollOptions');
            const optionCount = optionsContainer.querySelectorAll('.poll-option').length;
            const newOption = document.createElement('input');
            newOption.type = 'text';
            newOption.className = 'poll-option';
            newOption.placeholder = `Option ${optionCount + 1}`;
            optionsContainer.appendChild(newOption);
        });
        
        document.getElementById('createPollBtn').addEventListener('click', () => {
            const question = document.getElementById('newPollQuestion').value.trim();
            if (!question) return;
            
            const options = Array.from(document.querySelectorAll('.poll-option'))
                .map(input => input.value.trim())
                .filter(opt => opt !== '');
            
            if (options.length < 2) {
                alert('Please add at least 2 options');
                return;
            }
            
            // In a real app, you would add this to the database
            alert(`Poll created: ${question} with options: ${options.join(', ')}`);
            document.getElementById('newPollQuestion').value = '';
            document.querySelectorAll('.poll-option').forEach(opt => opt.value = '');
        });
        
        clubModal.style.display = 'block';
    }
    
    // Render discussions
    function renderDiscussions(discussions) {
        if (discussions.length === 0) {
            return '<p>No discussions yet. Start one!</p>';
        }
        
        return discussions.map(discussion => `
            <div class="discussion">
                <h4>${discussion.title}</h4>
                <p class="discussion-meta">Started by ${getUsername(discussion.author)} on ${discussion.date}</p>
                <div class="discussion-comments">
                    ${renderComments(discussion.comments)}
                </div>
                <div class="new-comment">
                    <input type="text" class="new-comment-input" placeholder="Add a comment..." data-discussion-id="${discussion.id}">
                    <button class="add-comment-btn">Post</button>
                </div>
            </div>
        `).join('');
    }
    
    // Render comments
    function renderComments(comments) {
        if (comments.length === 0) {
            return '<p>No comments yet.</p>';
        }
        
        return comments.map(comment => `
            <div class="comment">
                <p class="comment-meta">${getUsername(comment.userId)} on ${comment.date}</p>
                <p>${comment.text}</p>
            </div>
        `).join('');
    }
    
    // Render polls
    function renderPolls(polls, clubId) {
        if (polls.length === 0) {
            return '<p>No polls yet. Create one!</p>';
        }
        
        return polls.map(poll => `
            <div class="poll">
                <h4>${poll.question}</h4>
                <div class="poll-options">
                    ${poll.options.map((option, index) => `
                        <div class="poll-option">
                            <button class="vote-btn" data-club-id="${clubId}" data-poll-id="${poll.id}" data-option-index="${index}">Vote</button>
                            <span>${option} (${poll.votes[index]} votes)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // Render members
    function renderMembers(memberIds) {
        const users = db.getUserData();
        return memberIds.map(memberId => {
            const user = users.find(u => u.id === memberId);
            return user ? `
                <div class="member">
                    <img src="https://ui-avatars.com/api/?name=${user.username}&background=random" alt="${user.username}">
                    <span>${user.username}</span>
                </div>
            ` : '';
        }).join('');
    }
    
    // Get username by ID
    function getUsername(userId) {
        const user = db.getUserData().find(u => u.id === userId);
        return user ? user.username : 'Unknown';
    }
    
    // Handle create club form submission
    function handleCreateClub(e) {
        e.preventDefault();
        
        const newClub = {
            id: Date.now(),
            name: document.getElementById('clubName').value,
            description: document.getElementById('clubDescription').value,
            members: [db.getCurrentUser().id],
            discussions: [],
            polls: []
        };
        
        const updatedClubs = [...communityData.clubs, newClub];
        db.updateCommunityData({ clubs: updatedClubs });
        communityData = db.getCommunityData();
        
        // Reset form and close modal
        createClubForm.reset();
        createClubModal.style.display = 'none';
        
        // Refresh clubs list
        renderClubs();
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