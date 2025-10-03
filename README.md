# 🏫SCHOOL MANAGEMENT SYSTEM

- Streamline school management, class organization, and add students and faculty.<br>
- Seamlessly track attendance, assess performance, and provide feedback. <br>
- Access records, view marks, and communicate effortlessly.

---

## 📄About

The School Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline school management, class organization, and facilitate communication between students, teachers, and administrators.

---

## ✨Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Attendance Tracking:** Teachers can easily take attendance for their classes, mark students as present or absent, and generate attendance reports.

- **Performance Assessment:** Teachers can assess students' performance by providing marks and feedback. Students can view their marks and track their progress over time.

- **Data Visualization:** Students can visualize their performance data through interactive charts and tables, helping them understand their academic performance at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

---

## 🛠️Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB

---

## ⚙️Installation

### 0. Clone The Repo
```sh
git clone <repo>
```
> Open 2 terminals in separate windows/tabs.

### 1. Terminal 1: Setting Up Backend 
```sh
cd backend
npm install
npm start
```

Create a file called .env in the backend folder.
Inside it write this :

```sh
MONGO_URI = <MONGO_URI>
```
> If you are using MongoDB Compass you can use this database link but if you are using MongoDB Atlas then instead of this link write your own database link.

### 2. Terminal 2: Setting Up Frontend
```sh
cd frontend
npm install
npm start
```
> Now, navigate to `localhost:3000` in your browser. 
The Backend API will be running at `localhost:5001`.

---

## 🛠️Deployment
> - Render - server side
> - Netlify - client side

---
---
