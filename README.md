# Twilio SMS OTP Backend

A secure Node.js + Express backend that provides SMS OTP verification using Twilio's Verify API for React e-commerce applications.

## Features

- 🔐 Secure OTP generation and verification
- 📱 SMS delivery via Twilio Verify API
- ✅ Input validation and error handling
- 🌐 CORS enabled for frontend integration
- 🛡️ Rate limiting protection via Twilio
- 📋 Comprehensive error responses

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Copy `.env.example` to `.env` and fill in your Twilio credentials:

```bash
cp .env.example .env
```

Get your credentials from [Twilio Console](https://console.twilio.com/):
- **TWILIO_SID**: Your Account SID
- **TWILIO_AUTH_TOKEN**: Your Auth Token  
- **TWILIO_VERIFY_SID**: Your Verify Service SID (create one in Verify Services)

### 3. Start the Server
```bash
npm start
# or
node server.js
```

Server will run on `http://localhost:5000`

## API Endpoints

### Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "status": "pending",
  "message": "OTP sent successfully",
  "phone": "+1234567890"
}
```

### Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "status": "approved",
  "message": "Phone number verified successfully",
  "phone": "+1234567890"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Invalid or expired verification code"
}
```

### Health Check
```http
GET /health
```

## Frontend Integration Example

```javascript
// Send OTP
const sendOTP = async (phoneNumber) => {
  try {
    const response = await fetch('http://localhost:5000/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

// Verify OTP
const verifyOTP = async (phoneNumber, code) => {
  try {
    const response = await fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber, code }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};
```

## Phone Number Format

Use E.164 format for phone numbers:
- ✅ `+1234567890` (US)
- ✅ `+447911123456` (UK)
- ✅ `+919876543210` (India)
- ❌ `1234567890` (missing country code)
- ❌ `(123) 456-7890` (formatted)

## Error Handling

The API handles various error scenarios:
- Invalid phone number format
- Missing required fields
- Twilio API errors (invalid phone, rate limits)
- Expired or invalid verification codes
- Network and server errors

## Security Features

- Input validation for phone numbers and codes
- Rate limiting via Twilio's built-in protection
- Environment variable protection for sensitive data
- Comprehensive error handling without exposing internals
- CORS configuration for controlled access

## Dependencies

- **express**: Web framework
- **twilio**: Twilio SDK for SMS/Verify API
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

## License

MIT