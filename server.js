const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Define the questions for the quiz
// const questions = [
//     {
//         question: "How often do you feel sad or hopeless?",
//         options: ["😞 Almost every day", "😔 Several days a week", "😐 Occasionally", "🙂 Rarely or never"]
//     },
//     {
//         question: "Do you often worry excessively about various aspects of your life?",
//         options: ["😥 Yes, all the time", "😰 Quite often", "😕 Sometimes", "😊 Rarely or never"]
//     },
//     {
//         question: "How would you rate your sleep quality?",
//         options: ["😴 Very poor", "😫 Poor", "😐 Average", "😊 Good"]
//     },
//     {
//         question: "Do you experience frequent mood swings?",
//         options: ["😢 Yes, very often", "😣 Occasionally", "😐 Rarely", "😊 Never"]
//     },
//     {
//         question: "Have you noticed changes in your appetite (eating significantly more or less than usual)?",
//         options: ["🍔 Eating significantly more", "🥗 Eating significantly less", "😐 No significant changes", "😊 Not applicable"]
//     },
//     {
//         question: "How often do you feel overwhelmed by stress?",
//         options: ["😰 Almost constantly", "😥 Frequently", "😐 Occasionally", "🙂 Rarely or never"]
//     },
//     {
//         question: "Do you have trouble concentrating on tasks or making decisions?",
//         options: ["🤔 Yes, all the time", "😣 Quite often", "😐 Sometimes", "😊 Rarely or never"]
//     },
//     {
//         question: "How often do you experience physical symptoms such as headaches, stomachaches, or muscle tension?",
//         options: ["😩 Frequently", "😣 Occasionally", "😐 Rarely", "😊 Never"]
//     },
//     {
//         question: "Do you often feel lonely or isolated?",
//         options: ["😔 Very often", "😣 Sometimes", "😐 Rarely", "😊 Never"]
//     },
//     {
//         question: "Have you ever had thoughts of self-harm or suicide?",
//         options: ["😨 Yes, frequently", "😣 Occasionally", "😐 Rarely", "😊 Never"]
//     },
//     {
//         question: "How would you rate your overall level of happiness and satisfaction with life?",
//         options: ["😞 Very unhappy", "😔 Unhappy", "😐 Neutral", "😊 Happy"]
//     },
//     {
//         question: "Do you find it challenging to cope with everyday stressors?",
//         options: ["😰 Very challenging", "😥 Somewhat challenging", "😐 Occasionally challenging", "😊 Not challenging"]
//     },
//     {
//         question: "Have you experienced any traumatic events in your life that still affect you?",
//         options: ["😢 Yes, frequently", "😣 Occasionally", "😐 Rarely", "😊 Never"]
//     },
//     {
//         question: "Do you engage in activities that you used to enjoy?",
//         options: ["😞 Rarely or never", "😔 Occasionally", "😐 Sometimes", "😊 Often"]
//     },
//     {
//         question: "How would you rate your overall energy level and motivation?",
//         options: ["😫 Very low", "😥 Low", "😐 Average", "😊 High"]
//     }
// ];

