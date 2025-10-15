# 🗓️ Booking System Setup Guide

## Overview
Your portfolio now includes a comprehensive booking system with Google Calendar integration and QR code payments. This guide will help you configure the system for production use.

## 🔧 Required API Keys and Setup

### 1. Google Calendar API Setup

#### Step 1: Enable Google Calendar API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Go to "Credentials" and create:
   - **API Key** (for public calendar access)
   - **OAuth 2.0 Client ID** (for calendar event creation)

#### Step 2: Configure OAuth
1. Add your domain to authorized domains
2. Add these redirect URIs:
   - `http://localhost:8000` (for testing)
   - `https://yourdomain.com` (for production)

#### Step 3: Update Configuration
In `booking-system.js`, replace these values:
```javascript
this.API_KEY = 'your_actual_google_api_key';
this.CLIENT_ID = 'your_actual_google_client_id';
```

### 2. Payment QR Code Setup

#### Update Payment Details
In `booking-system.js`, update the `paymentConfig` object:
```javascript
this.paymentConfig = {
    upiId: 'yourname@paytm',           // Your UPI ID
    paypalUsername: 'YourPayPalUsername', // Your PayPal username
    businessName: 'Your Business Name',
    currency: 'USD' // or your preferred currency
};
```

### 3. Email Notifications Setup (Optional)

#### Using EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template with these variables:
   - `{{to_email}}`, `{{client_name}}`, `{{service_name}}`
   - `{{booking_date}}`, `{{booking_time}}`, `{{duration}}`
   - `{{price}}`, `{{meeting_link}}`, `{{additional_message}}`

4. Update configuration in `booking-system.js`:
```javascript
this.emailJSPublicKey = 'your_emailjs_public_key';
this.serviceId = 'your_service_id';
this.templateId = 'your_template_id';
```

## 🚀 Features Included

### ✅ Service Selection
- **Consultation** - $50, 60 minutes
- **Web Development** - $200, 2 hours  
- **Code Review** - $75, 90 minutes
- **Mentoring Session** - $100, 90 minutes

### ✅ Calendar Integration
- Real-time availability checking
- Automatic calendar event creation
- Google Meet integration
- Email reminders

### ✅ Payment System
- **UPI QR Code** - For Indian payments
- **PayPal QR Code** - For international payments
- Automatic payment amount calculation
- Payment reference generation

### ✅ Booking Management
- Form validation
- Booking confirmation
- Email notifications
- Calendar sync

## 🎨 Customization

### Adding New Services
Edit the service cards in `booking.html`:
```html
<div class="service-card" data-service="new-service" data-price="150" data-duration="120">
    <h3 class="service-title">New Service</h3>
    <p class="service-description">Description of your new service</p>
    <div class="service-price">$150</div>
    <div class="service-duration">2 hours</div>
</div>
```

### Customizing Time Slots
Update the time slots in `booking-system.js`:
```javascript
calculateAvailableSlots(date, events) {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseSlots = isWeekend ? 
        ['10:00', '14:00', '16:00'] :          // Weekend slots
        ['09:00', '10:30', '14:00', '15:30'];  // Weekday slots
    // ... rest of the function
}
```

### Changing Color Scheme
The booking system uses the same CSS variables as your portfolio:
- `--color-primary`: #6366f1 (purple)
- `--color-secondary`: #3b82f6 (blue)
- `--color-background`: #0f0f23 (dark background)

## 📱 Mobile Responsiveness
- Fully responsive design
- Touch-friendly interface
- Mobile-optimized calendar
- Accessible navigation

## 🔒 Security Considerations

### API Key Security
- Never expose API keys in client-side code for production
- Use environment variables or server-side proxy
- Implement proper CORS policies

### Payment Security
- QR codes are for reference only
- Implement proper payment verification
- Use secure payment gateways for real transactions

## 🚀 Deployment Checklist

### Before Going Live:
1. ✅ Replace all placeholder API keys
2. ✅ Test Google Calendar integration
3. ✅ Test payment QR code generation
4. ✅ Test email notifications
5. ✅ Configure proper domain settings
6. ✅ Test on mobile devices
7. ✅ Set up SSL certificate

### Production Recommendations:
- Use a proper backend for sensitive operations
- Implement rate limiting
- Add booking confirmation system
- Set up monitoring and analytics
- Regular backup of calendar data

## 📞 Support
For additional customization or support:
- Review the code comments in `booking-system.js`
- Test thoroughly in development before deployment
- Consider implementing server-side validation
- Add proper error handling for production use

---

**Your booking system is now ready!** 🎉

Access it at: `http://127.0.0.1:8000/booking.html`