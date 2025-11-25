# Contact Page Setup Instructions

## Overview
Your new contact page has been created at `contact.html` with three contact methods and a comprehensive contact form.

## 1. Cal.com Integration Setup

### Step 1: Create Cal.com Account
1. Go to https://cal.com and sign up for an account
2. Choose a username (this will be part of your booking links)
3. Complete your profile setup

### Step 2: Create Event Types
You need to create two event types in Cal.com:

**Event Type 1: Phone Consultation**
- Event name: "Phone Consultation"
- Duration: 30 minutes (or your preference)
- Location: Phone call
- URL slug: `phone-consultation`

**Event Type 2: Meeting**
- Event name: "Project Meeting"
- Duration: 60 minutes (or your preference)
- Location: Your office address or video call (Zoom/Google Meet)
- URL slug: `meeting`

### Step 3: Update Contact Page Links
In `contact.html`, find these two lines and replace `your-username` with your actual Cal.com username:

Line 32:
```html
<a href="https://cal.com/your-username/phone-consultation" target="_blank" class="method-button" data-cal-link="your-username/phone-consultation">Book Now</a>
```

Line 42:
```html
<a href="https://cal.com/your-username/meeting" target="_blank" class="method-button" data-cal-link="your-username/meeting">Schedule Meeting</a>
```

Example: If your username is "coastal-construction", change to:
- `https://cal.com/coastal-construction/phone-consultation`
- `https://cal.com/coastal-construction/meeting`

### Step 4: Customize Cal.com Appearance (Optional)
In your Cal.com dashboard:
1. Go to Settings → Appearance
2. Set brand color to `#dc2626` (your company red)
3. Upload your logo
4. Customize booking page text

## 2. Email Form Setup

### Current Implementation (Temporary)
The form currently uses `mailto:` links, which:
- Opens the user's default email client
- Pre-fills the email with form data
- Sends to ccsofla@yahoo.com

**Limitations:**
- Requires user to have email client configured
- User can see/edit the email before sending
- Not the most professional experience

### Recommended: Server-Side Email Implementation

#### Option A: Using FormSubmit (Easiest - No Coding)
1. Go to https://formsubit.co
2. Update the form action in contact.html (line 68):
```html
<form id="contactForm" class="contact-form" action="https://formsubit.co/ccsofla@yahoo.com" method="POST">
```
3. Add these hidden fields after line 68:
```html
<input type="hidden" name="_subject" value="New Quote Request from Coastal Construction">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_next" value="https://yourwebsite.com/thank-you.html">
```
4. Remove or comment out the JavaScript form handler (lines 173-215)

#### Option B: Using EmailJS (Free tier available)
1. Sign up at https://www.emailjs.com
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Replace the JavaScript form handler in contact.html with EmailJS code

#### Option C: Backend Server (Most Professional)
You'll need a backend server with PHP, Node.js, or Python. Example with PHP:

Create `send_email.php`:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = htmlspecialchars($_POST['fullName']);
    $phone = htmlspecialchars($_POST['phone']);
    $email = htmlspecialchars($_POST['email']);
    $service = htmlspecialchars($_POST['service']);
    $timeline = htmlspecialchars($_POST['timeline']);
    $location = htmlspecialchars($_POST['location']);
    $description = htmlspecialchars($_POST['projectDescription']);
    
    $to = "ccsofla@yahoo.com";
    $subject = "New Quote Request from $fullName";
    
    $message = "
    New Contact Form Submission from Coastal Construction Website
    
    Contact Information:
    --------------------
    Name: $fullName
    Phone: $phone
    Email: $email
    
    Project Details:
    ---------------
    Service Needed: $service
    Timeline: $timeline
    Location: $location
    
    Project Description:
    -------------------
    $description
    ";
    
    $headers = "From: website@coastalconstruction.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}
?>
```

Then update the form's action attribute to: `action="send_email.php"`

## 3. File Structure
```
/mnt/project/
├── coastal-construction.html (updated navigation)
├── services.html (updated navigation)
├── about.html (updated navigation)
├── contact.html (NEW)
├── styles.css (updated with contact page styles)
└── images/
    ├── logo-square.png
    └── CCSofLA_Owner.png
```

## 4. Testing Checklist

### Before Going Live:
- [ ] Replace Cal.com placeholder links with your actual username
- [ ] Test both Cal.com booking buttons
- [ ] Test the contact form submission
- [ ] Test form validation (try submitting empty fields)
- [ ] Test phone number formatting
- [ ] Test on mobile devices
- [ ] Verify email is being received at ccsofla@yahoo.com
- [ ] Check all navigation links work correctly

### Form Fields to Test:
- [ ] Full Name (required)
- [ ] Phone Number (required, auto-formats)
- [ ] Email Address (required, validates email format)
- [ ] Service Needed (required, dropdown)
- [ ] Project Description (required, textarea)
- [ ] Timeline (required, dropdown)
- [ ] Location (optional)

## 5. Additional Enhancements (Optional)

### Add Google reCAPTCHA
Prevent spam submissions by adding Google reCAPTCHA v3:
1. Sign up at https://www.google.com/recaptcha
2. Get your site key and secret key
3. Add the reCAPTCHA script to contact.html
4. Implement server-side verification

### Add Thank You Page
Create a `thank-you.html` page to redirect users after form submission:
- Thank them for their inquiry
- Reiterate response time (within 24 hours)
- Provide additional contact information
- Link back to home page

### Email Notifications
Set up email notifications to receive instant alerts when someone submits the form (most email services support this).

## 6. Troubleshooting

### Cal.com buttons not working:
- Check that Cal.com embed script is loading (line 158-183)
- Verify your Cal.com username is correct
- Ensure event type slugs match exactly

### Form not sending emails:
- Check browser console for JavaScript errors
- Verify email address is correct
- If using mailto:, ensure email client is configured
- Consider switching to server-side solution

### Styling issues:
- Clear browser cache
- Check that styles.css is loading correctly
- Verify all CSS classes match between HTML and CSS

## 7. Support Resources

- Cal.com Documentation: https://cal.com/docs
- FormSubmit Documentation: https://formsubit.co/documentation
- EmailJS Documentation: https://www.emailjs.com/docs/
- Web Forms Best Practices: https://web.dev/learn/forms/

## Questions or Issues?
If you need help with setup or customization, feel free to ask!
