const questions = [
    {
        question: "What is the Gödel incompleteness theorem primarily concerned with?",
        options: [
            "Proving all mathematical systems are complete",
            "Demonstrating the limitations of formal mathematical systems",
            "Developing new mathematical notation",
            "Exploring quantum mechanics principles"
        ],
        correctAnswer: 1
    },
    {
        question: "In quantum mechanics, what does the Copenhagen interpretation primarily state?",
        options: [
            "Particles have definite properties before measurement",
            "Quantum systems exist in multiple states simultaneously until observed",
            "Quantum mechanics is entirely deterministic",
            "Particles can travel faster than light"
        ],
        correctAnswer: 1
    },
    {
        question: "Who proposed the concept of 'paradigm shift' in scientific understanding?",
        options: [
            "Karl Popper",
            "Thomas Kuhn",
            "Imre Lakatos",
            "Paul Feyerabend"
        ],
        correctAnswer: 1
    },
    {
        question: "What does the Sapir-Whorf hypothesis primarily suggest?",
        options: [
            "All languages have universal grammar",
            "Language structure influences cognitive perception",
            "Linguistics is independent of cultural context",
            "Language has no impact on thought processes"
        ],
        correctAnswer: 1
    },
    {
        question: "In set theory, what does Cantor's diagonal argument prove?",
        options: [
            "All sets are finite",
            "Some infinite sets are larger than others",
            "Set theory is inconsistent",
            "Infinite sets cannot be compared"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the primary concept behind Derrida's deconstruction?",
        options: [
            "Texts have fixed, stable meanings",
            "Meaning is fluid and context-dependent",
            "Literary criticism is objective",
            "Language represents reality directly"
        ],
        correctAnswer: 1
    },
    {
        question: "What does the Heisenberg uncertainty principle fundamentally state?",
        options: [
            "All quantum measurements are precise",
            "Certain pairs of physical properties cannot be simultaneously known with absolute precision",
            "Quantum particles follow classical mechanics",
            "Measurement always reveals true particle states"
        ],
        correctAnswer: 1
    },
    {
        question: "In epistemology, what does Gettier primarily challenge?",
        options: [
            "The definition of knowledge as justified true belief",
            "The concept of empirical evidence",
            "Scientific method reliability",
            "Philosophical reasoning methods"
        ],
        correctAnswer: 0
    },
    {
        question: "What is the primary focus of Foucault's work on power?",
        options: [
            "Power is always top-down and repressive",
            "Power is dispersed, productive, and embedded in social relationships",
            "Power exists only in governmental institutions",
            "Power is a static concept"
        ],
        correctAnswer: 1
    },
    {
        question: "What does the Church-Turing thesis fundamentally propose?",
        options: [
            "Computers can solve any computational problem",
            "There are computational problems that cannot be solved algorithmically",
            "All programming languages are equivalent in computational power",
            "Artificial intelligence will surpass human intelligence"
        ],
        correctAnswer: 2
    }
];

class AcademicQuiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.quizContainer = document.getElementById('phd-quiz-container');
        this.renderQuestion();
    }

    renderQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        this.quizContainer.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Academic Knowledge Quiz</h2>
                <div class="text-sm text-gray-600 mb-4">
                    Question ${this.currentQuestionIndex + 1} of ${this.questions.length}
                </div>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <p class="text-blue-800 font-semibold">${currentQuestion.question}</p>
                </div>
            </div>
            
            <div class="space-y-4">
                ${currentQuestion.options.map((option, index) => `
                    <button onclick="quiz.selectAnswer(${index})" class="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition-all">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }

    selectAnswer(optionIndex) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.userAnswers[this.currentQuestionIndex] = optionIndex;

        if (optionIndex === currentQuestion.correctAnswer) {
            this.score++;
        }

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const scorePercentage = Math.round((this.score / this.questions.length) * 100);
        
        this.quizContainer.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-6">Quiz Completed!</h2>
                <div class="text-6xl font-extrabold ${this.getScoreColor()} mb-4">
                    ${this.score}/${this.questions.length}
                </div>
                <p class="text-gray-600 mb-6">
                    You scored ${scorePercentage}%
                </p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <h3 class="text-xl font-semibold mb-4">Detailed Results</h3>
                    ${this.questions.map((q, index) => `
                        <div class="mb-2 p-2 rounded ${this.userAnswers[index] === q.correctAnswer ? 'bg-green-100' : 'bg-red-100'}">
                            <p class="font-medium">${q.question}</p>
                            <p class="text-sm ${this.userAnswers[index] === q.correctAnswer ? 'text-green-800' : 'text-red-800'}">
                                ${this.userAnswers[index] === q.correctAnswer 
                                    ? 'Correct' 
                                    : `Incorrect. Correct answer: ${q.options[q.correctAnswer]}`}
                            </p>
                        </div>
                    `).join('')}
                </div>
                <button onclick="quiz = new AcademicQuiz(questions)" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    Restart Quiz
                </button>
            </div>
        `;
    }

    getScoreColor() {
        const percentage = (this.score / this.questions.length) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }
}

let quiz = new AcademicQuiz(questions);