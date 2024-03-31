let currentQuestion = 0;
let questions;

// Function to display quiz questions
function displayQuestion(questionsData) {
    questions = questionsData;

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const currentQues = questions[currentQuestion];

    questionElement.innerText = currentQues.question;
    optionsElement.innerHTML = '';

    currentQues.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => selectOption(index);
        optionsElement.appendChild(button);
    });

    updateProgress();
}

// Function to handle selecting an option
function selectOption(optionIndex) {
    const response = {
        question: questions[currentQuestion].question,
        answer: questions[currentQuestion].options[optionIndex]
    };

    fetch('/save-response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Response saved:', data);
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                displayQuestion(questions);
            } else {
                alert('Quiz completed!');
                document.getElementById('quiz-container').style.display = 'none';
                document.getElementById('chat-container').style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error saving response:', error);
        });
}

// Function to handle previous question
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion(questions);
    }
}

// Function to handle next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion(questions);
    }
}

// Function to update quiz progress
function updateProgress() {
    const percent = (currentQuestion / (questions.length - 1)) * 100;
    document.getElementById('progress').value = percent;
}

// Fetch quiz questions from the server
fetch('/questions')
    .then(response => response.json())
    .then(questions => {
        displayQuestion(questions);
    })
    .catch(error => console.error('Error fetching questions:', error));

// Chat Interface
const chatHistory = document.getElementById("chat-history");
const userMessageInput = document.getElementById("user-message");
const sendButton = document.getElementById("send-button");

// Function to display chat messages
function displayMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatHistory.appendChild(messageElement);

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Function to send message to AI
async function sendMessageToAI(message) {
    displayMessage("You", message);

    try {
        const aiResponse = await runAI(message);
        displayMessage("AI", aiResponse);
    } catch (error) {
        console.error("Error sending message to AI:", error);
        displayMessage("Error", "Failed to send message to AI");
    }
}

// Event listener for sending message when button is clicked
sendButton.addEventListener("click", async () => {
    const userMessage = userMessageInput.value.trim();
    if (userMessage !== "") {
        await sendMessageToAI(userMessage);
        userMessageInput.value = "";
    }
});

// Event listener for sending message when Enter key is pressed
userMessageInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const userMessage = userMessageInput.value.trim();
        if (userMessage !== "") {
            await sendMessageToAI(userMessage);
            userMessageInput.value = "";
        }
    }
});

// Function to interact with AI model
async function runAI(prompt) {
    // Replace 'YOUR_API_KEY' with your actual API key
    const API_KEY = "AIzaSyAVc-WnP7GATFqMLCjY1i4IT6YsMlJi4p0";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}
