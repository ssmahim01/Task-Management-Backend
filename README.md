<div align="center">
  <img width="100%" height="340" src="/public/task-flow.png"  />
</div>

---

# 👨‍💼 TaskFlow - Task Management Backend

## 📝 Short Description
Task Management Backend is a simple server for client side of TaskFlow. This backend built to help users organize, track, and manage their tasks with ease. Users can create, update, delete, and categorize their tasks dynamically, ensuring smooth workflow management.

---

## 🚀 Live Demo
🔗 [TaskFlow Live on Vercel](https://my-task-flow-management.vercel.app)
<br>
🔗 [TaskFlow Live on Firebase](https://task-flow-25.web.app)

## 📁 Client Repository

🔗 [TaskFlow Client](https://github.com/ssmahim01/Task-Management-With-React)

---

## 📦 Dependencies
```json
"dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongodb": "^5.6.0"
  }
  ```

  ---

## 🛠 Installation Steps
Follow these steps to set up the project locally:

### **1️⃣ Clone the Repository**
```sh
 git clone https://github.com/ssmahim01/Task-Management-Backend.git
 cd Task-Management-Backend
```

### **2️⃣ Install Dependencies**

```sh
 npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```
DB_URI="Push Your MongoDB URI Form The Clusters Of MongoDB Atlas"
```

### **4️⃣ Start the Development Server**

```sh
 nodemon index.js
```
---

## ⚙️ Technologies Used
- **Backend:** Node.js, Express.js, MongoDB
- **Hosting:** Vercel (Production)

---

## 🎯 Features
✅ Get dynamically users and tasks data
<br>
✅ Insert users information into the MongoDB
<br>
✅ Update tasks via PUT request
<br>
✅ Update category and move task via PUT request
<br>
✅ Delete a specific task