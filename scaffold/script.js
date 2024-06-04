//Write your javascript code here
//constants
const errorMsg = "Error fetching the question. Please try again."
const fetchQuestionsURL = 'https://opentdb.com/api.php?amount=1'
const defaultScore = 0
const quizTime = 60 // in seconds

// variables
var score = defaultScore
var timeLeft = quizTime

// functions
const element = (idName) => {
    return document.getElementById(idName)
}

const startQuiz = () => {
    element("start-rules").classList.add("hidden")
    element("startScreen").classList.add("hidden")
    element("quizScreen").classList.remove("hidden")
    element("timer").innerHTML = `Time Left: ${timeLeft} seconds`
    var timeRunning = setInterval(() => {
        element("timer").innerHTML = `Time Left: ${--timeLeft} seconds`
    }, 1000)
    element("score").innerHTML = `Score: ${score}`

    // Quiz -> Results
    setTimeout(() => {
        clearInterval(timeRunning)
        element("quizScreen").classList.add("hidden")
        element("endScreen").classList.remove("hidden")
        element("finalScore").innerHTML = `Your Score: ${score}`
        element("endMessage").innerHTML = `Good job. Learned something new right!!!`
    }, timeLeft*1000)

    showQuestions()
}

function isCorrectAnswer(optionClicked, correctAnswer) {
    if(optionClicked === correctAnswer) {
        score += 10
        element("score").innerHTML = `Score: ${score}`
        if(timeLeft > 0) showQuestions()
    }
}

const showQuestions = async () => {
    try {
        const res = await fetch(fetchQuestionsURL)
        const response = await res.json()
        const data = response.results[0]
        console.log(response)
        element("question").innerHTML = data?.question
        var options = [data.correct_answer, ...data.incorrect_answers]
        if(data.type === "boolean") options = [...options, "", ""]
        options = options.sort(() => Math.random - 0.5)
        element("options").innerHTML = `${options.map(option => {
            return `<button class="answer" onclick='isCorrectAnswer("${option}", "${data.correct_answer}")'>${option}</button>`
        }).join('')}`
    } catch(e) {
        console.log(e)
        element("question").innerHTML = ""
        element("options").innerHTML = `<h2 style="background-color: red; color: white;">${errorMsg}</h2>`
        if(timeLeft > 0) showQuestions()
    }
}

const playAgain = () => {
    element("endScreen").classList.add("hidden")
    element("start-rules").classList.remove("hidden")
    element("startScreen").classList.remove("hidden")
    score = defaultScore
    timeLeft = quizTime
}

// Rules -> Quiz
element("startQuiz").addEventListener("click", startQuiz)

// Results -> Rules
element("playAgain").addEventListener("click", playAgain)
