# 📡 Complete OTP API Documentation

## Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://your-vercel-url.vercel.app`

---

## 1. 🏠 Root Endpoint

### **GET /**
**Description**: Get API information and available endpoints

**Request**: No parameters required

**Response**:
```json
{
  "message": "🚀 OTP API is running!",
  "documentation": "/docs",
  "endpoints": {
    "POST /send-otp": "Send OTP to phone number",
    "POST /verify-otp": "Verify OTP code"
  }
}
```

---

## 2. 💊 Health Check

### **GET /health**
**Description**: Check if the API is running

**Request**: No parameters required

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:45.123Z"
}
```

---

## 3. 📚 Documentation

### **GET /docs**
**Description**: Interactive Swagger UI documentation

**Request**: No parameters required

**Response**: HTML page with Swagger UI interface

---

## 4. 📱 Send OTP

### **POST /send-otp**
**Description**: Send a 6-digit OTP code to the specified phone number via SMS

**Request Body**:
```json
{
  "phone": "+919876543210"
}
```

**Request Headers**:
```
Content-Type: application/json
```

### **Responses**:

#### ✅ **Success (200)**
```json
{
  "success": true,
  "status": "pending",
  "message": "OTP sent successfully"
}
```

#### ❌ **Bad Request (400) - Missing Phone**
```json
{
  "error": "Phone number is required"
}
```

#### ❌ **Bad Request (400) - Invalid Phone Format**
```json
{
  "error": "Invalid phone number format. Use E.164 format (e.g., +919876543210)"
}
```

#### ❌ **Unauthorized (401) - Invalid Twilio Credentials**
```json
{
  "error": "Invalid Twilio credentials"
}
```

#### ❌ **Bad Request (400) - Invalid Phone Number**
```json
{
  "error": "Invalid phone number"
}
```

#### ❌ **Too Many Requests (429) - Rate Limited**
```json
{
  "error": "Too many requests. Please try again later."
}
```

#### ❌ **Internal Server Error (500) - Missing Config**
```json
{
  "error": "Server configuration error. Missing Twilio credentials."
}
```

#### ❌ **Internal Server Error (500) - General Error**
```json
{
  "error": "Failed to send OTP. Please try again.",
  "details": "Error details (only in development mode)"
}
```

#### ❌ **Method Not Allowed (405)**
```json
{
  "error": "Method not allowed"
}
```

---

## 5. ✅ Verify OTP

### **POST /verify-otp**
**Description**: Verify the OTP code sent to the phone number

**Request Body**:
```json
{
  "phone": "+919876543210",
  "code": "123456"
}
```

**Request Headers**:
```
Content-Type: application/json
```

### **Responses**:

#### ✅ **Success (200) - OTP Verified**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

#### ❌ **Bad Request (400) - Missing Parameters**
```json
{
  "error": "Both phone number and OTP code are required"
}
```

#### ❌ **Bad Request (400) - Invalid Phone Format**
```json
{
  "error": "Invalid phone number format. Use E.164 format (e.g., +919876543210)"
}
```

#### ❌ **Bad Request (400) - Invalid OTP Format**
```json
{
  "error": "Invalid OTP format. Code must be 4-6 digits"
}
```

#### ❌ **Bad Request (400) - Invalid/Expired OTP**
```json
{
  "success": false,
  "error": "Invalid or expired OTP code",
  "status": "denied"
}
```

#### ❌ **Bad Request (400) - No Pending Verification**
```json
{
  "error": "No pending verification found for this phone number"
}
```

#### ❌ **Bad Request (400) - Max Attempts Reached**
```json
{
  "error": "Maximum verification attempts reached"
}
```

#### ❌ **Unauthorized (401) - Invalid Twilio Credentials**
```json
{
  "error": "Invalid Twilio credentials"
}
```

#### ❌ **Internal Server Error (500) - Missing Config**
```json
{
  "error": "Server configuration error. Missing Twilio credentials."
}
```

#### ❌ **Internal Server Error (500) - General Error**
```json
{
  "error": "Failed to verify OTP. Please try again.",
  "details": "Error details (only in development mode)"
}
```

#### ❌ **Method Not Allowed (405)**
```json
{
  "error": "Method not allowed"
}
```

---

## 📋 Request Examples

### **cURL Examples**

#### Send OTP:
```bash
curl -X 'POST' \
  'http://localhost:3000/send-otp' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "phone": "+919876543210"
}'
```

#### Verify OTP:
```bash
curl -X 'POST' \
  'http://localhost:3000/verify-otp' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "phone": "+919876543210",
  "code": "123456"
}'
```

### **JavaScript Fetch Examples**

#### Send OTP:
```javascript
const response = await fetch('http://localhost:3000/send-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '+919876543210'
  })
});

const data = await response.json();
console.log(data);
```

#### Verify OTP:
```javascript
const response = await fetch('http://localhost:3000/verify-otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '+919876543210',
    code: '123456'
  })
});

const data = await response.json();
console.log(data);
```

---

## 📱 Phone Number Format

**Use E.164 format for phone numbers:**
- ✅ `+919876543210` (India)
- ✅ `+1234567890` (US)
- ✅ `+447911123456` (UK)
- ❌ `9876543210` (Missing country code)
- ❌ `+91 98765 43210` (Contains spaces)

---

## 🔐 OTP Code Format

**Accepted OTP formats:**
- ✅ `1234` (4 digits)
- ✅ `12345` (5 digits)
- ✅ `123456` (6 digits)
- ❌ `123` (Too short)
- ❌ `1234567` (Too long)
- ❌ `12a4` (Contains letters)

---

## 🚨 Error Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (Invalid input) |
| 401 | Unauthorized (Invalid credentials) |
| 405 | Method Not Allowed |
| 429 | Too Many Requests (Rate limited) |
| 500 | Internal Server Error |

---

## 🔧 Environment Variables Required

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
NODE_ENV=development
```