const questions = [
    {
        question: "Aap kitne dino se udas ya nirash mahsus karte hain?",
        options: ["😞 Lagbhag har din", "😔 Kai dinon tak", "😐 Kabhi kabhi", "🙂 Kabhi nahi"]
    },
    {
        question: "Kya aap apne jeevan ke vibhinn pehluon par atyadhik chintit rahte hain?",
        options: ["😥 Haan, hamesha", "😰 Kaafi baar", "😕 Kabhi kabhi", "😊 Bahut kam ya kabhi nahi"]
    },
    {
        question: "Aap apni neend ki gunvatta ko kaise darj karenge?",
        options: ["😴 Bahut kharab", "😫 Kharab", "😐 Average", "😊 Achha"]
    },
    {
        question: "Kya aap aniyamit roop se bhavna mein parivartan mehsoos karte hain?",
        options: ["😢 Haan, bahut baar", "😣 Kabhi kabhi", "😐 Bahut kam", "😊 Kabhi nahi"]
    },
    {
        question: "Kya aapne apne bhojan mein parivartan mehsus kiya hai (aam se kai zyada ya kam khana)?",
        options: ["🍔 Kai zyada khana", "🥗 Kai kam khana", "😐 Koi mahatvapurn badlav nahi", "😊 Lagoo nahi"]
    },
    {
        question: "Aap kitne samay tak tanav se bhare mahsus karte hain?",
        options: ["😰 Lagatar", "😥 Aksar", "😐 Kabhi kabhi", "🙂 Bahut kam ya kabhi nahi"]
    },
    {
        question: "Kya aapko karyaon par dhyan kendrit karne mein ya nirnay lene mein mushkil hoti hai?",
        options: ["🤔 Haan, hamesha", "😣 Kaafi baar", "😐 Kabhi kabhi", "😊 Bahut kam ya kabhi nahi"]
    },
    {
        question: "Aap kitni baar sharirik lakshan jaise sir dard, pet dard, ya manspeshiyon ki tanavah mehsoos karte hain?",
        options: ["😩 Aksar", "😣 Kabhi kabhi", "😐 Bahut kam", "😊 Kabhi nahi"]
    },
    {
        question: "Kya aap aksar akela ya alag mehsoos karte hain?",
        options: ["😔 Bahut baar", "😣 Kabhi kabhi", "😐 Bahut kam", "😊 Kabhi nahi"]
    },
    {
        question: "Kya aapne kabhi apne aap ko chot pahunchane ya atmahatya ke vichar kiye hain?",
        options: ["😨 Haan, aksar", "😣 Kabhi kabhi", "😐 Bahut kam", "😊 Kabhi nahi"]
    },
    {
        question: "Aap apne jeevan ki kul khushi aur santushti ka star kaise darj karenge?",
        options: ["😞 Bahut khush nahi", "😔 Khush nahi", "😐 Neutral", "😊 Khush"]
    },
    {
        question: "Kya aapko rozmarra ke tanav se samna karna mushkil lagta hai?",
        options: ["😰 Bahut mushkil", "😥 Thoda mushkil", "😐 Kabhi kabhi mushkil", "😊 Mushkil nahi"]
    },
    {
        question: "Kya aapne apne jeevan mein koi ghatak ghatnao ka samna kiya hai jo ab bhi aapko prabhavit karta hai?",
        options: ["😢 Haan, aksar", "😣 Kabhi kabhi", "😐 Bahut kam", "😊 Kabhi nahi"]
    },
    {
        question: "Kya aap voh gatividhiyon mein shamil hote hain jo aap pahle anand lete the?",
        options: ["😞 Bahut kam ya kabhi nahi", "😔 Kabhi kabhi", "😐 Kabhi kabhi", "😊 Aksar"]
    },
    {
        question: "Aap apne jeevan ki kul urja star aur prerna ka star kaise darj karenge?",
        options: ["😫 Bahut kam", "😥 Kam", "😐 Average", "😊 Uchch"]
    }
];

// Store responses to quiz questions
let responses = [];

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY); // Load API key from environment variables

// Store chat history for each user session
const chatHistory = {};

// Handle sending user message to AI and receiving AI response
app.post('/chat', async (req, res) => {
    const { sessionId, message } = req.body;
    try {
        // Get or create chat history for the session
        let sessionChatHistory = chatHistory[sessionId];
        if (!sessionChatHistory) {
            sessionChatHistory = [];
            chatHistory[sessionId] = sessionChatHistory;
        }

        // Send user message to AI
        const aiResponse = await runAIModel(message);

        // Add user message and AI response to session chat history
        sessionChatHistory.push({ sender: 'User', message });
        sessionChatHistory.push({ sender: 'AI', message: aiResponse });

        // Respond with AI response
        res.json({ success: true, message: aiResponse });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Function to interact with the AI model
async function runAIModel(message) {
    // Use the AI model to generate response based on user message
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    return text;
}

// Handle fetching quiz questions
app.get('/questions', (req, res) => {
    res.json(questions);
});

// Handle saving responses to quiz questions
app.post('/save-response', (req, res) => {
    const response = req.body;
    responses.push(response);
    res.json({ message: 'Response saved successfully.' });
});

// Handle fetching responses to quiz questions
app.get('/responses', (req, res) => {
    res.json(responses);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
