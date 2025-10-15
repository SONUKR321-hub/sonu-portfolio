// Google Calendar API Integration
class CalendarAPI {
    constructor() {
        this.API_KEY = 'YOUR_GOOGLE_CALENDAR_API_KEY'; // Replace with your actual API key
        this.CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/calendar';
        this.CALENDAR_ID = 'primary'; // Use 'primary' for main calendar or specific calendar ID
        
        this.gapi = null;
        this.googleAuth = null;
        this.isSignedIn = false;
        
        this.initializeAPI();
    }

    async initializeAPI() {
        try {
            // Load Google API
            await this.loadGoogleAPI();
            
            // Initialize Google API client
            await this.gapi.load('client:auth2', this.initClient.bind(this));
        } catch (error) {
            console.error('Error initializing Google Calendar API:', error);
        }
    }

    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                this.gapi = window.gapi;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.gapi = window.gapi;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initClient() {
        try {
            await this.gapi.client.init({
                apiKey: this.API_KEY,
                clientId: this.CLIENT_ID,
                discoveryDocs: [this.DISCOVERY_DOC],
                scope: this.SCOPES
            });

            this.googleAuth = this.gapi.auth2.getAuthInstance();
            this.isSignedIn = this.googleAuth.isSignedIn.get();

            console.log('Google Calendar API initialized successfully');
        } catch (error) {
            console.error('Error initializing Google API client:', error);
        }
    }

    async signIn() {
        try {
            if (!this.isSignedIn) {
                await this.googleAuth.signIn();
                this.isSignedIn = true;
            }
            return true;
        } catch (error) {
            console.error('Error signing in to Google:', error);
            return false;
        }
    }

