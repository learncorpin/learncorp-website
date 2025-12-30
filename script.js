document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('ri-menu-4-line');
            icon.classList.add('ri-close-line');
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-4-line');
        }
    });

    // Navbar Scroll Effect
    const header = document.querySelector('.header');

    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const statusMsg = document.getElementById('form-status');
            const originalBtnText = submitBtn.innerHTML;

            // Loading State
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            statusMsg.textContent = '';

            // Gather Data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Use relative path for production/local flexibility
                const apiUrl = '/api/contact';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    statusMsg.style.color = '#10b981'; // Green
                    statusMsg.textContent = 'Message sent successfully! We will contact you soon.';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Failed to send');
                }

            } catch (error) {
                console.error('Submission Error:', error);
                statusMsg.style.color = '#ef4444'; // Red
                statusMsg.textContent = error.message || 'Error sending message. Please check if the server is running.';
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Auto-select Internship Role
    const applyBtns = document.querySelectorAll('.apply-btn-role');
    const serviceSelect = document.getElementById('service-select');

    if (applyBtns.length > 0 && serviceSelect) {
        applyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.getAttribute('data-service');
                if (service) {
                    serviceSelect.value = service;
                }
            });
        });
    }

    // AI Chat Widget Logic
    const chatWidget = document.getElementById('ai-chat-widget');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const closeChat = document.getElementById('close-chat');
    const aiFloatBtn = document.querySelector('.ai-float');

    if (chatWidget && aiFloatBtn) {
        // Toggle Chat
        aiFloatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatWidget.classList.add('active');
        });

        closeChat.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });

        // Send Message
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                // Add User Message
                addMessage(message, 'user-message');
                chatInput.value = '';

                // Simulate AI Thinking & Response
                setTimeout(() => {
                    const response = getAIResponse(message);
                    addMessage(response, 'ai-message');
                }, 1000);
            }
        };

        sendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function addMessage(text, className) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', className);
            msgDiv.textContent = text;
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        const acknowledgments = [
            "That's a great point.",
            "I see, that's very interesting.",
            "Good example.",
            "Thanks for sharing that.",
            "Understood."
        ];

        const fallbackQuestions = [
            "What are your key technical strengths related to this?",
            "How do you handle tight deadlines in a project?",
            "Can you describe a time you had to learn a new technology quickly?",
            "What motivates you to work in this field?",
            "Do you prefer working independently or in a team? Why?",
            "Where do you see yourself in 3 years?"
        ];

        function getAIResponse(input) {
            const lowerInput = input.toLowerCase();
            const ack = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];

            // Tech Stack specific
            if (lowerInput.includes('python')) {
                return `${ack} Python is powerful. How would you handle memory management in a large Python application?`;
            } else if (lowerInput.includes('java')) {
                return `${ack} Java is widely used. Can you explain the difference between an abstract class and an interface?`;
            } else if (lowerInput.includes('javascript') || lowerInput.includes('js')) {
                return `${ack} JavaScript is essential for web dev. What are your thoughts on Async/Await vs Promises?`;
            } else if (lowerInput.includes('react')) {
                return `${ack} React is popular. How do you manage state in a complex component tree?`;
            } else if (lowerInput.includes('node')) {
                return `${ack} Node.js is great for backend. How do you handle event loops in Node?`;
            } else if (lowerInput.includes('sql') || lowerInput.includes('database')) {
                return `${ack} Data is key. Explain the difference between INNER JOIN and LEFT JOIN.`;
            } else if (lowerInput.includes('css') || lowerInput.includes('style')) {
                return `${ack} Styling matters. Can you explain the box model?`;
            } else if (lowerInput.includes('html')) {
                return `${ack} Structure is important. What is semantic HTML and why use it?`;
            }

            // General Conversation
            if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                return "Hi there! Ready to practice? Tell me about your background.";
            } else if (lowerInput.includes('background') || lowerInput.includes('experience')) {
                return "That's impressive! Can you describe a challenging project you worked on recently?";
            } else if (lowerInput.includes('project') || lowerInput.includes('work')) {
                return "Interesting. How did you handle technical challenges during that project?";
            } else if (lowerInput.includes('role') || lowerInput.includes('job')) {
                return "We have openings in Web Dev, Data Science, and AI. Which one interests you?";
            }

            // Closing / Thanks
            if (lowerInput.includes('thank') || lowerInput.includes('bye') || lowerInput.includes('finish') || lowerInput.includes('done')) {
                return "Thank you for your responses! It was a pleasure practicing with you. Good luck with your interview preparation!";
            }

            // Fallback
            return `${ack} ${fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]}`;
        }
    }
});
