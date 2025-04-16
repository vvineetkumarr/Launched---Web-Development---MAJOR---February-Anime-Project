// Static anime data
const animeData = [
    {
        id: 1,
        title: "Attack on Titan",
        image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        episodes: 75,
        progress: 0,
        status: "plan-to-watch",
        genre: "action",
        year: 2013,
        description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
        streamingLinks: [
            { name: "Crunchyroll", url: "https://www.crunchyroll.com/attack-on-titan" },
            { name: "Netflix", url: "https://www.netflix.com/title/80025073" }
        ],
        reviews: [
            { userId: 1, username: "AnimeFan123", rating: 5, text: "One of the best anime ever made!", date: "2023-05-15" },
            { userId: 2, username: "ShounenLover", rating: 4, text: "Great story and animation.", date: "2023-06-20" }
        ],
        reminders: []
    },
    {
        id: 2,
        title: "Death Note",
        image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
        episodes: 37,
        progress: 10,
        status: "watching",
        genre: "drama",
        year: 2006,
        description: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing the victim's name while picturing their face.",
        streamingLinks: [
            { name: "Netflix", url: "https://www.netflix.com/title/70204970" }
        ],
        reviews: [
            { userId: 3, username: "MysteryFan", rating: 5, text: "Brilliant psychological thriller.", date: "2023-04-10" }
        ],
        reminders: ["2023-12-01"]
    },
    {
        id: 3,
        title: "Demon Slayer",
        image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        episodes: 26,
        progress: 15,
        status: "watching",
        genre: "action",
        year: 2019,
        description: "After his family is brutally murdered and his sister turned into a demon, Tanjiro Kamado becomes a demon slayer to find a cure for his sister and avenge his family.",
        streamingLinks: [
            { name: "Crunchyroll", url: "https://www.crunchyroll.com/demon-slayer-kimetsu-no-yaiba" },
            { name: "Hulu", url: "https://www.hulu.com/series/demon-slayer-kimetsu-no-yaiba-9e5f1a6e-2c11-4e19-a895-6dc8c9c9f2b4" }
        ],
        reviews: [],
        reminders: []
    }
];

// Static user data
const userData = [
    { id: 1, username: "AnimeFan123", email: "fan@example.com", role: "user" },
    { id: 2, username: "ShounenLover", email: "shounen@example.com", role: "user" },
    { id: 3, username: "MysteryFan", email: "mystery@example.com", role: "user" },
    { id: 4, username: "Admin", email: "admin@example.com", role: "admin" }
];

// Static community data
const communityData = {
    clubs: [
        {
            id: 1,
            name: "Shounen Anime Club",
            description: "Discussing all shounen anime and manga",
            members: [1, 2, 3],
            discussions: [
                {
                    id: 1,
                    title: "Best fight scenes in anime?",
                    author: 2,
                    date: "2023-10-15",
                    comments: [
                        { userId: 1, text: "Naruto vs Sasuke was epic!", date: "2023-10-15" },
                        { userId: 3, text: "Goku vs Frieza is legendary", date: "2023-10-16" }
                    ]
                }
            ],
            polls: [
                {
                    id: 1,
                    question: "Which is your favorite shounen anime?",
                    options: ["Naruto", "One Piece", "Dragon Ball", "Bleach"],
                    votes: [0, 0, 0, 0]
                }
            ]
        }
    ]
};

// Initialize localStorage if empty
if (!localStorage.getItem('animeData')) {
    localStorage.setItem('animeData', JSON.stringify(animeData));
}

if (!localStorage.getItem('userData')) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

if (!localStorage.getItem('communityData')) {
    localStorage.setItem('communityData', JSON.stringify(communityData));
}

// Database functions
function getAnimeData() {
    const data = localStorage.getItem('animeData');
    return data ? JSON.parse(data) : [];
}

function updateAnimeData(updatedData) {
    localStorage.setItem('animeData', JSON.stringify(updatedData));
}

function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : [];
}

function updateUserData(updatedData) {
    localStorage.setItem('userData', JSON.stringify(updatedData));
}

function getCommunityData() {
    const data = localStorage.getItem('communityData');
    return data ? JSON.parse(data) : { clubs: [] };
}

function updateCommunityData(updatedData) {
    localStorage.setItem('communityData', JSON.stringify(updatedData));
}

