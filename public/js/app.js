document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const animeGrid = document.getElementById('animeGrid');
    const menuCategories = document.querySelectorAll('.menu-categories li');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const themeBtn = document.getElementById('themeBtn');
    const modal = document.getElementById('animeModal');
    const closeBtn = document.querySelector('.close');
    const progressInput = document.getElementById('progressInput');
    const updateProgressBtn = document.getElementById('updateProgress');
    const statusButtons = document.querySelectorAll('.status-btn');
    const communityBtn = document.getElementById('communityBtn');
    const analyticsBtn = document.getElementById('analyticsBtn');
    const addAnimeBtn = document.getElementById('addAnimeBtn');
    const addAnimeModal = document.getElementById('addAnimeModal');
    const addAnimeForm = document.getElementById('addAnimeForm');
    const spoilerToggle = document.getElementById('spoilerToggle');
    const reminderDate = document.getElementById('reminderDate');
    const setReminderBtn = document.getElementById('setReminder');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const newReview = document.getElementById('newReview');
    const submitReview = document.getElementById('submitReview');
    const streamingLinks = document.getElementById('streamingLinks');
    
    // Current state
    let currentCategory = 'all';
    let currentAnimeId = null;
    let animeData = db.getAnimeData();
    
    // Initialize the app
    function init() {
        renderAnimeGrid(animeData);
        setupEventListeners();
        checkThemePreference();
        setupDatePicker();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Menu category click
        menuCategories.forEach(item => {
            item.addEventListener('click', () => {
                menuCategories.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentCategory = item.dataset.category;
                filterAnime();
            });
        });
        
        // Search input
        searchInput.addEventListener('input', filterAnime);
        
        // Genre filter
        genreFilter.addEventListener('change', filterAnime);
        
        // Theme toggle
        themeBtn.addEventListener('click', toggleTheme);
        
        // Modal close
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
            if (e.target === addAnimeModal) {
                addAnimeModal.style.display = 'none';
            }
        });
        
        // Update progress
        updateProgressBtn.addEventListener('click', updateAnimeProgress);
        
        // Status buttons
        statusButtons.forEach(button => {
            button.addEventListener('click', () => {
                updateAnimeStatus(button.dataset.status);
            });
        });
        
        // Community button
        communityBtn.addEventListener('click', () => {
            window.location.href = 'community.html';
        });
        
        // Analytics button
        analyticsBtn.addEventListener('click', () => {
            window.location.href = 'analytics.html';
        });
        
        // Add anime button
        addAnimeBtn.addEventListener('click', () => {
            addAnimeModal.style.display = 'block';
        });
        
        // Add anime form submit
        addAnimeForm.addEventListener('submit', handleAddAnime);
        
        // Spoiler toggle
        spoilerToggle.addEventListener('change', toggleSpoilers);
        
        // Set reminder
        setReminderBtn.addEventListener('click', setReminder);
        
        // Submit review
        submitReview.addEventListener('click', submitAnimeReview);
        
        // Add close button for add anime modal
        document.querySelector('#addAnimeModal .close').addEventListener('click', () => {
            addAnimeModal.style.display = 'none';
        });
    }
    
    // Set up date picker
    function setupDatePicker() {
        flatpickr("#reminderDate", {
            minDate: "today",
            dateFormat: "Y-m-d"
        });
    }
    
    // Render anime grid
    function renderAnimeGrid(data) {
        animeGrid.innerHTML = '';
        
        if (data.length === 0) {
            animeGrid.innerHTML = '<p>No anime found.</p>';
            return;
        }
        
        const statusText = {
            'watching': 'Watching',
            'completed': 'Completed',
            'on-hold': 'On Hold',
            'dropped': 'Dropped',
            'plan-to-watch': 'Plan to Watch'
        };
        
        data.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            animeCard.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}">
                <div class="card-body">
                    <h3>${anime.title}</h3>
                    <div class="card-info">
                        <span>${anime.progress || 0}/${anime.episodes}</span>
                        <span>${anime.year}</span>
                    </div>
                </div>
                <div class="card-status">${statusText[anime.status] || ''}</div>
            `;
            
            animeCard.addEventListener('click', () => openAnimeModal(anime.id));
            animeGrid.appendChild(animeCard);
        });
    }
    
    // Filter anime based on category, search and genre
    function filterAnime() {
        const searchTerm = searchInput.value.toLowerCase();
        const genre = genreFilter.value;
        
        let filteredData = animeData.filter(anime => {
            const matchesCategory = currentCategory === 'all' || anime.status === currentCategory;
            const matchesSearch = anime.title.toLowerCase().includes(searchTerm);
            const matchesGenre = !genre || anime.genre === genre;
            
            return matchesCategory && matchesSearch && matchesGenre;
        });
        
        renderAnimeGrid(filteredData);
    }
    
    // Open anime modal
    function openAnimeModal(id) {
        const anime = animeData.find(a => a.id === id);
        if (!anime) return;
        
        currentAnimeId = id;
        
        // Set basic info
        document.getElementById('modalImage').src = anime.image || '';
        document.getElementById('modalTitle').textContent = anime.title || 'No title';
        document.getElementById('modalEpisodes').textContent = `${anime.episodes || 0} episodes`;
        document.getElementById('modalGenre').textContent = anime.genre || 'Unknown genre';
        document.getElementById('modalYear').textContent = anime.year || 'Unknown year';
        
        // Calculate average rating
        const reviews = anime.reviews || [];
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length)
            : 0;
        document.getElementById('modalRating').textContent = `★ ${avgRating.toFixed(1)}`;
        
        // Set description with spoiler protection
        const descriptionElement = document.getElementById('modalDescription');
        if (spoilerToggle.checked) {
            descriptionElement.textContent = anime.description || 'No description available';
        } else {
            descriptionElement.innerHTML = `<span class="spoiler-content">Spoiler content hidden</span>`;
        }
        
        progressInput.value = anime.progress || 0;
        
        // Render streaming links
        streamingLinks.innerHTML = '<h3>Watch on:</h3>';
        const links = anime.streamingLinks || [];
        if (links.length > 0) {
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url || '#';
                a.textContent = link.name || 'Unknown';
                a.target = '_blank';
                streamingLinks.appendChild(a);
            });
        } else {
            const noLinks = document.createElement('p');
            noLinks.textContent = 'No streaming links available';
            streamingLinks.appendChild(noLinks);
        }
        
        // Render reviews
        renderReviews(reviews);
        
        modal.style.display = 'block';
    }
    
    // Render reviews
    function renderReviews(reviews) {
        reviewsContainer.innerHTML = '';
        
        const reviewList = Array.isArray(reviews) ? reviews : [];
        
        if (reviewList.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
            return;
        }
        
        reviewList.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-user">${review.username || 'Anonymous'} (${'★'.repeat(review.rating || 0)})</div>
                <div class="review-text">${review.text || 'No text'}</div>
                <div class="review-date">${review.date || 'Unknown date'}</div>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }
    
    // Update anime progress
    function updateAnimeProgress() {
        const newProgress = parseInt(progressInput.value);
        if (isNaN(newProgress)) return;
        
        animeData = animeData.map(anime => {
            if (anime.id === currentAnimeId) {
                return {
                    ...anime,
                    progress: Math.min(newProgress, anime.episodes || 0)
                };
            }
            return anime;
        });
        
        db.updateAnimeData(animeData);
        filterAnime();
    }
    
    // Update anime status
    function updateAnimeStatus(newStatus) {
        animeData = animeData.map(anime => {
            if (anime.id === currentAnimeId) {
                return {
                    ...anime,
                    status: newStatus
                };
            }
            return anime;
        });
        
        db.updateAnimeData(animeData);
        filterAnime();
        modal.style.display = 'none';
    }
    
    // Toggle spoilers
    function toggleSpoilers() {
        const anime = animeData.find(a => a.id === currentAnimeId);
        if (!anime) return;
        
        const descriptionElement = document.getElementById('modalDescription');
        if (spoilerToggle.checked) {
            descriptionElement.textContent = anime.description || 'No description available';
        } else {
            descriptionElement.innerHTML = `<span class="spoiler-content">Spoiler content hidden</span>`;
        }
    }
    
    // Set reminder
    function setReminder() {
        const date = reminderDate.value;
        if (!date) return;
        
        db.addReminder(currentAnimeId, date);
        alert(`Reminder set for ${date}`);
    }
    
    // Submit review
    function submitAnimeReview() {
        const reviewText = newReview.value.trim();
        if (!reviewText) {
            alert('Please enter your review');
            return;
        }
        
        const review = {
            rating: 5, // Default rating for demo
            text: reviewText
        };
        
        const newReviewObj = db.addReview(currentAnimeId, review);
        
        // Update the UI
        const anime = animeData.find(a => a.id === currentAnimeId);
        renderReviews(anime.reviews || []);
        newReview.value = '';
        
        // Update average rating display
        const reviews = anime.reviews || [];
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
            : 'No ratings';
        document.getElementById('modalRating').textContent = `★ ${avgRating}`;
    }
    
    // Handle add anime form submission
    function handleAddAnime(e) {
        e.preventDefault();
        
        const newAnime = {
            title: document.getElementById('animeTitle').value,
            image: document.getElementById('animeImage').value,
            episodes: parseInt(document.getElementById('animeEpisodes').value) || 0,
            progress: 0,
            status: 'plan-to-watch',
            genre: document.getElementById('animeGenre').value,
            year: parseInt(document.getElementById('animeYear').value) || 0,
            description: document.getElementById('animeDescription').value,
            streamingLinks: [],
            reviews: [],
            reminders: []
        };
        
        const addedAnime = db.addAnime(newAnime);
        animeData = db.getAnimeData();
        
        // Reset form and close modal
        addAnimeForm.reset();
        addAnimeModal.style.display = 'none';
        
        // Refresh the grid
        filterAnime();
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