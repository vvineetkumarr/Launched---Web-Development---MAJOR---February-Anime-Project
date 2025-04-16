function renderAnalyticsCharts() {
    const animeList = getAnimeData();
    
    // Watch Time Chart
    const ctx1 = document.getElementById('watchTimeChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
            datasets: [{
                label: 'Anime Count',
                data: [
                    animeList.filter(a => a.status === 'watching').length,
                    animeList.filter(a => a.status === 'completed').length,
                    animeList.filter(a => a.status === 'on-hold').length,
                    animeList.filter(a => a.status === 'dropped').length,
                    animeList.filter(a => a.status === 'plan-to-watch').length
                ],
                backgroundColor: [
                    'rgba(106, 90, 205, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        }
    });

    // Genre Distribution Chart
    const ctx2 = document.getElementById('genreDistributionChart').getContext('2d');
    new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: [...new Set(animeList.map(a => a.genre))],
            datasets: [{
                data: [...new Set(animeList.map(a => a.genre))].map(
                    genre => animeList.filter(a => a.genre === genre).length
                ),
                backgroundColor: [
                    '#6a5acd', '#9370db', '#8a2be2', '#9932cc', '#ba55d3'
                ]
            }]
        }
    });
}