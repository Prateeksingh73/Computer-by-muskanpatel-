const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const studentForm = document.getElementById("studentForm");
const formSuccess = document.getElementById("formSuccess");

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  formSuccess.textContent = `Thank you, ${name}! Your details are ready. This demo does not send or save your information.`;
  formSuccess.hidden = false;
});

const quizProgress = document.getElementById("quizProgress");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizFeedback = document.getElementById("quizFeedback");
const quizNext = document.getElementById("quizNext");
const quizTitle = document.getElementById("quizTitle");
const languageLabel = document.getElementById("languageLabel");
const languageButtons = document.querySelectorAll(".language-button");
const quizLength = 10;
const quizText = {
  en: {
    title: "CCC SYLLABUS PRACTICE",
    language: "Language:",
    question: (number) => `QUESTION ${number} OF ${quizLength}`,
    topic: "Topic",
    choose: "Choose your answer.",
    check: "Check answer →",
    next: "Next question →",
    score: "See your score →",
    correct: "Correct! Great job ✨",
    incorrect: (answer) => `Good try! The correct answer is: ${answer}.`,
    complete: "Quiz complete!",
    completeLabel: "QUIZ COMPLETE",
    scoreLine: (score, total) => `Your score: ${score} / ${total}. ${score === total ? "Excellent work!" : "Keep practising—you can do it!"}`,
    again: "Play again ↻"
  },
  hi: {
    title: "CCC पाठ्यक्रम अभ्यास",
    language: "भाषा:",
    question: (number) => `प्रश्न ${number} / ${quizLength}`,
    topic: "विषय",
    choose: "अपना जवाब चुनें।",
    check: "जवाब जाँचें →",
    next: "अगला सवाल →",
    score: "अपना स्कोर देखें →",
    correct: "सही जवाब! बहुत खूब ✨",
    incorrect: (answer) => `अच्छी कोशिश! सही जवाब है: ${answer}।`,
    complete: "क्विज़ पूरा हुआ!",
    completeLabel: "क्विज़ पूरा",
    scoreLine: (score, total) => `आपका स्कोर: ${score} / ${total}। ${score === total ? "बहुत बढ़िया!" : "अभ्यास करते रहें—आप कर सकते हैं!"}`,
    again: "फिर से खेलें ↻"
  }
};
let language = "en";
let quizRound = [];
let questionIndex = 0;
let score = 0;
let selectedOption = null;
let answerChecked = false;
let quizComplete = false;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  quizRound = shuffle(cccQuestionBank).slice(0, quizLength).map((question) => ({
    ...question,
    optionOrder: shuffle(question.options.en.map((_, index) => index))
  }));
  questionIndex = 0;
  score = 0;
  quizComplete = false;
  showQuestion();
}

function showQuestion() {
  const text = quizText[language];
  const currentQuestion = quizRound[questionIndex];
  quizTitle.textContent = text.title;
  languageLabel.textContent = text.language;
  quizProgress.textContent = text.question(questionIndex + 1);
  quizQuestion.textContent = `${questionIndex + 1}. ${currentQuestion.question[language]}`;
  quizAnswers.replaceChildren();
  currentQuestion.optionOrder.forEach((optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = currentQuestion.options[language][optionIndex];
    button.addEventListener("click", () => {
      if (answerChecked || quizComplete) return;
      quizAnswers.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectedOption = optionIndex;
      quizNext.disabled = false;
    });
    quizAnswers.append(button);
  });
  quizFeedback.textContent = text.choose;
  quizNext.textContent = text.check;
  quizNext.disabled = true;
  selectedOption = null;
  answerChecked = false;
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;
    languageButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    if (quizComplete) {
      quizTitle.textContent = quizText[language].title;
      languageLabel.textContent = quizText[language].language;
      quizQuestion.textContent = quizText[language].complete;
      quizProgress.textContent = quizText[language].completeLabel;
      quizFeedback.textContent = quizText[language].scoreLine(score, quizRound.length);
      quizNext.textContent = quizText[language].again;
    } else {
      showQuestion();
    }
  });
});

quizNext.addEventListener("click", () => {
  if (quizComplete) {
    startQuiz();
    return;
  }

  const text = quizText[language];
  if (!answerChecked) {
    if (selectedOption === null) return;
    answerChecked = true;
    const currentQuestion = quizRound[questionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    const answerButton = [...quizAnswers.querySelectorAll("button")].find((button) =>
      button.textContent === currentQuestion.options[language][currentQuestion.answer]
    );
    if (isCorrect) {
      score += 1;
      answerButton.classList.add("correct");
      quizFeedback.textContent = text.correct;
    } else {
      const selectedButton = [...quizAnswers.querySelectorAll("button")].find((button) =>
        button.textContent === currentQuestion.options[language][selectedOption]
      );
      selectedButton.classList.add("incorrect");
      answerButton.classList.add("correct");
      quizFeedback.textContent = text.incorrect(currentQuestion.options[language][currentQuestion.answer]);
    }
    quizNext.textContent = questionIndex === quizRound.length - 1 ? text.score : text.next;
    return;
  }

  if (questionIndex < quizRound.length - 1) {
    questionIndex += 1;
    showQuestion();
    return;
  }

  quizQuestion.textContent = text.complete;
  quizAnswers.replaceChildren();
  quizProgress.textContent = text.completeLabel;
  quizFeedback.textContent = text.scoreLine(score, quizRound.length);
  quizNext.textContent = text.again;
  quizNext.disabled = false;
  quizComplete = true;
});

startQuiz();

document.getElementById("year").textContent = new Date().getFullYear();