    async getAvailableSlots(date) {
        try {
            if (!await this.signIn()) {
                throw new Error('Failed to authenticate with Google Calendar');
            }

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const response = await this.gapi.client.calendar.events.list({
                calendarId: this.CALENDAR_ID,
                timeMin: startOfDay.toISOString(),
                timeMax: endOfDay.toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            const events = response.result.items;
            return this.calculateAvailableSlots(date, events);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return this.getDefaultSlots(date); // Fallback to default slots
        }
    }

    calculateAvailableSlots(date, events) {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseSlots = isWeekend ? 
            ['10:00', '14:00', '16:00'] : 
            ['09:00', '10:30', '14:00', '15:30', '17:00'];

        // Filter out slots that conflict with existing events
        const availableSlots = baseSlots.filter(slot => {
            const slotTime = new Date(date);
            const [hours, minutes] = slot.split(':').map(Number);
            slotTime.setHours(hours, minutes, 0, 0);

            return !events.some(event => {
                const eventStart = new Date(event.start.dateTime || event.start.date);
                const eventEnd = new Date(event.end.dateTime || event.end.date);
                
                return slotTime >= eventStart && slotTime < eventEnd;
            });
        });

        return availableSlots;
    }

    getDefaultSlots(date) {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return isWeekend ? 
            ['10:00', '14:00', '16:00'] : 
            ['09:00', '10:30', '14:00', '15:30', '17:00'];
    }

    async createBookingEvent(bookingData) {
        try {
            if (!await this.signIn()) {
                throw new Error('Failed to authenticate with Google Calendar');
            }

            const startDateTime = new Date(bookingData.date);
            const [hours, minutes] = bookingData.time.split(':').map(Number);
            startDateTime.setHours(hours, minutes, 0, 0);

            const endDateTime = new Date(startDateTime.getTime() + bookingData.service.duration * 60000);

            const event = {
                summary: `${bookingData.service.title} - ${bookingData.fullName}`,
                description: this.formatEventDescription(bookingData),
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                attendees: [
                    { email: bookingData.email, displayName: bookingData.fullName }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 1 day before
                        { method: 'popup', minutes: 10 } // 10 minutes before
                    ]
                },
                conferenceData: {
                    createRequest: {
                        requestId: `booking-${Date.now()}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' }
                    }
                }
            };

            const response = await this.gapi.client.calendar.events.insert({
                calendarId: this.CALENDAR_ID,
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all'
            });

            console.log('Calendar event created successfully:', response.result);
            return response.result;
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    }

    formatEventDescription(bookingData) {
        return `
Service: ${bookingData.service.title}
Duration: ${bookingData.service.duration} minutes
Price: $${bookingData.service.price}

Client Information:
Name: ${bookingData.fullName}
Email: ${bookingData.email}
Phone: ${bookingData.phone || 'Not provided'}

Message: ${bookingData.message || 'No additional message'}

This is an automatically generated booking from the portfolio website.
        `.trim();
    }

    async updateAvailability(date) {
        try {
            const availableSlots = await this.getAvailableSlots(date);
            this.updateTimeSlotsUI(availableSlots);
        } catch (error) {
            console.error('Error updating availability:', error);
            // Fallback to default slots
            const defaultSlots = this.getDefaultSlots(date);
            this.updateTimeSlotsUI(defaultSlots);
        }
    }

    updateTimeSlotsUI(availableSlots) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;

        timeSlotsContainer.innerHTML = '';

        if (availableSlots.length === 0) {
            const noSlotsMessage = document.createElement('div');
            noSlotsMessage.textContent = 'No available time slots for this date';
            noSlotsMessage.style.textAlign = 'center';
            noSlotsMessage.style.color = 'var(--color-text-secondary)';
            noSlotsMessage.style.padding = 'var(--space-16)';
            timeSlotsContainer.appendChild(noSlotsMessage);
            return;
        }

        availableSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            
            slot.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.time-slot.selected').forEach(s => {
                    s.classList.remove('selected');
                });
                
                // Select current slot
                slot.classList.add('selected');
                window.selectedTime = time;
                
                if (window.updateBookingSummary) {
                    window.updateBookingSummary();
                }
                if (window.validateBooking) {
                    window.validateBooking();
                }
            });
            
            timeSlotsContainer.appendChild(slot);
        });
    }
}

// QR Code Payment System
class PaymentQRCode {
    constructor() {
        this.paymentMethods = {
            upi: {
                name: 'UPI Payment',
                prefix: 'upi://pay?',
                params: ['pa', 'pn', 'am', 'cu', 'tn']
            },
            paypal: {
                name: 'PayPal',
                url: 'https://www.paypal.me/',
                params: ['amount']
            }
        };
        
        // Your payment details (replace with actual details)
        this.paymentConfig = {
            upiId: 'yourname@paytm', // Replace with your UPI ID
            paypalUsername: 'YourPayPalUsername', // Replace with your PayPal username
            businessName: 'SK Portfolio Services',
            currency: 'USD'
        };
    }

    generateQRCode(bookingData, method = 'upi') {
        try {
            let qrData = '';
            
            if (method === 'upi') {
                qrData = this.generateUPIString(bookingData);
            } else if (method === 'paypal') {
                qrData = this.generatePayPalURL(bookingData);
            }
            
            return this.createQRCodeImage(qrData);
        } catch (error) {
            console.error('Error generating QR code:', error);
            return this.getPlaceholderQRCode();
        }
    }

    generateUPIString(bookingData) {
        const amount = bookingData.service.price;
        const transactionNote = `Booking: ${bookingData.service.title} - ${bookingData.fullName}`;
        
        const params = new URLSearchParams({
            pa: this.paymentConfig.upiId,
            pn: this.paymentConfig.businessName,
            am: amount.toString(),
            cu: this.paymentConfig.currency,
            tn: transactionNote
        });
        
        return `upi://pay?${params.toString()}`;
    }

    generatePayPalURL(bookingData) {
        const amount = bookingData.service.price;
        return `https://www.paypal.me/${this.paymentConfig.paypalUsername}/${amount}${this.paymentConfig.currency}`;
    }

    async createQRCodeImage(data) {
        try {
            // Using a simple QR code generation approach
            // In production, you might want to use a more robust QR code library
            const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
            
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = qrCodeURL;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            });
        } catch (error) {
            console.error('Error creating QR code image:', error);
            return this.getPlaceholderQRCode();
        }
    }

    getPlaceholderQRCode() {
        const placeholder = document.createElement('div');
        placeholder.innerHTML = `
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f0f0f0"/>
                <text x="100" y="105" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Your QR Code Here</text>
            </svg>
        `;
        return placeholder.firstElementChild;
    }

    async displayQRCode(bookingData, containerId, method = 'upi') {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Show loading state
            container.innerHTML = '<div class="spinner"></div>';
            
            const qrCodeImage = await this.generateQRCode(bookingData, method);
            container.innerHTML = '';
            container.appendChild(qrCodeImage);
            
            // Update payment instructions based on method
            this.updatePaymentInstructions(method, bookingData);
        } catch (error) {
            console.error('Error displaying QR code:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p style="color: var(--color-error);">Error generating QR code</p>';
            }
        }
    }

    updatePaymentInstructions(method, bookingData) {
        const instructionsContainer = document.querySelector('.payment-instructions');
        if (!instructionsContainer) return;

        let instructions = '';
        
        if (method === 'upi') {
            instructions = `
                <p><strong>UPI Payment Instructions:</strong></p>
                <ul style="text-align: left; margin-top: 8px;">
                    <li>Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Verify the amount: $${bookingData.service.price}</li>
                    <li>Complete the payment</li>
                    <li>Take a screenshot of the payment confirmation</li>
                </ul>
            `;
        } else if (method === 'paypal') {
            instructions = `
                <p><strong>PayPal Payment Instructions:</strong></p>
                <ul style="text-align: left; margin-top: 8px;">
                    <li>Scan the QR code or click the PayPal link</li>
                    <li>Login to your PayPal account</li>
                    <li>Send exactly $${bookingData.service.price}</li>
                    <li>Add "${bookingData.fullName} - ${bookingData.service.title}" in the note</li>
                </ul>
            `;
        }
        
        instructionsContainer.innerHTML = instructions;
    }

    // Method to switch between payment methods
    addPaymentMethodSwitcher(containerId, bookingData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const switcher = document.createElement('div');
        switcher.className = 'payment-method-switcher';
        switcher.style.marginBottom = 'var(--space-16)';
        switcher.innerHTML = `
            <div style="display: flex; gap: var(--space-8); justify-content: center;">
                <button class="btn btn-secondary payment-method-btn active" data-method="upi">UPI</button>
                <button class="btn btn-secondary payment-method-btn" data-method="paypal">PayPal</button>
            </div>
        `;

        // Insert before QR code container
        const qrContainer = container.querySelector('.qr-code-container');
        container.insertBefore(switcher, qrContainer);

        // Add click handlers
        switcher.querySelectorAll('.payment-method-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                switcher.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update QR code
                const method = btn.dataset.method;
                this.displayQRCode(bookingData, 'qrCode', method);
            });
        });
    }
}

