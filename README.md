# 🎨 Course Platform — Frontend

> A modern, responsive React SPA for managing online courses, student enrollments, and training programs — connected to the [Course Platform API](https://github.com/NeuralHamdi/course-platform-api).

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📌 About

The **Course Platform Frontend** is a Single Page Application (SPA) built with React 18. It provides an intuitive, animated interface for administrators, trainers, and students to manage the full lifecycle of training programs — from browsing courses to completing payments.

---

## ✨ Features

- **Dashboard** — Overview of active courses, enrollments, and key statistics with visual charts
- **Course Catalog** — Browse, search, and filter available training programs
- **Course Management** — Admin panel to create, update, and delete courses
- **Student Registration** — Enroll in courses and manage registrations
- **Stripe Checkout** — Integrated secure online payment flow
- **User Authentication** — Login, register, and protected routes
- **Animated UI** — Smooth transitions with Framer Motion and AOS scroll animations
- **Charts & Analytics** — Training statistics visualized with Recharts
- **Toast Notifications** — Instant feedback on user actions
- **Responsive Design** — Fully functional on desktop and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Core UI framework |
| React Router DOM v7 | Client-side navigation |
| Axios | API communication |
| TanStack React Query v5 | Server state management & caching |
| Bootstrap 5 | UI layout & components |
| React Bootstrap | Bootstrap React bindings |
| Framer Motion | Animations |
| AOS | Scroll-triggered animations |
| Recharts | Charts & data visualization |
| React Toastify | Toast notifications |
| React Icons / Bootstrap Icons | Icon library |
| React CountUp | Animated number counters |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.x
- npm or yarn
- Running instance of [course-platform-api](https://github.com/NeuralHamdi/course-platform-api)

### Installation

```bash
# Clone the repository
git clone https://github.com/NeuralHamdi/course-platform-stage.git
cd course-platform-stage

# Install dependencies
npm install

# Configure API URL
# In src/services/ or .env, set your backend base URL:
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

App will be running at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── assets/              # Static images, icons, and media
├── components/          # Reusable UI components
│   ├── Navbar/
│   ├── Cards/
│   ├── Charts/
│   └── ...
├── pages/               # Full page views
│   ├── Dashboard/
│   ├── Courses/
│   ├── Enrollments/
│   ├── Auth/
│   └── ...
├── services/            # Axios API calls
├── styles/              # Global CSS and theme files
└── App.js               # Root component & route config
```

---

## 🔗 API Integration

The app communicates with the backend via Axios. All API calls are centralized in `src/services/`. TanStack React Query is used for caching, background refetching, and loading/error states.

Example service:
```javascript
// src/services/courseService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getCourses = () => axios.get(`${API_URL}/courses`);
export const createCourse = (data) => axios.post(`${API_URL}/courses`, data);
```

---

## 🔐 Authentication

After login, the JWT token is stored and injected into all Axios requests via an interceptor:

```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

Protected routes redirect unauthenticated users to the login page.

---

## 👤 Author

**Ahmed Hamdi** — [@NeuralHamdi](https://github.com/NeuralHamdi)

---

## 🔗 Related

- **Backend API:** [course-platform-api](https://github.com/NeuralHamdi/course-platform-api)

---

## 📄 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
