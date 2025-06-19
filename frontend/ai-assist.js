document.addEventListener('DOMContentLoaded', function() {
  const aiButton = document.getElementById('aiAssistButton');
  const answerDiv = document.getElementById('aiAnswerContainer');

  aiButton.onclick = async function() {
    const question = prompt('What would you like to ask the AI assistant?');
    if (!question) return;

    answerDiv.textContent = 'Thinking...';

    try {
      // Replace the URL below with your actual AI backend endpoint
      const response = await fetch('http://localhost:4000/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);

      answerDiv.innerHTML = marked.parse(data.response || 'Sorry, no answer received.');
    } catch (error) {
      answerDiv.textContent = 'Sorry, there was an error getting the answer.';
    }
  };
});