// Email notification system (you can integrate with EmailJS or similar service)
class EmailNotification {
    constructor() {
        this.emailJSPublicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your EmailJS public key
        this.serviceId = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
        this.templateId = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
    }

    async sendConfirmationEmail(bookingData, calendarEvent) {
        try {
            // Initialize EmailJS (if not already done)
            if (window.emailjs) {
                const templateParams = {
                    to_email: bookingData.email,
                    client_name: bookingData.fullName,
                    service_name: bookingData.service.title,
                    booking_date: bookingData.date.toLocaleDateString(),
                    booking_time: bookingData.time,
                    duration: bookingData.service.duration,
                    price: bookingData.service.price,
                    meeting_link: calendarEvent?.hangoutLink || 'Will be provided separately',
                    additional_message: bookingData.message || 'N/A'
                };

                await window.emailjs.send(this.serviceId, this.templateId, templateParams, this.emailJSPublicKey);
                console.log('Confirmation email sent successfully');
            } else {
                console.warn('EmailJS not loaded, skipping email notification');
            }
        } catch (error) {
            console.error('Error sending confirmation email:', error);
        }
    }
}

// Export classes for use in booking.html
window.CalendarAPI = CalendarAPI;
window.PaymentQRCode = PaymentQRCode;
window.EmailNotification = EmailNotification;