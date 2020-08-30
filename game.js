const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions;
        startGame();
    }).catch(err => {
        console.error(err);
});

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions);
    getNewQuestion();
};

getNewQuestion = () => {
    
    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        // go to end page
        return window.location.assign("/end.html");
    }
    
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update progress bar percentage
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS)*100}%`;
    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex]; /* availableQuestions comes from the SPREAD of objects in the array called questions in the startGame function */
    question.innerText = currentQuestion.question; /* displays the object called question => into the DOM element called question */
    
    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion["choice" + number];
    });
    
    availableQuestions.splice(questionIndex, 1); /* removes the questions already asked via splice */
    
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return; /* ignore if not yet accepting answers */
        
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        
        /* 
        
        I found that because I didn't use the ternary method for the classToApply statement, I was able to take advantage of that to add incrementScore(CORRECT_BONUS) to keep the code DRY.
        
        **Is that the wrong way to do it? I prefer my method but I'm still learning so I'm not sure.**
        
        */
        let classToApply = 'incorrect';
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct';
            incrementScore(CORRECT_BONUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();            
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};