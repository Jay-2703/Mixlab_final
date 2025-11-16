# MixLab System - Complete Test Samples

## 📋 Table of Contents
1. [Authentication Tests](#authentication-tests)
2. [Booking System Tests](#booking-system-tests)
3. [Notification System Tests](#notification-system-tests)
4. [Learning System Tests](#learning-system-tests)
5. [Admin Panel Tests](#admin-panel-tests)
6. [Quiz/Play System Tests](#quizplay-system-tests)

---

## 🔐 Authentication Tests

### 1. User Registration Flow

#### Step 1: Send Registration OTP
```bash
POST http://localhost:3000/api/auth/send-registration-otp
Content-Type: application/json

{
  "email": "testuser@example.com",
  "username": "testuser123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please check your inbox."
}
```

#### Step 2: Verify Registration OTP
```bash
POST http://localhost:3000/api/auth/verify-registration-otp
Content-Type: application/json

{
  "email": "testuser@example.com",
  "otp": "123456",
  "username": "testuser123",
  "password": "Test@1234",
  "first_name": "Test",
  "last_name": "User",
  "birthday": "1990-01-15",
  "contact": "+1234567890",
  "home_address": "123 Test Street"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser123",
    "first_name": "Test",
    "last_name": "User",
    "email": "testuser@example.com",
    "role": "student",
    "is_verified": true
  }
}
```

### 2. User Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser123",
  "password": "Test@1234"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser123",
    "email": "testuser@example.com",
    "role": "student"
  }
}
```

### 3. Google OAuth Login

```bash
GET http://localhost:3000/api/auth/google
```

**Expected:** Redirects to Google OAuth consent screen

**Callback URL:**
```
http://localhost:3000/api/auth/google/callback?code=AUTHORIZATION_CODE
```

**Expected Response:** Redirects to login page with token

### 4. Forgot Password Flow

#### Step 1: Request Password Reset OTP
```bash
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "testuser@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

#### Step 2: Verify Reset OTP
```bash
POST http://localhost:3000/api/auth/verify-reset-otp
Content-Type: application/json

{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified. You can now reset your password."
}
```

#### Step 3: Reset Password
```bash
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "email": "testuser@example.com",
  "otp": "123456",
  "new_password": "NewTest@1234"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 5. Get Current User

```bash
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser123",
    "email": "testuser@example.com",
    "role": "student",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

---

## 📅 Booking System Tests

### 1. Get User Booking Data (Auto-fill)

```bash
GET http://localhost:3000/api/bookings/user-data
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "first_name": "Test",
    "last_name": "User",
    "email": "testuser@example.com",
    "birthday": "1990-01-15",
    "contact": "+1234567890",
    "home_address": "123 Test Street"
  }
}
```

### 2. Create Booking

```bash
POST http://localhost:3000/api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "contact": "+1234567890",
  "birthday": "1990-01-15",
  "home_address": "123 Test Street",
  "service_type": "rehearsal",
  "booking_date": "2024-12-25",
  "booking_time": "14:00",
  "hours": 2,
  "members": 1,
  "payment_method": "gcash"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking_id": "MIX-ABC123-XYZ789",
    "amount": 1600.00,
    "payment_status": "pending",
    "xendit_invoice_url": "https://checkout.xendit.co/web/..."
  }
}
```

### 3. Get Booking Details

```bash
GET http://localhost:3000/api/bookings/MIX-ABC123-XYZ789
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "booking_id": "MIX-ABC123-XYZ789",
    "name": "Test User",
    "service_type": "rehearsal",
    "booking_date": "2024-12-25",
    "booking_time": "14:00",
    "hours": 2,
    "amount": 1600.00,
    "payment_status": "paid",
    "qr_code_path": "/uploads/qr/MIX-ABC123-XYZ789.png"
  }
}
```

### 4. Xendit Webhook (Payment Callback)

```bash
POST http://localhost:3000/api/webhooks/xendit
Content-Type: application/json
X-Xendit-Signature: WEBHOOK_SIGNATURE

{
  "id": "invoice_id_123",
  "status": "PAID",
  "external_id": "MIX-ABC123-XYZ789",
  "amount": 1600.00,
  "paid_at": "2024-12-20T10:30:00Z"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

## 🔔 Notification System Tests

### 1. Get Notifications (Admin)

```bash
GET http://localhost:3000/api/admin/notifications?limit=50
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "user",
        "message": "New user registered: Test User (testuser@example.com)",
        "link": "/frontend/views/admin/users.html",
        "is_read": 0,
        "created_at": "2024-12-20T10:00:00Z"
      },
      {
        "id": 2,
        "type": "appointment",
        "message": "New appointment created: 2024-12-25 at 14:00",
        "link": "/frontend/views/admin/appointments.html",
        "is_read": 0,
        "created_at": "2024-12-20T09:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2,
      "pages": 1
    }
  }
}
```

### 2. Get Unread Count

```bash
GET http://localhost:3000/api/admin/notifications/unread-count
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### 3. Mark Notification as Read

```bash
PUT http://localhost:3000/api/admin/notifications/1/read
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Mark All as Read

```bash
PUT http://localhost:3000/api/admin/notifications/read-all
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 5. Create Notification (Admin)

```bash
POST http://localhost:3000/api/admin/notifications
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "type": "announcement",
  "message": "System maintenance scheduled for tomorrow",
  "link": "/frontend/views/admin/settings.html"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notificationId": 10
  }
}
```

---

## 📚 Learning System Tests

### 1. Get All Instruments

```bash
GET http://localhost:3000/api/lessons/instruments
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Piano",
      "description": "Learn piano fundamentals",
      "icon": "🎹",
      "display_order": 1
    },
    {
      "id": 2,
      "name": "Guitar",
      "description": "Master guitar chords",
      "icon": "🎸",
      "display_order": 2
    }
  ]
}
```

### 2. Get Modules by Instrument

```bash
GET http://localhost:3000/api/lessons/modules/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Piano Basics",
      "description": "Introduction to piano",
      "level": 1,
      "instrument_id": 1
    }
  ]
}
```

### 3. Get Lessons by Module

```bash
GET http://localhost:3000/api/lessons/module/1/lessons
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Introduction to Piano Keys",
      "content": "Learn about piano keys...",
      "points": 10,
      "module_id": 1,
      "youtube_video_id": "dQw4w9WgXcQ"
    }
  ]
}
```

### 4. Get Lesson Detail

```bash
GET http://localhost:3000/api/lessons/lesson/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Introduction to Piano Keys",
    "content": "Full lesson content...",
    "images": ["/images/piano1.jpg"],
    "audio_url": "/audio/piano-intro.mp3",
    "youtube_video_id": "dQw4w9WgXcQ",
    "points": 10,
    "module_name": "Piano Basics",
    "instrument_name": "Piano"
  }
}
```

### 5. Complete Lesson

```bash
POST http://localhost:3000/api/lessons/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "lessonId": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Lesson completed!",
  "data": {
    "pointsEarned": 10,
    "totalPoints": 10,
    "achievements": [
      {
        "id": 1,
        "name": "First Steps",
        "description": "Complete your first lesson",
        "icon": "🌟"
      }
    ]
  }
}
```

### 6. Get User Progress

```bash
GET http://localhost:3000/api/lessons/progress
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "points": {
      "total_points": 150,
      "learn_points": 100,
      "play_points": 50,
      "quiz_points": 0
    },
    "completedLessons": 5,
    "totalLessons": 20,
    "progressPercentage": 25,
    "achievements": [
      {
        "id": 1,
        "name": "First Steps",
        "icon": "🌟",
        "earned_at": "2024-12-20T10:00:00Z"
      }
    ]
  }
}
```

---

## 🎮 Quiz/Play System Tests

### 1. Get Quizzes by Instrument and Level

```bash
GET http://localhost:3000/api/quiz/quizzes/1/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Piano Basics Quiz",
      "description": "Test your piano knowledge",
      "level": 1,
      "time_limit": 300,
      "points_per_question": 10
    }
  ]
}
```

### 2. Get Quiz Details

```bash
GET http://localhost:3000/api/quiz/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Piano Basics Quiz",
    "questions": [
      {
        "question": "What is the first note in C major scale?",
        "options": ["C", "D", "E", "F"],
        "correctAnswer": 0
      },
      {
        "question": "How many keys are on a standard piano?",
        "options": ["76", "88", "92", "96"],
        "correctAnswer": 1
      }
    ],
    "time_limit": 300,
    "points_per_question": 10
  }
}
```

### 3. Submit Quiz

```bash
POST http://localhost:3000/api/quiz/submit
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "quiz_id": 1,
  "answers": [0, 1, 0, 1, 0],
  "time_taken": 180
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "pointsEarned": 40,
    "totalPoints": 190,
    "maxStreak": 3,
    "achievements": [
      {
        "id": 5,
        "name": "Rising Melody",
        "description": "Score 70% or higher on a quiz",
        "icon": "🎶"
      }
    ]
  }
}
```

### 4. Get Quiz Statistics

```bash
GET http://localhost:3000/api/quiz/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalQuizzes": 5,
    "averageScore": 75,
    "bestScore": 100,
    "totalPoints": 250,
    "achievements": [
      {
        "id": 5,
        "name": "Rising Melody",
        "icon": "🎶",
        "earned_at": "2024-12-20T10:00:00Z"
      }
    ]
  }
}
```

---

## 👨‍💼 Admin Panel Tests

### 1. Admin Dashboard Metrics

```bash
GET http://localhost:3000/api/admin/dashboard
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalUsers": 150,
      "userGrowth": "+12.5%",
      "totalAppointments": 45,
      "appointmentGrowth": "+8.2%",
      "completedLessons": 320,
      "newLessonsThisMonth": 25,
      "monthlyRevenue": "45800.00",
      "revenueGrowth": "+15.3%",
      "engagementRate": "87.4%"
    },
    "upcomingAppointments": [
      {
        "id": 1,
        "student_first_name": "Test",
        "student_last_name": "User",
        "date": "2024-12-25",
        "time": "14:00",
        "status": "confirmed"
      }
    ],
    "recentUsers": [
      {
        "id": 1,
        "first_name": "Test",
        "last_name": "User",
        "email": "testuser@example.com",
        "total_points": 150,
        "completed_lessons": 5
      }
    ]
  }
}
```

### 2. Get All Users (Admin)

```bash
GET http://localhost:3000/api/admin/users?page=1&limit=10&status=active
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "testuser123",
        "first_name": "Test",
        "last_name": "User",
        "email": "testuser@example.com",
        "role": "student",
        "is_verified": 1,
        "total_points": 150,
        "completed_lessons": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
}
```

### 3. Create User (Admin)

```bash
POST http://localhost:3000/api/admin/users
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "username": "newuser",
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@example.com",
  "password": "Secure@1234",
  "role": "student",
  "birthday": "1995-05-20",
  "contact": "+1234567890"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 151
  }
}
```

### 4. Update User (Admin)

```bash
PUT http://localhost:3000/api/admin/users/1
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "first_name": "Updated",
  "role": "instructor",
  "is_verified": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

### 5. Delete User (Admin)

```bash
DELETE http://localhost:3000/api/admin/users/1
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 6. Get Appointments (Admin)

```bash
GET http://localhost:3000/api/admin/appointments?date=2024-12-25&status=confirmed
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": 1,
        "student_first_name": "Test",
        "student_last_name": "User",
        "instructor_first_name": "John",
        "instructor_last_name": "Doe",
        "date": "2024-12-25",
        "time": "14:00",
        "service_type": "lesson",
        "status": "confirmed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 7. Create Appointment (Admin)

```bash
POST http://localhost:3000/api/admin/appointments
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "student_id": 1,
  "instructor_id": 5,
  "date": "2024-12-26",
  "time": "15:00",
  "service_type": "lesson",
  "notes": "First lesson"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "appointmentId": 10
  }
}
```

### 8. Get Modules (Admin)

```bash
GET http://localhost:3000/api/admin/modules?instrument_id=1&status=active
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "id": 1,
        "name": "Piano Basics",
        "description": "Introduction to piano",
        "level": 1,
        "status": "active",
        "instrument_name": "Piano"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### 9. Create Module (Admin)

