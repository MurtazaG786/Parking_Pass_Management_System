# 🚗 Parking Pass Management System

A web-based **Parking Pass Management System** designed to automate parking operations for commercial buildings and multi-basement parking facilities. The system enables secure parking slot allocation, real-time availability tracking, automated billing, subscription management, and controlled exit authorization.

---

## 📌 Features

### 🔐 Authentication & Access Control
- Secure login using JWT
- Role-based access control (Admin, Security Guard, Driver)
- Encrypted password storage

### 🏢 Parking Infrastructure Management
- Building and basement configuration
- Parking slot creation and categorization
- Real-time slot availability tracking

### 👮 Security Operations
- Vehicle entry registration
- Automated parking slot allocation
- Parking ticket generation
- **Payment verification before vehicle exit**
- Secure exit authorization

### 💳 Billing & Payments
- Time-based parking fee calculation
- Subscription-based discounts
- Online and offline payment support
- Payment status validation

### 👤 Driver & Subscription Management
- Driver dashboard
- Parking ticket access
- Subscription plans for frequent users

### 📊 Reports & Analytics
- Parking usage reports
- Revenue analytics
- Operational insights for administrators

---

## 🧱 Tech Stack

### Frontend
- React.js
- Bootstrap / Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- Role-Based Access Control (RBAC)

### Database
- MongoDB (Mongoose ORM)

### Integrations
- Socket.IO (Real-time updates)
- Payment Gateway (Razorpay / Stripe)
- SMS / Email Notifications

---

## 🗂️ System Roles

| Role | Responsibilities |
|----|----------------|
| Admin | Manages buildings, parking slots, security access, reports |
| Security Guard | Vehicle entry/exit, slot allocation, payment verification |
| Driver | Views parking ticket, makes payment, manages subscription |

---

## 🗓️ Project Structure
parking-pass-management-system/
│
├── client/ # Frontend (React)
│ ├── src/
│ └── public/
│
├── server/ # Backend (Node.js + Express)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── utils/
│
├── docs/ # Project documentation & UML diagrams
│
├── .env.example
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/parking-pass-management-system.git

# Navigate to project directory
cd parking-pass-management-system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start backend server
cd server
npm run dev

# Start frontend
cd ../client
npm start

🧪 Testing

Unit testing for backend APIs

Manual and integration testing for parking workflows

Role-based access testing

🤝 Contributing
1.Create feature branch: git checkout -b feature/your-feature
2.Make changes and test
3.Commit: git commit -m "Add your feature"
4.Push: git push origin feature/your-feature
5.Create Pull Request
