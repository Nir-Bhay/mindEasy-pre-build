const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

const API_KEY = "AIzaSyCYqcNdsGpYlHtGc21rdpYtIgMuOBgvY50"; // Replace with your actual key

// Disclaimer message to be displayed before user interaction

async function run() {
    const model = await getGenerativeModel(); // Fetches model details and handles errors

    const userDetails = await getUserDetails(); // Collects user information

    // console.log(DISCLAIMER); // Display disclaimer before proceeding

    console.log("Analyzing the given data to generate a mental health report...");
    console.log("Focus on the user's problem, main mental health issues, potential resources, and recommendations.");

    const questions = getMentalHealthQuestions(); // Fetches pre-defined questions

    const answers = [];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    for (const { question, options } of questions) {
        console.log(question);
        options.forEach((option, index) => console.log(`${index + 1}. ${option}`));

        const answer = await askQuestion(rl, "Your choice (Enter option number): ");
        answers.push(answer);
    }

    const assessment = await generateText(model, answers); // Generate insights based on answers

    console.log("Mental Health Insights:");
    console.log(assessment);

    const report = generateReport(questions, answers, userDetails, assessment); // Create detailed report
    console.log("Mental Health Report:");
    console.log(report);
}

async function getGenerativeModel() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        return genAI.getGenerativeModel({ model: "gemini-pro" }); // Consider exploring mental health-specific models
    } catch (error) {
        console.error("Error fetching generative model:", error);
        process.exit(1); // Exit with error code if model retrieval fails
    }
}

async function getUserDetails() {
    // Implement logic to collect user details (name, age, occupation, etc.)
    // Example:
    return {
        name: "Nirbay Hiwse",
        age: 25,
        occupation: "Student",
        degree: "BTech CSE"
    };
}

function getMentalHealthQuestions() {
    // Replace with a well-defined set of questions addressing various mental health aspects
    // Consider consulting with mental health professionals for guidance on question selection
    // and answer validation to ensure user input accuracy
    return [
        {
            question: "For how many days have you been feeling sad or hopeless?",
            options: ["😞 Almost every day", "😔 For several days", "😐 Occasionally", "🙂 Never"]
        },
        {
            question: "Do you often feel anxious about various aspects of your life?",
            options: ["😥 Yes, always", "😰 Quite often", "😕 Sometimes", "😊 Very rarely or never"]
        },
        {
            question: "How would you rate the quality of your sleep?",
            options: ["😴 Very poor", "😫 Poor", "😐 Average", "😊 Good"]
        },
        {
            question: "Do you often feel changes in mood?",
            options: ["😢 Yes, frequently", "😣 Sometimes", "😐 Rarely", "😊 Never"]
        },
        {
            question: "Have you experienced changes in your eating habits (eating significantly more or less than usual)?",
            options: ["🍔 Eating significantly more", "🥗 Eating significantly less", "😐 No significant changes", "😊 Not applicable"]
        },
        {
            question: "How long do you feel stressed?",
            options: ["😰 Continuously", "😥 Often", "😐 Occasionally", "🙂 Very rarely or never"]
        },
        {
            question: "Do you find it difficult to focus on tasks or make decisions?",
            options: ["🤔 Yes, always", "😣 Quite often", "😐 Sometimes", "😊 Very rarely or never"]
        },
        {
            question: "How often do you experience physical symptoms such as headaches, stomachaches, or muscle tension?",
            options: ["😩 Often", "😣 Sometimes", "😐 Rarely", "😊 Never"]
        },
        {
            question: "Do you often feel lonely or isolated?",
            options: ["😔 Very often", "😣 Sometimes", "😐 Rarely", "😊 Never"]
        },
        {
            question: "Have you ever had thoughts of harming yourself or suicide?",
            options: ["😨 Yes, often", "😣 Sometimes", "😐 Rarely", "😊 Never"]
        }
       
    ];

}

async function generateText(model, answers) {
    // Craft a detailed prompt considering user answers and potential mental health concerns
    const prompt = `Using the following responses to analyze the data and generate a mental health report:
${answers.join('\n')}
Thank you for providing this information.`;

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 20000,
        }
    });// Increase output length for more detailed

    const result = await chat.sendMessage("Generating mental health assessment...");
    const response = await result.response;
    const text = response.text();
    return text;
}

function askQuestion(rl, question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

function generateReport(questions, answers, userDetails, assessment) {
    let report = "Mental Health Report:\n\n";


    report += "\nUser Details:\n";
    for (const [key, value] of Object.entries(userDetails)) {
        report += `${key}: ${value}\n`;
    }

    report += "\nResponses:\n";
    questions.forEach(({ question }, index) => {
        report += `${index + 1}. ${question}: ${answers[index]}\n`;
    });

    report += "\nMental Health Insights:\n";
    report += assessment;

    // Optional: Post-process the generated assessment for clarity and readability
    // This could involve:
    //   - Removing repetitive phrases from the model's response.
    //   - Summarizing key points.
    //   - Formatting the output (e.g., bolding important points).

    return report;
}

run();
