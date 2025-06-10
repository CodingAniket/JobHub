document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('job-alert-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            createJobAlert();
        }
    });

    function validateForm() {
        let isValid = true;
        const jobTitle = document.getElementById('job-title').value.trim();
        const email = document.getElementById('email').value.trim();

        if (jobTitle === '') {
            alert('Please enter a job title or keywords');
            isValid = false;
        }

        if (email === '') {
            alert('Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function createJobAlert() {
        const formData = new FormData(form);
        const alertData = Object.fromEntries(formData.entries());

        // In a real application, you would send this data to your server
        console.log('Job Alert Created:', alertData);

        // Simulate a successful alert creation
        showSuccessMessage();
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Job alert created successfully! You will receive notifications based on your preferences.';
        
        form.insertAdjacentElement('beforebegin', successMessage);
        form.reset();

        // Remove the success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
});