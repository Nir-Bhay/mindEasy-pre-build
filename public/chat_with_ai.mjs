import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAnxeTI5b5h5_AsLW33m2YF4Z4IrpU0L5c"; // Replace with your actual API key

const chatHistory = document.getElementById("chat-history");
const userMessageInput = document.getElementById("user-message");
const sendButton = document.getElementById("send-button");

const genAI = new GoogleGenerativeAI(API_KEY);

async function run(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

sendButton.addEventListener("click", async () => {
    const userPrompt = userMessageInput.value;
    userMessageInput.value = ""; // Clear the input field after sending

    const aiResponse = await run(userPrompt);
    chatHistory.innerHTML += `<p>You: ${userPrompt}</p>`;
    chatHistory.innerHTML += `<p>AI: ${aiResponse}</p>`;
});



// Function to generate mental health report based on user responses
function generateMentalHealthReport(responses) {
    // Parse user responses
    const occupation = responses.occupation;
    const demographicInformation = responses.demographicInformation;
    const education = responses.education;
    const relationshipStatus = responses.relationshipStatus;
    const medicalHistory = responses.medicalHistory;
    const hobbiesAndInterests = responses.hobbiesAndInterests;
    const mentalHealthAssessmentResults = responses.mentalHealthAssessmentResults;

    // Analyze responses to assess mental health condition
    // Here, you would analyze the responses and determine the user's mental health condition,
    // symptoms, level of concern, treatment recommendations, and solutions.

    // Generate mental health report
    const mentalHealthReport = `
        Mental Health Report

        User Details:
        Occupation: ${occupation}
        Demographic Information: ${demographicInformation}
        Education: ${education}
        Relationship Status: ${relationshipStatus}
        Medical History: ${medicalHistory}
        Hobbies and Interests: ${hobbiesAndInterests}
        Mental Health Assessment Results: ${mentalHealthAssessmentResults}

        Problem Description: [Brief description of the user's mental health condition]
        Symptoms: [Summary of symptoms reported by the user]
        Level of Concern: [Assessment of the severity of the user's mental health condition]
        Treatment Recommendations: [Recommendations for treatment and coping strategies]
        Solution: [Recommendations for exercises, stress management techniques, etc.]
    `;

    return mentalHealthReport;
}

// Function to send user responses to AI and receive mental health report
async function getMentalHealthReport(userResponses) {
    // Send user responses to AI and receive generated report
    const report = await runAIModel(generateMentalHealthReport(userResponses));
    return report;
}

// Example usage: Get user responses and generate mental health report
const userResponses = {
    occupation: "Software Engineer",
    demographicInformation: "Age: 30, Gender: Male",
    education: "Bachelor's Degree in Computer Science",
    relationshipStatus: "Married",
    medicalHistory: "No major medical history",
    hobbiesAndInterests: "Reading, hiking, playing guitar",
    mentalHealthAssessmentResults: "Anxiety, stress"
};

// Generate mental health report based on user responses
getMentalHealthReport(userResponses)
    .then(report => {
        console.log("Generated Mental Health Report:");
        console.log(report);
        // Display the generated report to the user
        // You can implement the logic to display the report in your application
    })
    .catch(error => {
        console.error("Error generating mental health report:", error);
    });
