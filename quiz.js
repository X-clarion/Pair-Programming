// Math Quiz Challenge - pair programming activity
// Each question uses one random operator and two operands in the selected range.

const TOTAL_QUESTIONS = 10;
const LIMITS = { beginner: 50, intermediate: 1000, advanced: 10000 };
const OPERATORS = ['+', '-', '×', '÷'];

const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('question-progress');
const questionText = document.getElementById('question-text');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-button');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const resultText = document.getElementById('result-text');

let difficulty = null;
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let answered = false;

// Inclusive random integer: both negative and positive endpoints are possible.
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion(limit) {
  const operator = OPERATORS[randomInteger(0, OPERATORS.length - 1)];
  const first = randomInteger(-limit, limit);
  let second = randomInteger(-limit, limit);

  // Dividing by zero is undefined. Reroll only the second operand if needed.
  if (operator === '÷') {
    while (second === 0) second = randomInteger(-limit, limit);
  }

  let answer;
  switch (operator) {
    case '+': answer = first + second; break;
    case '-': answer = first - second; break;
    case '×': answer = first * second; break;
    case '÷': answer = first / second; break;
  }

  return { first, second, operator, answer };
}

function updateScore() {
  scoreDisplay.textContent = `${correctCount}/${TOTAL_QUESTIONS} correct`;
}

function startQuiz(chosenDifficulty) {
  difficulty = chosenDifficulty;
  const limit = LIMITS[difficulty];
  questions = Array.from({ length: TOTAL_QUESTIONS }, () => createQuestion(limit));
  currentIndex = 0;
  correctCount = 0;
  startScreen.hidden = true;
  resultScreen.hidden = true;
  questionScreen.hidden = false;
  scoreDisplay.hidden = false;
  updateScore();
  showQuestion();
}

function showQuestion() {
  answered = false;
  const question = questions[currentIndex];
  progressDisplay.textContent = `Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`;
  questionText.textContent = `${question.first} ${question.operator} ${question.second} = ?`;
  answerInput.value = '';
  answerInput.disabled = false;
  submitButton.hidden = false;
  nextButton.hidden = true;
  nextButton.textContent = currentIndex === TOTAL_QUESTIONS - 1 ? 'See results' : 'Next question';
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.focus();
}

function checkAnswer(event) {
  event.preventDefault();
  if (answered || answerInput.value.trim() === '') return;
  const userAnswer = Number(answerInput.value);
  if (!Number.isFinite(userAnswer)) return;

  const question = questions[currentIndex];
  // Division may produce repeating decimals. Accept answers within 0.01.
  const isCorrect = Math.abs(userAnswer - question.answer) <= 0.01;
  answered = true;
  if (isCorrect) correctCount++;
  updateScore();
  feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
  feedback.textContent = isCorrect
    ? 'Correct! Great job.'
    : `Incorrect. The correct answer is ${Number(question.answer.toFixed(2))}.`;
  answerInput.disabled = true;
  submitButton.hidden = true;
  nextButton.hidden = false;
  nextButton.focus();
}

function goNext() {
  if (!answered) return;
  currentIndex++;
  if (currentIndex < TOTAL_QUESTIONS) {
    showQuestion();
  } else {
    questionScreen.hidden = true;
    resultScreen.hidden = false;
    resultText.textContent = `You answered ${correctCount} out of ${TOTAL_QUESTIONS} questions correctly.`;
  }
}

// Attach button handlers once. Retry keeps difficulty; changing difficulty does not.
document.querySelectorAll('[data-difficulty]').forEach(button => {
  button.addEventListener('click', () => startQuiz(button.dataset.difficulty));
});
answerForm.addEventListener('submit', checkAnswer);
nextButton.addEventListener('click', goNext);
document.getElementById('retry-button').addEventListener('click', () => startQuiz(difficulty));
document.getElementById('change-button').addEventListener('click', () => {
  resultScreen.hidden = true;
  scoreDisplay.hidden = true;
  startScreen.hidden = false;
});
