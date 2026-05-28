# ✦ She Can Foundation — Full Stack Contact Form

A polished, production-ready contact form web application built for the She Can Foundation internship task.

---

## ✨ Features Implemented

| Feature                  | Status |
|--------------------------|--------|
| Name / Email / Message fields | ✅ |
| "Form Submitted Successfully" message | ✅ |
| **Form Validation** (client + server) | ✅ |
| **Responsive Design** (mobile-first) | ✅ |
| **Database Integration** (SQLite) | ✅ |
| **Backend** (Node.js + Express REST API) | ✅ |
| **Admin Panel** (token-protected) | ✅ |
| **Rate Limiting** (spam protection) | ✅ |
| Honeypot (bot detection) | ✅ |
| Animated stats counter | ✅ |
| Character counter on textarea | ✅ |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite (via `better-sqlite3`)
- **Security:** Helmet.js, express-rate-limit, CORS, input sanitization
- **Design:** Playfair Display + DM Sans fonts, CSS custom properties, CSS animations

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v16+** installed ([nodejs.org](https://nodejs.org))
- npm (comes with Node.js)

### Installation

```bash
# 1. Enter the project folder
cd she-can-foundation

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

---

## 📁 Project Structure

```
she-can-foundation/
├── public/
│   ├── index.html      ← Main contact page
│   ├── style.css       ← All styles (responsive + animations)
│   ├── app.js          ← Frontend logic (validation, submission, counters)
│   └── admin.html      ← Admin dashboard
├── database/
│   └── submissions.db  ← Auto-created SQLite database
├── server.js           ← Express backend + REST API
├── package.json
└── README.md
```

---

## 🔌 API Reference

### `POST /api/contact`
Submit the contact form.

**Request body (JSON):**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "subject": "Volunteering",
  "message": "I'd love to get involved!"
}
```

**Success response:**
```json
{ "success": true, "id": 1, "message": "Form Submitted Successfully" }
```

**Validation error response:**
```json
{ "success": false, "errors": ["A valid email address is required."] }
```

---

## 🔐 Admin Panel

Visit **http://localhost:3000/admin.html**

Default token: `shecan-admin-2025`

> **Change the token** by setting the `ADMIN_TOKEN` environment variable:
> ```bash
> ADMIN_TOKEN=my-secret-token npm start
> ```

### Admin API endpoints (all require `x-admin-token` header or `?token=` query param)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/submissions` | List all submissions (paginated) |
| PATCH | `/api/admin/submissions/:id` | Update status (`new`/`read`/`replied`/`archived`) |
| DELETE | `/api/admin/submissions/:id` | Delete a submission |
| GET | `/api/admin/stats` | Dashboard counts |

---

## 🔒 Security Features

- **Rate limiting:** Max 5 contact form submissions per IP per 15 minutes
- **Helmet.js:** Sets secure HTTP headers
- **Input sanitization:** All user input is trimmed and HTML-entity-encoded server-side
- **Honeypot field:** Hidden field to detect bots
- **Admin token auth:** Admin endpoints require a secret token

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 900px | Two-column hero + two-column form |
| ≤ 900px | Single-column, cards in a row |
| ≤ 600px | Fully stacked, mobile-optimized |

---

## 🎨 Design

- **Theme:** Warm Rose & Gold editorial palette
- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Animations:** CSS keyframe animations on page load, stat counter animation on scroll, shake animation on validation errors
- **Accessibility:** `aria-required`, `aria-live` for the success message, semantic HTML

---

*Made with ♥ for She Can Foundation Internship Task*