```bash
POST http://localhost:3000/api/admin/modules
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "instrument_id": 1,
  "name": "Advanced Piano Techniques",
  "description": "Learn advanced piano techniques",
  "level": 3,
  "status": "active",
  "service_type": "lesson",
  "level_requirement": 2
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "moduleId": 5
  }
}
```

### 10. Create Lesson (Admin)

```bash
POST http://localhost:3000/api/admin/lessons
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "module_id": 1,
  "title": "Piano Scales and Arpeggios",
  "content": "Learn major and minor scales...",
  "images": ["/images/piano-scales.jpg"],
  "youtube_video_id": "dQw4w9WgXcQ",
  "points": 15,
  "status": "active"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "lessonId": 10
  }
}
```

### 11. Create Quiz (Admin)

```bash
POST http://localhost:3000/api/admin/quizzes
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "instrument_id": 1,
  "level": 2,
  "title": "Intermediate Piano Quiz",
  "description": "Test your intermediate piano knowledge",
  "questions": [
    {
      "question": "What is a chord progression?",
      "options": ["Sequence of chords", "Single note", "Rhythm pattern", "Time signature"],
      "correctAnswer": 0
    }
  ],
  "time_limit": 300,
  "points_per_question": 10,
  "status": "active"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quizId": 5
  }
}
```

