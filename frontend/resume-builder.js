document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const addMoreButtons = document.querySelectorAll('.add-more');
    const downloadSection = document.getElementById('downloadSection');

    const API_URL = 'http://localhost:4000/api/resumes';

    let currentStep = 0;

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
                step.setAttribute('aria-current', 'step');
            } else {
                step.classList.remove('active');
                step.removeAttribute('aria-current');
            }
        });

        formSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep) && currentStep < formSteps.length - 1) {
                currentStep++;
                updateProgress();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgress();
            }
        });
    });

    addMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            const container = document.querySelector(`.${target}-container`);
            const newFields = container.cloneNode(true);
            const inputs = newFields.querySelectorAll('input, textarea');
            const index = container.parentElement.querySelectorAll(`.${target}-container`).length;

            inputs.forEach(input => {
                const newId = input.id.replace(/\d+$/, index);
                input.id = newId;
                input.name = input.name.replace(/\[\d+\]/, `[${index}]`);
                input.value = '';
            });

            container.parentElement.insertBefore(newFields, button);
        });
    });

    function validateStep(step) {
        const currentStepElement = formSteps[step];
        const inputs = currentStepElement.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData(form);
        const resumeData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            workExperience: [],
            education: [],
            skills: formData.get('skillsList').split(',').map(skill => skill.trim())
        };

        // Process work experience
        const jobTitles = formData.getAll('jobTitle[]');
        const companies = formData.getAll('company[]');
        const startDates = formData.getAll('startDate[]');
        const endDates = formData.getAll('endDate[]');
        const jobDescriptions = formData.getAll('jobDescription[]');

        for (let i = 0; i < jobTitles.length; i++) {
            if (jobTitles[i]) {
                resumeData.workExperience.push({
                    jobTitle: jobTitles[i],
                    company: companies[i],
                    startDate: startDates[i],
                    endDate: endDates[i],
                    jobDescription: jobDescriptions[i]
                });
            }
        }

        // Process education
        const degrees = formData.getAll('degree[]');
        const institutions = formData.getAll('institution[]');
        const graduationYears = formData.getAll('graduationYear[]');

        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i]) {
                resumeData.education.push({
                    degree: degrees[i],
                    institution: institutions[i],
                    graduationYear: graduationYears[i]
                });
            }
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resumeData),
            });

            if (response.ok) {
                const result = await response.json();
                downloadSection.innerHTML = `
                    <p>Your resume has been successfully created!</p>
                    <a href="${API_URL}/${result._id}/pdf" class="view-pdf-button" target="_blank">View Resume PDF</a>
                `;
                
                // Add event listener to the new button
                const viewPdfButton = downloadSection.querySelector('.view-pdf-button');
                viewPdfButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const pdfResponse = await fetch(viewPdfButton.href);
                        if (pdfResponse.ok) {
                            const blob = await pdfResponse.blob();
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        } else {
                            throw new Error('Failed to fetch PDF');
                        }
                    } catch (error) {
                        console.error('Error viewing PDF:', error);
                        alert('Failed to load PDF. Please try again.');
                    }
                });
            } else {
                throw new Error('Failed to create resume');
            }
        } catch (error) {
            console.error('Error:', error);
            downloadSection.innerHTML = `<p>An error occurred while creating your resume. Please try again.</p>`;
        }
    });
});