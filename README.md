# AI-LMS: Intelligent Learning Management System

An enterprise-grade, AI-powered Learning Management System (LMS) designed to streamline academic workflows through automated grading, classroom management, and intelligent assessment analytics.

AI-LMS combines **Google Gemini AI** for semantic similarity grading with **Supabase** for secure authentication, database management, and real-time academic operations.

---

## 🚀 Features

### 🤖 AI-Powered Semantic Similarity Grading

* Automated evaluation of student submissions using **Google Gemini 1.5 Flash**.
* Compares student answers against instructor-defined sample answers.
* Generates marks proportionate to conceptual correctness.
* Provides AI-generated feedback and improvement suggestions.
* Supports free-tier and paid Gemini API configurations.

---

### 👨‍🏫 Instructor Command Center

* Create and manage classrooms.
* Generate secure classroom join codes.
* Create and publish examinations.
* Monitor submissions in real time.
* Review AI-generated grades before releasing results.

---

### 👨‍🎓 Student Workspace

* Join classrooms using unique join codes.
* View published exams.
* Submit answers through a clean assessment interface.
* Receive AI-generated marks and feedback.
* Track performance history.

---

### 🔔 Smart Notification System

* Global notification center.
* Deep-linked notifications using `link_to`.
* Direct navigation to:

  * Exams
  * Results
  * Classrooms
  * Submission reviews

---

### 📊 Export & Reporting

* Dedicated report export pages.
* Clean print-friendly layouts.
* Save reports directly as PDF.
* CSV export functionality.
* Lightweight academic score ledger view.

---

## 🛠️ Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Frontend       | Next.js 14 (App Router) |
| Styling        | Tailwind CSS            |
| Icons          | Lucide React            |
| Backend        | Supabase                |
| Database       | PostgreSQL              |
| Authentication | Supabase Auth           |
| AI Engine      | Google Gemini API       |
| Language       | TypeScript              |

---

## 📁 Project Structure

```text
app/
├── auth/
│   ├── sign_in/page.tsx
│   └── sign_up/page.tsx
│
├── dashboard/
│   ├── student/
│   │   ├── exams/page.tsx
│   │   ├── results/page.tsx
│   │   ├── settings/page.tsx
│   │   └── class/[id]/
│   │       └── exam/[examId]/page.tsx
│   │
│   └── teacher/
│       ├── page.tsx
│       └── class/[id]/
│           └── exam/[examId]/
│               ├── page.tsx
│               └── export/page.tsx
│
├── components/
│   ├── classroom/
│   └── layout/
│
├── lib/
│   └── supabase.ts
│
└── types/
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

---

## 💾 Database Schema

### users

| Column     | Type      |
| ---------- | --------- |
| id         | uuid (PK) |
| first_name | text      |
| last_name  | text      |
| email      | text      |
| role       | text      |

---

### classes

| Column      | Type      |
| ----------- | --------- |
| id          | uuid (PK) |
| class_name  | text      |
| description | text      |
| join_code   | text      |
| teacher_id  | uuid      |

---

### class_members

| Column     | Type        |
| ---------- | ----------- |
| id         | bigint (PK) |
| class_id   | uuid        |
| student_id | uuid        |

---

### exams

| Column       | Type      |
| ------------ | --------- |
| id           | uuid (PK) |
| class_id     | uuid      |
| title        | text      |
| description  | text      |
| total_marks  | integer   |
| due_date     | timestamp |
| is_published | boolean   |

---

### questions

| Column          | Type      |
| --------------- | --------- |
| id              | uuid (PK) |
| exam_id         | uuid      |
| question_number | integer   |
| question_text   | text      |
| marks           | integer   |
| sample_answer   | text      |

---

### submissions

| Column                 | Type      |
| ---------------------- | --------- |
| id                     | uuid (PK) |
| exam_id                | uuid      |
| student_id             | uuid      |
| student_answers        | jsonb     |
| total_marks            | integer   |
| status                 | text      |
| is_released_by_teacher | boolean   |

---

### answers

| Column        | Type      |
| ------------- | --------- |
| id            | uuid (PK) |
| submission_id | uuid      |
| question_id   | uuid      |
| answer_text   | text      |
| awarded_marks | numeric   |
| feedback      | text      |

---

### notifications

| Column  | Type        |
| ------- | ----------- |
| id      | bigint (PK) |
| user_id | uuid        |
| title   | text        |
| message | text        |
| is_read | boolean     |
| link_to | text        |

---

## 🏃 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-lms.git
cd ai-lms
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

### 4. Production Build

```bash
npm run build
```

---

## 🔒 Security & Reliability

### Defensive JSON Parsing

AI responses are sanitized before parsing to prevent malformed JSON failures.

### Gemini API Compatibility

Configured to use:

```text
gemini-1.5-flash-latest
```

through REST-based API pipelines for improved free-tier compatibility.

### Secure Classroom Access

* Unique classroom join codes.
* Role-based routing.
* Teacher-only grading controls.
* Student-only submission access.

---

## 📈 Future Enhancements

* Excel (.xlsx) export support
* Analytics dashboard
* AI plagiarism detection
* Rubric-based grading
* Multi-file assignment uploads
* Email notifications
* Attendance tracking

---

## 📄 License

This project is intended for educational and academic use.

---

## 👨‍💻 Author

Developed as an AI-powered academic management platform leveraging:

* Next.js
* Supabase
* Tailwind CSS
* Google Gemini AI

to create an intelligent, scalable, and modern learning environment.
