# 📧 Email Notification Setup Guide

## Overview
This guide will help you set up email notifications so you receive an email every time someone books a JEE mentoring session.

## 🔧 EmailJS Setup

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions to connect your email
5. Note down the **Service ID** (you'll need this later)

### Step 3: Create Email Templates

#### Template 1: Mentor Notification (For You)
1. Go to **Email Templates** → **Create New Template**
2. **Template Name**: `jee_mentor_notification`
3. **Subject**: `🎓 New JEE Mentoring Booking - {{student_name}}`
4. **Content**:
```
Hi Sonu,

You have a new JEE mentoring session booking!

📋 BOOKING DETAILS:
Student Name: {{student_name}}
Email: {{student_email}}
Phone: {{student_phone}}

📅 SESSION DETAILS:
Service: {{service_name}}
Date: {{booking_date}}
Time: {{booking_time}}
Duration: {{duration}}
Price: {{price}}

💬 STUDENT MESSAGE:
{{student_message}}

🆔 Booking ID: {{booking_id}}
📅 Booked on: {{booking_timestamp}}

Please prepare for the session and contact the student if needed.

Best regards,
Booking System
```
5. Save and note the **Template ID**

#### Template 2: Student Confirmation
1. Create another template with name: `jee_student_confirmation`
2. **Subject**: `✅ JEE Mentoring Session Confirmed - {{booking_date}}`
3. **Content**:
```
Hi {{student_name}},

Your JEE mentoring session has been confirmed!

📋 SESSION DETAILS:
Service: {{service_name}}
Date: {{booking_date}}
Time: {{booking_time}}
Duration: {{duration}}
Price: {{price}}

👨‍🏫 MENTOR: {{mentor_name}}
Contact: {{mentor_email}}

💳 PAYMENT:
{{payment_instructions}}

📞 MEETING:
{{meeting_instructions}}

🆔 Booking ID: {{booking_id}}

Looking forward to helping you with your JEE preparation!

Best regards,
Sonu Kumar
JEE Mentor
```
4. Save and note the **Template ID**

### Step 4: Get Your Keys
1. Go to **Account** → **General**
2. Copy your **Public Key**
3. You now have:
   - Public Key
   - Service ID
   - Mentor Template ID
   - Student Template ID

## 🔧 Code Configuration

### Update booking.html
Replace these placeholders in your `booking.html` file:

```javascript
// Line ~1025: Replace with your actual EmailJS public key
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

// Line ~1055: Replace with your actual email
to_email: "your.email@gmail.com",

// Line ~1070: Replace with your service ID and mentor template ID
await emailjs.send(
    "YOUR_SERVICE_ID",           // Your EmailJS service ID
    "YOUR_MENTOR_TEMPLATE_ID",   // Your mentor notification template ID
    templateParams
);

// Line ~1100: Replace with your actual email
mentor_email: "your.email@gmail.com",

// Line ~1115: Replace with your service ID and student template ID
await emailjs.send(
    "YOUR_SERVICE_ID",           // Your EmailJS service ID
    "YOUR_STUDENT_TEMPLATE_ID",  // Your student confirmation template ID
    templateParams
);
```

### Example Configuration
```javascript
// Example values (replace with your actual values):
emailjs.init("user_abcd1234efgh5678");

to_email: "sonu.mentor@gmail.com",

await emailjs.send(
    "service_xyz123",
    "template_mentor_abc456",
    templateParams
);

mentor_email: "sonu.mentor@gmail.com",

await emailjs.send(
    "service_xyz123",
    "template_student_def789",
    templateParams
);
```

## 📧 What Happens After Setup

### When a Student Books:
1. **You receive an email** with:
   - Student's contact details
   - Session date, time, and duration
   - Student's message/requirements
   - Booking ID for reference

2. **Student receives a confirmation** with:
   - Session details
   - Your contact information
   - Payment instructions
   - Meeting instructions

### Email Features:
- ✅ **Instant Notifications** - Get notified immediately
- ✅ **Complete Details** - All booking information included
- ✅ **Professional Templates** - Well-formatted emails
- ✅ **Unique Booking IDs** - Easy tracking and reference
- ✅ **Mobile Friendly** - Works on all devices

## 🧪 Testing

### Test the Email System:
1. Make a test booking on your website
2. Check your email for the mentor notification
3. Check the test email address for student confirmation
4. Verify all details are correct

### Troubleshooting:
- **No emails received**: Check spam folder, verify EmailJS setup
- **Template errors**: Ensure all variables are correctly named
- **Service errors**: Verify Service ID and Template IDs are correct

## 💡 Pro Tips

1. **Set up email filters** to organize booking emails
2. **Create calendar events** from the booking emails
3. **Reply to students** directly from the notification email
4. **Keep a backup** of your EmailJS configuration
5. **Test regularly** to ensure emails are working

## 🔒 Security Notes

- EmailJS public key is safe to use in frontend code
- Never expose your private EmailJS keys
- Keep your email credentials secure
- Regularly check EmailJS usage limits

---

**Your booking system will now send you email notifications for every new session booking!** 📧✨

For support with EmailJS setup, visit: https://www.emailjs.com/docs/