### 12. Get Analytics (Admin)

```bash
GET http://localhost:3000/api/admin/analytics?start_date=2024-12-01&end_date=2024-12-31
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "revenue": [
      {
        "date": "2024-12-01",
        "revenue": 5000.00,
        "transaction_count": 10
      }
    ],
    "engagement": [
      {
        "date": "2024-12-01",
        "active_users": 50,
        "lessons_completed": 120
      }
    ],
    "topLessons": [
      {
        "id": 1,
        "title": "Piano Basics",
        "completion_count": 150
      }
    ],
    "gamification": {
      "users_with_achievements": 80,
      "total_achievements_earned": 200
    }
  }
}
```

### 13. Get Activity Logs (Admin)

```bash
GET http://localhost:3000/api/admin/activity-logs?type=user_created&page=1&limit=20
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "user_id": 5,
        "username": "admin",
        "type": "user_created",
        "details": "{\"username\":\"newuser\",\"email\":\"newuser@example.com\"}",
        "status": "success",
        "timestamp": "2024-12-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

## 🧪 Test Data Samples

### Sample Users

```json
{
  "student": {
    "username": "student1",
    "email": "student1@example.com",
    "password": "Student@1234",
    "first_name": "John",
    "last_name": "Student",
    "role": "student"
  },
  "instructor": {
    "username": "instructor1",
    "email": "instructor1@example.com",
    "password": "Instructor@1234",
    "first_name": "Jane",
    "last_name": "Instructor",
    "role": "instructor"
  },
  "admin": {
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@1234",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }
}
```

### Sample Booking

```json
{
  "name": "John Student",
  "email": "student1@example.com",
  "contact": "+1234567890",
  "birthday": "1995-05-20",
  "home_address": "123 Main Street",
  "service_type": "rehearsal",
  "booking_date": "2024-12-25",
  "booking_time": "14:00",
  "hours": 2,
  "members": 1,
  "payment_method": "gcash"
}
```

### Sample Quiz Questions

```json
{
  "questions": [
    {
      "question": "What is the first note in C major scale?",
      "options": ["C", "D", "E", "F"],
      "correctAnswer": 0
    },
    {
      "question": "How many keys are on a standard piano?",
      "options": ["76", "88", "92", "96"],
      "correctAnswer": 1
    },
    {
      "question": "What does 'forte' mean in music?",
      "options": ["Loud", "Soft", "Fast", "Slow"],
      "correctAnswer": 0
    }
  ]
}
```

---

## 📝 Testing Checklist

### Authentication
- [ ] User registration with OTP
- [ ] User login
- [ ] Google OAuth login
- [ ] Facebook OAuth login
- [ ] Forgot password flow
- [ ] Password reset
- [ ] Token validation
- [ ] Logout

### Booking System
- [ ] Get user booking data
- [ ] Create booking
- [ ] Get booking details
- [ ] Xendit payment integration
- [ ] QR code generation
- [ ] Email notification

### Notifications
- [ ] Get notifications
- [ ] Get unread count
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Create notification
- [ ] Real-time Socket.IO updates

### Learning System
- [ ] Get instruments
- [ ] Get modules
- [ ] Get lessons
- [ ] Complete lesson
- [ ] Get user progress
- [ ] Achievement unlocking

### Quiz System
- [ ] Get quizzes
- [ ] Get quiz details
- [ ] Submit quiz
- [ ] Get quiz statistics
- [ ] Quiz achievements

### Admin Panel
- [ ] Dashboard metrics
- [ ] User management (CRUD)
- [ ] Appointment management
- [ ] Content management (modules, lessons, quizzes)
- [ ] Analytics
- [ ] Activity logs
- [ ] Notification management

---

## 🔧 Testing Tools

### Using cURL

```bash
# Example: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test@1234"}'
```

### Using Postman

1. Create a new collection: "MixLab API Tests"
2. Set base URL: `http://localhost:3000`
3. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set after login)
4. Add pre-request script to include token:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

### Using JavaScript/Fetch

```javascript
// Login example
async function testLogin() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'testuser',
      password: 'Test@1234'
    })
  });
  
  const data = await response.json();
  console.log('Login result:', data);
  return data.token;
}

// Use token for authenticated requests
async function testGetUser(token) {
  const response = await fetch('http://localhost:3000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log('User data:', data);
}
```

---

## ⚠️ Common Test Errors

### 401 Unauthorized
- **Cause:** Missing or invalid token
- **Fix:** Login first and include token in Authorization header

### 403 Forbidden
- **Cause:** Insufficient permissions (e.g., student trying to access admin endpoints)
- **Fix:** Use admin/instructor account for admin endpoints

### 400 Bad Request
- **Cause:** Invalid request data or missing required fields
- **Fix:** Check request body matches expected format

### 404 Not Found
- **Cause:** Invalid endpoint or resource doesn't exist
- **Fix:** Verify endpoint URL and resource ID

### 500 Internal Server Error
- **Cause:** Server-side error (database, external API, etc.)
- **Fix:** Check server logs for detailed error message

---

**Note:** Replace `YOUR_JWT_TOKEN` and `ADMIN_JWT_TOKEN` with actual tokens obtained from login responses.


