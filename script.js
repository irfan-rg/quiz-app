let questions;
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions
fetch('questions.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load questions');
        return response.json();
    })
    .then(data => {
        questions = data;
        startQuiz();
    })
    .catch(error => {
        console.error(error);
        document.body.innerHTML = '<p>Yo, questions didn’t load. Try again later.</p>';
    });

// Start the quiz
function startQuiz() {
    const container = document.getElementById('quiz-container');
    questions.forEach(q => {
        const card = document.createElement('div');
        card.classList.add('question-card');
        card.innerHTML = `
            <div class="question-container">
                <i class="fas fa-question-circle" style="color: black;"></i>
                <p class="question-text">${q.question}</p>
            </div>
            <div class="options">
                ${q.options.map(option => `<button>${option}</button>`).join('')}
            </div>
            <div class="feedback" style="display: none;"></div>
        `;
        container.appendChild(card);
    });
    createProgressDots();
    addEventListeners();
}

// Progress dots
function createProgressDots() {
    const progressDots = document.getElementById('progress-dots');
    questions.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        progressDots.appendChild(dot);
    });
}

// Button clicks
function addEventListeners() {
    document.querySelectorAll('.options button').forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}

// Answer handling
function handleAnswer(event) {
    const selected = event.target.textContent;
    const question = questions[currentQuestionIndex];
    const feedbackDiv = event.target.closest('.question-card').querySelector('.feedback');
    if (selected === question.answer) {
        feedbackDiv.innerHTML = '<i class="fas fa-check correct"></i> Correct!';
        score++;
    } else {
        feedbackDiv.innerHTML = `<i class="fas fa-times incorrect"></i> Nope, it’s ${question.answer}.`;
    }
    feedbackDiv.style.display = 'flex';
    event.target.parentNode.querySelectorAll('button').forEach(btn => btn.disabled = true);
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showNextQuestion();
            updateProgressDots();
        } else {
            showFinalScore();
        }
    }, 1500);
}

// Slide cards
function showNextQuestion() {
    document.getElementById('quiz-container').style.transform = `translateX(-${currentQuestionIndex * 100}vw)`;
}

// Update dots
function updateProgressDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentQuestionIndex);
    });
}

// Final score - Updated to swap positions
function showFinalScore() {
    const finalCard = document.createElement('div');
    finalCard.classList.add('question-card');
    finalCard.innerHTML = `
        <div class="question-container">
            <i class="fas fa-trophy" style="color: black;"></i>
            <p class="question-text">You scored ${score} out of ${questions.length}</p>
        </div>
        <p class="quiz-done">Quiz Done!</p>
    `;
    document.getElementById('quiz-container').appendChild(finalCard);
    showNextQuestion();
}