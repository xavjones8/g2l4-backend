// // Tests the PATCH route for updating a user with specific fields.
// // Replace <user_email> with a valid user email from your database.
// await fetch("http://localhost:5050/users?email=abc@gmail.com", {
//     method: "PATCH",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         streak: 5,
//         points: 15000,
//         lastLogin: "2025-02-27T15:00:00.000Z",
//         completedDailyCases: [
//             { caseId: 101, description: "Completed case description" }
//         ]
//     }),
// })
// .then((res) => res.json())
// .then((data) => console.log(data))
// .catch((err) => console.error("Error:", err));


// Tests the post route for creating a user with the fields under the "body" section
// await fetch("http://localhost:5050/users", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         firstName: "TestAgain1",
//         lastName: "UserAgain1",
//         email: "def@gmail.co1m",
//         password: "passwordAgain1"
//     }),
// }).then((res) => res.json())

// Tests the get route for a user with email: abc@gmail.com and password: password
// await fetch("http://localhost:5050/users?email=abc@gmail.com&password=password", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => console.log(data));


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTJkYjVhZTNiMmNmZDJlY2ExMTAxOSIsImVtYWlsIjoiYXNraGFuNkBuY3N1LmVkdSIsImlhdCI6MTc0MjkyMDUzOCwiZXhwIjoxNzUxNTYwNTM4fQ.DrTWd7lJ9Ba3GUyQEkJcs_Xlqt6grf2CsuFjMQ1bab4"

await fetch("http://localhost:5050/daily/search?query=lifestyle", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
})
.then((res) => res.json())
.then((data) => console.log("Search Results:", data))
.catch((err) => console.error("Error:", err));
