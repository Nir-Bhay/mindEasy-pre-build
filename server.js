const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Define the questions for the quiz
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
app.get('/get-quiz-questions', (req, res) => {
    res.json(questions);
});

// Store responses to quiz questions
const responses = [];

// Handle submitting quiz responses
app.post('/submit-quiz-response', (req, res) => {
    const response = req.body;
    responses.push(response);
    res.json({ message: 'Response saved successfully.' });
});


const formDatas = [];
app.post('/save-form-data', (req, res) => {
    const formData = req.body;
    // console.log('Received form data:', formData);
    formDatas.push(formData);
    // Assuming you save the form data to a database or any other storage mechanism
    res.json({ message: 'Form data saved successfully.' });
});

  
app.get('/generate-report', async (req, res) => {
    // Get the latest form data and quiz responses
    const latestFormData = formDatas.slice(-1)[0]; // Get the last element of formDatas
    const report = await generateReport(latestFormData, responses); // Pass correct parameters
    res.send(report);
});



// Initialize the Google Generative AI
const API_KEY = "AIzaSyAVc-WnP7GATFqMLCjY1i4IT6YsMlJi4p0";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate the mental health report using AI
async function generateReport(userData, quizResponses) {
    // Use relevant information from userData and quizResponses in the prompt
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `User Data:\nName: ${userData.name}\nAge: ${userData.age}\nGender: ${userData.gender}\nOccupation: ${userData.occupation}\nDemographic Information: ${userData.demographicInformation}\nEducation: ${userData.education}\nRelationship Status: ${userData.relationshipStatus}\nMedical History: ${userData.medicalHistory}\nHobbies and Interests: ${userData.hobbiesAndInterests}\n\nQuiz Responses:\n`;
    const responsesText = quizResponses.map((response, index) => `Question ${index + 1}: ${response.question}\nAnswer: ${response.answer}\n`).join('');
    const context = `${prompt}${responsesText}`;
    const maxTokens = 1000;

    try {
        const result = await model.completePrompt(context, maxTokens);
        return result.data.choices[0].text;
    } catch (error) {
        console.error('Error generating report:', error);
        return 'An error occurred while generating the report.';
    }
}


// Route to save form data

// Route to generate mental health report


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
