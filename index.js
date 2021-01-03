function bringQuestion() {
    //This brings the first question and answers after the "Start Quiz" button is pressed
    //This brings the next question and answers after "Next" button is pressed
    //A submit button appears for users to submit their answers.
    let myQuestion = STORE.questions[STORE.currentQuestion].title;
    let questionHtml = `
    <section>
        <form>
            <div class="question">
                <h2> ${myQuestion}  </h2>
            </div>
            <div class="options">
                <div>
                    <ul class="js-options">
                    </ul>
                </div>
            </div>
            <div class="js-forward-section">
                <button type="submit" id="answer">Submit</button>
                <button type="button" id="next-question">Next</button>
            </div>
        </form>
    </section> 
    `;
    $("main").html(questionHtml);
}

function bringAnswers() {
    //This function generates the answers for the current question
    let answer = STORE.questions[STORE.currentQuestion].answers;
    for (let i = 0; i < answer.length; i++) {
        $(".js-options").append(`
        <li>
        <input id="${i}" type="radio" name="options" required>
        <label for="${i}">${answer[i]}</label>
        </li>`);
    }
}

function bringQuestionAndAnswers() {
    //This function calls the functions to generate the question and the answers 
    //There comes a next button with the questions and it is hidden at first
    bringQuestion();
    $("#next-question").hide();
    bringAnswers();

}

function updateCorrectIncorrect() {
    //Updates the correct and incorrect score count once an answer is submitted
    let correctIncorrect = `
        <p><span>Correct: ` + STORE.scoreCorrect + `</span>
        <span>Incorrect: ` + STORE.scoreIncorrect + `</span></p>
    `;
    $("#correct-incorrect").html(correctIncorrect);
}

function updateQuestionNumber() {
    //Updates the question number
    let questionNumber = `
        <p>Question: ` + (STORE.currentQuestion + 1) + `/` + STORE.questions.length + `</p>`;

    $("#question-number").html(questionNumber);
}

function isCorrect() {
    //After an answer is submitted, this functions checks the answer and 
    //provides feedback accordingly. A next button appears to move on to
    //the next question. It also checks if an answer is chosen
    $("body").on("submit", "form", function (event) {
        event.preventDefault();
        let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
        let chosenAnswer = $("input[name=options]:checked").attr("id");
        let correctAnswerText = STORE.questions[STORE.currentQuestion].answers[correctAnswer];

        if (chosenAnswer == correctAnswer) {
            STORE.scoreCorrect++;
            $(".options").append("<p class='js-right-answer'>You got it right!</p>");
        } else {
            STORE.scoreIncorrect++;
            $(".options").append("<p class='js-wrong-answer'>You got it wrong <br> Correct answer is " + correctAnswerText + ".</p><br>");
        }

        STORE.page = "feedback";
        render();
    });
}

function nextButton() {
    //Once the "Next" button is pressed, brings up the next question.
    //If it is the last question in the quiz, it will bring the final score screen
    $(".js-forward-section").on("click", "#next-question", e => {
        STORE.currentQuestion++;
        if (STORE.currentQuestion === STORE.questions.length) {
            STORE.page = "final";
        } else {
            STORE.page = "answer";
        }
        render();
    });
}

function finalScore() {
    //Once the quiz is over, brings the final score page to the front and
    //provides a button to start the quiz again.
    let scorePercentage = STORE.scoreCorrect / STORE.questions.length * 100;
    let finalHtml = `
    <section>
        <h4>Thank you for taking the quiz.</h4>
        <p>You got ` + STORE.scoreCorrect + ` correct answers and ` + STORE.scoreIncorrect + ` wrong answers</p><br>
        <p>You score is ` + scorePercentage + `%.</p>
        <button type="button" id="start-again">Start Again</button>
    </section>
    `;
    $("main").html(finalHtml);
}

function finalScoreTable() {
    let scoreTable = `
    <div class="item" id="question-number">
                </div>
                <div class="item" id="correct-incorrect">
                </div>
    `;
    $("header div").html(scoreTable);
}

function startAgain() {
    //This allows user to start the quiz again at the end
    $("body").on("click", "#start-again", e => {
        STORE.page = "landing";
        render();
    });
}

function render() {
    if (STORE.page === "landing") {
        let landingPage = `
        <section>
            <h2>How much do you know about FIFA World Cup?</h2>
            <p>If you scored with 80% correct, you are an expert at this.</p>
            <button id="js-start-quiz" type="button">Start Quiz</button>
        </section>
        `
        $("main").html(landingPage);
    } else if (STORE.page === "question") {
        bringQuestionAndAnswers();
        updateQuestionNumber();
        updateCorrectIncorrect();
    } else if (STORE.page === "final") {
        createFinalPage();
    } else if (STORE.page === "answer") {
        bringQuestionAndAnswers();
        updateQuestionNumber();
    } else if (STORE.page === "feedback") {
        $('#answer').hide();
        $("input[type=radio]").attr('disabled', true);
        $('#next-question').show();
        updateCorrectIncorrect();
        nextButton();
    }
}

function createFinalPage() {
    //Creates the final score page and prepares the start again button
    finalScore();
    finalScoreTable();
    STORE.currentQuestion = 0;
    STORE.scoreIncorrect = 0;
    STORE.scoreCorrect = 0;
    startAgain();
}

function startQuiz() {
    //When "Start Quiz" is pressed, it starts the quiz with the first question
    //and answers from the STORE database where questions and answers are stored
    $("body").on("click", "#js-start-quiz", e => {
        STORE.page = "question";
        render();
    });
}

function handleQuizApp() {
    startQuiz();
    isCorrect();
}

$(handleQuizApp);