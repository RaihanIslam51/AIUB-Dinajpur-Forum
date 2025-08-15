# 📢 AIUB Assignment-12 | Social Forum Web App 🌐

🔗 **Live Site:** [https://assignment-12-421b1.web.app](https://assignment-12-421b1.web.app)

---

## 📖 Project Overview

This is a **feature-rich social forum web application** built as part of **Assignment Category 02**, fulfilling **all requirements** of the assignment. The platform allows users to **create and interact with posts**, share ideas, comment, vote, and more. It includes dedicated **User and Admin Dashboards**, **JWT authentication**, **Stripe-powered membership**, and a responsive **React + Firebase** stack.

---

## 🚀 Features

### 🌍 Home Page

- ✅ **Responsive Navbar** with dynamic links
- 🎯 **Banner with Search Functionality**: Search by post title
- 🗂️ **Data Cards** showing post summary
- 🔍 **Card Details Page** on click
- 🏷️ **Tags Section**: Display all tags used in user posts
- 📢 **Announcement Section**: Only Admins can add announcements; users see the latest ones
- 📄 **All Posts Section**:
  - 🗳️ Upvote / Downvote system
  - 📊 Total vote = UpVote - DownVote
  - 💬 Comment system with:
    - Real-time comment display
    - Total comment count
    - Feedback system
  - 🔗 Share posts via social media (using `react-share`)

---

### 💎 Membership System

- 🚫 **Bronze Badge (Default)**: Can create only **5 posts**
- 💰 **Gold Badge (After Payment)**: Can post **unlimited**
- 💳 Integrated with **Stripe Payment Gateway**

---

### 👤 User Dashboard (Protected)

> Only visible after login.

1. **My Profile**  
   - Shows personal info
   - Displays badge: 🥉 *Bronze* / 🥇 *Gold*

2. **Add Post**  
   - Add new posts  
   - Bronze users limited to 5 posts  
   - Prompt for upgrade when limit reached

3. **My Posts**  
   - View your own posts  
   - See number of comments  
   - View specific comment content  
   - `Comment` button to report feedback

---

### 🛠️ Admin Dashboard (Protected)

> Admin-only access via server-side JWT protection.

1. **Admin Profile**
   - View admin details
   - Summary widgets: total users, posts, comments
   - 📊 Graph of user and content statistics
   - Add multiple global tags

2. **Manage Users**
   - List all users
   - View payment status and role (Admin/User)
   - Promote/demote or delete users

3. **Reported Comments**
   - View all user-reported comments
   - Manage inappropriate feedback

4. **Make Announcement**
   - Admins post official announcements
   - 🔔 Notification icon on Navbar
   - All announcements shown on Home

---

## 🔐 Authentication & Security

- 🔥 **Firebase Authentication**
  - Email/Password & Google Sign-In
- 🔐 **JWT Authentication**
  - Secure backend routes and role-based access
- 🚫 Role Protection
  - Client-side + Server-side route guards

---

## 💻 Tech Stack

| Tech            | Description                          |
|-----------------|--------------------------------------|
| **React.js**    | Frontend UI                          |
| **Tailwind CSS**| Responsive styling                   |
| **Firebase**    | Auth & hosting                       |
| **Express.js**  | Backend API                          |
| **MongoDB**     | Database                             |
| **JWT**         | Auth token handling                  |
| **Stripe**      | Payment integration                  |
| **react-query** | API data fetching & caching          |
| **react-router**| Routing and protection               |
| **react-share** | Easy sharing on social platforms     |
| **Chart.js**    | Data visualization for admin graphs  |

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Set environment variables
# Add your Firebase, MongoDB, JWT_SECRET, Stripe keys in .env

# Run the development server
npm run dev
