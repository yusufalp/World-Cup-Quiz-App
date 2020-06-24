function bringQuestion(){
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
                <button type="button" id="answer">Submit</button>
                <button type="button" id="next-question">Next</button>
            </div>
        </form>
    </section> 
    `
    $("main").html(questionHtml);
    $("#next-question").hide();

    let answer = STORE.questions[STORE.currentQuestion].answers;
    for (let i=0; i< answer.length ; i++){
        $(".js-options").append(`<li><input id="`+ [i] +`"type="radio" name="options">`+ answer[i] +`</li>`);
    }
}

function updateScoreTable(){
    //Once the quiz starts, score table becomes visible at the top
    //showing the question number, correct and incorrect counts
    let scoreTable = `
        <li>Question: ` + (STORE.currentQuestion+1) + `/` + STORE.questions.length + `</li>
        <li>Correct: ` + STORE.scoreCorrect + `</li>
        <li>Incorrect: ` + STORE.scoreIncorrect + `</li>
    `
    $("header ul").html(scoreTable);
}

function isCorrect(){
    //After an answer is submitted, this functions checks the answer and 
    //provides feedback accordingly. A next button appears to move on to
    //the next question. It also checks if an answer is chosen
    $("body").on("click","#answer", function(event) {
        let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
        let chosenAnswer = $("input[name=options]:checked").attr("id");
        let correctAnswerText = STORE.questions[STORE.currentQuestion].answers[correctAnswer];

        if (typeof chosenAnswer == "undefined") {
            alert("You must choose an option");
            return;
        }  
        
        if(chosenAnswer == correctAnswer){
            STORE.scoreCorrect++;
            $(".options").append("<p class='js-right-answer'>You got it right!</p>");
        } else {
            STORE.scoreIncorrect++;
            $(".options").append("<p class='js-wrong-answer'>You got it wrong <br> Correct answer is " + correctAnswerText + ".</p><br>");
        }

        $('#answer').hide();
        $("input[type=radio]").attr('disabled', true);
        $('#next-question').show();
        updateScoreTable();
        nextButton();
    });
}

function nextButton() {
    //Once the "Next" button is pressed, brings up the next question.
    //If it is the last question in the quiz, it will bring the final score screen
    $(".js-forward-section").on("click", "#next-question", e => {
        STORE.currentQuestion++;
        if(STORE.currentQuestion === STORE.questions.length){
            finalScore();
        } else (
            bringQuestion()
        )
    });
}

function finalScore(){
    //Once the quiz is over, brings the final score page to the front and
    //provides a button to start the quiz again.
    let scorePercantage = STORE.scoreCorrect / STORE.questions.length * 100;
    let finalHtml = `
    <section>
        <h4>Thank you for taking the quiz.</h4>
        <p>You got ` + STORE.scoreCorrect  + ` correct answers and ` + STORE.scoreIncorrect + ` wrong answers</p><br>
        <p>You score is ` + scorePercantage + `%.</p>
        <button type="button" id="start-again">Start Again</button>
    </section>
    `
    $("main").html(finalHtml);

    let scoreTable = `
    
    `
    $("header ul").html(scoreTable);
    startAgain();
}

function startAgain(){
    //This allows user to start the quiz again at the end
    $("body").on("click", "#start-again", e => {
        let landingPage = `
        <section>
            <h2>How much do you know about FIFA World Cup?</h2>
            <p>If you scored with 80% correct, you are an expert at this.</p>
            <button id="js-start-quiz" type="button">Start Quiz</button>
        </section>
        `
        STORE.currentQuestion = 0;
        STORE.scoreIncorrect = 0;
        STORE.scoreCorrect = 0;
        $("main").html(landingPage);
    });
}

function startQuiz(){
    //When "Start Quiz" is pressed, it starts the quiz with the first question
    //and answers from the STORE database where questions and answers are stored
    $("body").on("click", "#js-start-quiz", e => {
        bringQuestion();
        updateScoreTable();
    });
}

function handleQuizApp(){
    startQuiz();
    isCorrect();
}

$(handleQuizApp);