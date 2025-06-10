document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('job-application-form');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent the form from actually submitting
      
      // Show pop-up message
      alert('Your application has been submitted successfully!');
      
      // Reset the form
      form.reset();
    });
  });