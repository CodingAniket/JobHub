// Configuration object for API settings
const config = {
    API_KEY: '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',
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const aiAssistButton = document.getElementById('aiAssistButton');
    const resumeForm = document.getElementById('resumeForm');
    
    aiAssistButton.addEventListener('click', async () => {
      try {
        // Disable the button to prevent multiple clicks
        aiAssistButton.disabled = true;
        aiAssistButton.textContent = 'Getting AI Assistance...';
  
        // Collect form data
        const formData = new FormData(resumeForm);
        const resumeData = Object.fromEntries(formData.entries());
  
        // Simulate API call (replace this with actual API call when ready)
        const aiSuggestions = await simulateAIResponse(resumeData);
  
        // Display AI suggestions
        displayAISuggestions(aiSuggestions);
      } catch (error) {
        console.error('Error getting AI assistance:', error);
        alert('Sorry, there was an error getting AI assistance. Please try again later.');
      } finally {
        // Re-enable the button
        aiAssistButton.disabled = false;
        aiAssistButton.textContent = 'Get AI Assistance';
      }
    });
  
    async function simulateAIResponse(resumeData) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      // Generate mock suggestions based on resume data
      const suggestions = [
        `Consider adding more details about your experience with ${resumeData.skills}.`,
        `Your job title "${resumeData.jobTitle}" is strong. Make sure to highlight key achievements.`,
        `For education, expand on any relevant coursework or projects related to ${resumeData.fieldOfStudy}.`,
        "Include a brief professional summary at the top of your resume.",
        "Quantify your achievements with specific metrics where possible.",
      ];
  
      return suggestions;
    }
  
    function displayAISuggestions(suggestions) {
      // Create a modal to display suggestions
      const modal = document.createElement('div');
      modal.className = 'ai-suggestions-modal';
      modal.innerHTML = `
        <div class="ai-suggestions-content">
          <h2>AI Suggestions for Your Resume</h2>
          <ul>
            ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
          </ul>
          <button id="closeSuggestions">Close</button>
        </div>
      `;
  
      document.body.appendChild(modal);
  
      // Close modal when the close button is clicked
      document.getElementById('closeSuggestions').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
    }
  });
  
  // Error handling for API key configuration
  if (!config.API_KEY) {
    console.error('API key is not configured. Please set the API_KEY in the config object.');
  }
  
  // TODO: Implement actual API call when endpoint is available
  // TODO: Add any additional headers or parameters required by your specific AI service
  // TODO: Adjust the structure of the 'aiSuggestions' object based on your AI service's response format
  