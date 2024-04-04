// document.addEventListener('DOMContentLoaded', function () {
//     const userInfoForm = document.getElementById('user-info-form');
//     userInfoForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const formData = new FormData(userInfoForm);
//         const userData = {};
//         formData.forEach((value, key) => {
//             userData[key] = value;
//         });

//         fetch('/save-user-data', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData),
//         })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 }
//                 throw new Error('Network response was not ok.');
//             })
//             .then(data => {
//                 console.log('User data saved:', data);
//                 // Proceed to start the quiz
//                 // window.location.href = 'index.html';
//             })
//             .catch(error => {
//                 console.error('Error saving user data:', error);
//             });
//     });
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const userInfoForm = document.getElementById('user-info-form');
//     const startQuizBtn = document.getElementById('start-quiz');

//     userInfoForm.addEventListener('submit', function (event) {
//         event.preventDefault(); // Prevent default form submission behavior

//         // Scroll to the next section smoothly
//         document.querySelector('.mian01').scrollIntoView({
//             behavior: 'smooth'
//         });

//         // Alternatively, you can scroll to a specific position using the following code:
//         // window.scrollTo({ top: 1000, behavior: 'smooth' });

//         // You can also redirect to a specific URL if needed
//         // window.location.href = 'next_page.html';
//     });
// });
