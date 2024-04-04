document.addEventListener('DOMContentLoaded', function () {
    const userInfoForm = document.getElementById('mh-user-info-form');
    const startQuizBtn = document.getElementById('mh-start-quiz');

    userInfoForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Scroll to the next section smoothly
        document.querySelector('.main01').style.display = 'block';
        document.querySelector('.main01').scrollIntoView({
            behavior: 'smooth'
        });

        // Serialize form data into JSON format
        const formData = {
            name: document.getElementById('mh-name').value,
            age: document.getElementById('mh-age').value,
            gender: document.getElementById('mh-gender').value,
            occupation: document.getElementById('mh-occupation').value,
            demographicInformation: document.getElementById('mh-demographic-information').value,
            education: document.getElementById('mh-education').value,
            relationshipStatus: document.getElementById('mh-relationship-status').value,
            medicalHistory: document.getElementById('mh-medical-history').value,
            hobbiesAndInterests: document.getElementById('mh-hobbies-and-interests').value
        };

        // Send the form data to the server
        fetch('/save-form-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Form data saved successfully:', data);
                // After form data is saved, trigger report generation
                generateReport();
            })
            .catch(error => {
                console.error('Error saving form data:', error);
                // Handle error if needed
            });
    });

    // startQuizBtn.addEventListener('click', function () {
    //     fetch('/quiz')
    //         .then(response => response.json())
    //         .then(questions => {
    //             displayQuestion(questions);
    //         })
    //         .catch(error => console.error('Error fetching questions:', error));
    // });


    startQuizBtn.addEventListener('click', function () {
        fetch('/get-quiz-questions')
            .then(response => response.json())
            .then(questions => {
                displayQuestion(questions);
            })
            .catch(error => console.error('Error fetching questions:', error));
    });



    // Function to trigger report generation
    function generateReport() {
        fetch('/generate-report')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok.');
            })
            .then(report => {
                // Display the generated report to the user
                const reportContainer = document.getElementById('report-container');
                reportContainer.innerText = report;
            })
            .catch(error => {
                console.error('Error generating report:', error);
                // Handle error if needed
            });
    }

    // Function to display the generated report
    function displayReport(report) {
        // Assuming you have a div with id 'report-container' to display the report
        const reportContainer = document.getElementById('report-container');
        reportContainer.innerText = report;
    }
});

let currentQuestion = 0;
let questions = [];

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

    fetch('/submit-quiz-response', {
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
                // After quiz completion, trigger report generation
                generateReport();
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
