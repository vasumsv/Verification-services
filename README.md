# OTP Backend API with Swagger UI

A complete OTP (One-Time Password) backend service built with Express.js, Twilio Verify, and Swagger UI documentation.

## 🚀 Features

- **Send OTP**: Send 6-digit OTP codes via SMS using Twilio Verify
- **Verify OTP**: Verify OTP codes with comprehensive error handling
- **Swagger UI**: Interactive API documentation at `/docs`
- **Vercel Ready**: Configured for easy deployment to Vercel
- **Error Handling**: Comprehensive error handling with meaningful messages
- **CORS Support**: Cross-origin requests enabled
- **Input Validation**: Phone number and OTP format validation

## 📋 Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com/)
2. **Twilio Verify Service**: Create one at [Twilio Console](https://console.twilio.com/us1/develop/verify/services)

## 🛠️ Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Twilio credentials:
   ```bash
   cp .env.example .env
   ```

3. **Get Twilio Credentials**:
   - `TWILIO_ACCOUNT_SID`: From [Twilio Console](https://console.twilio.com/)
   - `TWILIO_AUTH_TOKEN`: From [Twilio Console](https://console.twilio.com/)
   - `TWILIO_VERIFY_SERVICE_SID`: Create a Verify Service first

## 🏃‍♂️ Running Locally

```bash
npm run dev
```

The server will start on `http://localhost:3000`

- **API Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## 📡 API Endpoints

### POST /send-otp
Send OTP to a phone number.

**Request Body**:
```json
{
  "phone": "+919876543210"
}
```

**Response**:
```json
{
  "success": true,
  "status": "pending",
  "message": "OTP sent successfully"
}
```

### POST /verify-otp
Verify the OTP code.

**Request Body**:
```json
{
  "phone": "+919876543210",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

## 🚀 Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`

## 📚 Testing with Swagger UI

1. Open `/docs` in your browser
2. Try the "Send OTP" endpoint with your phone number
3. Check your phone for the OTP
4. Use the "Verify OTP" endpoint to verify the code

## 🔧 Error Handling

The API includes comprehensive error handling for:
- Invalid phone number formats
- Missing Twilio credentials
- Rate limiting
- Invalid OTP codes
- Expired verification attempts

## 📱 Phone Number Format

Use E.164 format for phone numbers:
- ✅ `+919876543210` (India)
- ✅ `+1234567890` (US)
- ❌ `9876543210` (Missing country code)

## 🛡️ Security Features

- Input validation for phone numbers and OTP codes
- Environment variable protection
- CORS configuration
- Error message sanitization in production

## 📄 License

MIT License - feel free to use this in your projects!