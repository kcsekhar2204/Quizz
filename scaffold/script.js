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

    // Quiz -> Results
    setTimeout(() => {
        clearInterval(timeRunning)
        element("quizScreen").classList.add("hidden")
        element("endScreen").classList.remove("hidden")
        element("finalScore").innerHTML = `Your score: ${score}`
        element("endMessage").innerHTML = `Good job. Learned something new, right?`
    }, timeLeft*1000)

    element("timer").innerHTML = `Time left: ${timeLeft} seconds`
    var timeRunning = setInterval(() => {
        element("timer").innerHTML = `Time left: ${--timeLeft} seconds`
    }, 1000)

    element("start-rules").classList.add("hidden")
    element("startScreen").classList.add("hidden")
    element("quizScreen").classList.remove("hidden")
    element("score").innerHTML = `${score}`

    showQuestions()
}

function isCorrectAnswer(optionClicked, correctAnswer) {
    if(optionClicked === correctAnswer) {
        score += 10
        element("score").innerHTML = `${score}`
        if(timeLeft > 0) showQuestions()
    }
}

const showQuestions = async () => {
    try {
        const res = await fetch(fetchQuestionsURL)
        if(res.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await showQuestions()
        } else{
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
        }
    } catch(e) {
        console.log(e)
        element("question").innerHTML = `${errorMsg}`
        element("options").innerHTML = `${[1,2,3,4].map(option => {
            return `<button class="answer" hidden>${option}</button>`
        }).join('')}`
        if(timeLeft > 0) showQuestions()
    }
}

const playAgain = () => {
    element("endScreen").classList.add("hidden")
    element("quizScreen").classList.remove("hidden")
    score = defaultScore
    timeLeft = quizTime
}

// Rules -> Quiz
element("startQuiz").addEventListener("click", startQuiz)

// Results -> Quiz
element("playAgain").addEventListener("click", playAgain)