function getCurrentUser() {
    // In a real app, this would come from login system
    return { id: 1, username: "CurrentUser", role: "user" };
}

function isAdmin() {
    const user = getCurrentUser();
    return user.role === "admin";
}

function addAnime(newAnime) {
    const animeData = getAnimeData();
    const maxId = animeData.reduce((max, anime) => Math.max(max, anime.id), 0);
    const animeWithId = { 
        ...newAnime, 
        id: maxId + 1, 
        reviews: [], 
        reminders: [],
        streamingLinks: newAnime.streamingLinks || []
    };
    animeData.push(animeWithId);
    updateAnimeData(animeData);
    return animeWithId;
}

function addReview(animeId, review) {
    const animeData = getAnimeData();
    const user = getCurrentUser();
    const newReview = {
        userId: user.id,
        username: user.username,
        rating: review.rating || 0,
        text: review.text || '',
        date: new Date().toISOString().split('T')[0]
    };
    
    const updatedData = animeData.map(anime => {
        if (anime.id === animeId) {
            return {
                ...anime,
                reviews: [...(anime.reviews || []), newReview]
            };
        }
        return anime;
    });
    
    updateAnimeData(updatedData);
    return newReview;
}

function addReminder(animeId, date) {
    const animeData = getAnimeData();
    const updatedData = animeData.map(anime => {
        if (anime.id === animeId) {
            return {
                ...anime,
                reminders: [...(anime.reminders || []), date]
            };
        }
        return anime;
    });
    
    updateAnimeData(updatedData);
    return true;
}

function joinClub(clubId, userId) {
    const communityData = getCommunityData();
    const updatedClubs = communityData.clubs.map(club => {
        if (club.id === clubId && !club.members.includes(userId)) {
            return {
                ...club,
                members: [...club.members, userId]
            };
        }
        return club;
    });
    
    updateCommunityData({ ...communityData, clubs: updatedClubs });
    return true;
}

function addClubDiscussion(clubId, discussion) {
    const communityData = getCommunityData();
    const user = getCurrentUser();
    const newDiscussion = {
        id: Date.now(),
        title: discussion.title,
        author: user.id,
        date: new Date().toISOString().split('T')[0],
        comments: []
    };
    
    const updatedClubs = communityData.clubs.map(club => {
        if (club.id === clubId) {
            return {
                ...club,
                discussions: [...club.discussions, newDiscussion]
            };
        }
        return club;
    });
    
    updateCommunityData({ ...communityData, clubs: updatedClubs });
    return newDiscussion;
}

function addClubComment(clubId, discussionId, comment) {
    const communityData = getCommunityData();
    const user = getCurrentUser();
    const newComment = {
        userId: user.id,
        text: comment.text,
        date: new Date().toISOString().split('T')[0]
    };
    
    const updatedClubs = communityData.clubs.map(club => {
        if (club.id === clubId) {
            const updatedDiscussions = club.discussions.map(discussion => {
                if (discussion.id === discussionId) {
                    return {
                        ...discussion,
                        comments: [...discussion.comments, newComment]
                    };
                }
                return discussion;
            });
            return { ...club, discussions: updatedDiscussions };
        }
        return club;
    });
    
    updateCommunityData({ ...communityData, clubs: updatedClubs });
    return newComment;
}

function voteInPoll(clubId, pollId, optionIndex) {
    const communityData = getCommunityData();
    const userId = getCurrentUser().id;
    
    const updatedClubs = communityData.clubs.map(club => {
        if (club.id === clubId) {
            const updatedPolls = club.polls.map(poll => {
                if (poll.id === pollId) {
                    const newVotes = [...poll.votes];
                    newVotes[optionIndex] += 1;
                    return { ...poll, votes: newVotes };
                }
                return poll;
            });
            return { ...club, polls: updatedPolls };
        }
        return club;
    });
    
    updateCommunityData({ ...communityData, clubs: updatedClubs });
    return true;
}

// Export functions
window.db = {
    getAnimeData,
    updateAnimeData,
    getUserData,
    updateUserData,
    getCommunityData,
    updateCommunityData,
    getCurrentUser,
    isAdmin,
    addAnime,
    addReview,
    addReminder,
    joinClub,
    addClubDiscussion,
    addClubComment,
    voteInPoll
};