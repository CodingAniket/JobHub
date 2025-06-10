document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = encodeURIComponent(this.role.value.trim());
            const location = encodeURIComponent(this.location.value.trim());
            window.location.href = `jobs.html?role=${role}&location=${location}`;
        });
    }

    function filterJobs() {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        const location = urlParams.get('location');

        if (!role && !location) return;

        const jobCards = document.querySelectorAll('.job-card');
        let resultsFound = false;

        jobCards.forEach(card => {
            const jobTitle = card.querySelector('h3').textContent.toLowerCase();
            const jobLocation = card.querySelector('.job-location').textContent.toLowerCase();
            const jobDescription = card.querySelector('.job-description').textContent.toLowerCase();

            const matchesRole = !role || jobTitle.includes(role.toLowerCase()) || jobDescription.includes(role.toLowerCase());
            const matchesLocation = !location || jobLocation.includes(location.toLowerCase());

            if (matchesRole && matchesLocation) {
                card.classList.remove('hidden');
                resultsFound = true;
            } else {
                card.classList.add('hidden');
            }
        });

        const noResultsMessage = document.getElementById('no-results-message');
        if (!resultsFound) {
            if (!noResultsMessage) {
                const message = document.createElement('p');
                message.id = 'no-results-message';
                message.textContent = 'No jobs found matching your search criteria.';
                message.className = 'no-results';
                document.querySelector('.job-grid').appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    if (window.location.pathname.endsWith('jobs.html')) {
        filterJobs();
    }
});