# API Testing Guide - E-commerce Backend

## 🚀 Quick Start

### 1. Import Postman Collection
- Mở Postman
- Click **Import** → **Upload Files**
- Chọn file `ecommerce-backend-postman-collection.json`

### 2. Setup Environment Variables
Sau khi import, setup các biến sau trong Postman:

| Variable | Value | Description |
|----------|--------|-------------|
| `base_url` | `http://localhost:3052` | Server URL |
| `api_key` | `your-api-key` | API Key từ database |

### 3. Get API Key từ Database

Bạn cần tạo API key trong MongoDB:

```javascript
// Connect to MongoDB và chạy script này
db.apikeys.insertOne({
    key: "ecommerce-api-key-2024",
    status: true,
    permissions: ["1111"] // Shop permissions
})
```

Hoặc sử dụng existing API key nếu có.

## 📋 API Endpoints

### ✅ Authentication (Working)

#### 1. Shop Sign Up
- **Method**: `POST`
- **URL**: `/v1/api/shop/signup`
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: your-api-key`
- **Body**:
```json
{
    "name": "Test Shop",
    "email": "testshop@example.com",
    "password": "password123"
}
```

#### 2. Shop Login (Newly Fixed)
- **Method**: `POST`
- **URL**: `/v1/api/shop/login`
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: your-api-key`
- **Body**:
```json
{
    "email": "testshop@example.com",
    "password": "password123"
}
```

### 🔍 Health Check

#### Server Health
- **Method**: `GET`
- **URL**: `/v1/api`
- **Headers**: 
  - `x-api-key: your-api-key`

## 🛠️ Testing Workflow

### Step 1: Verify Server is Running
1. Chạy `npm run dev` trong project directory
2. Kiểm tra server logs: "Server running on port 3052"
3. Test health check endpoint

### Step 2: Test API Key Authentication
1. Tạo hoặc lấy API key từ database
2. Update biến `api_key` trong Postman
3. Test health check endpoint để verify API key

### Step 3: Test Shop Registration
1. Thay đổi email trong signup request (unique email)
2. Send signup request
3. Verify response chứa:
   - Shop info (name, email, _id)
   - Access token và refresh token

### Step 4: Test Shop Login (NEW)
1. Sử dụng email/password từ shop đã register
2. Send login request
3. Verify response chứa:
   - Shop info
   - New tokens

## 📊 Expected Response Formats

### Successful Shop Signup/Login:
```json
{
    "success": true,
    "message": "Shop registered/logged in successfully",
    "metadata": {
        "shop": {
            "_id": "...",
            "name": "Test Shop",
            "email": "testshop@example.com"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIs...",
            "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
        }
    }
}
```

### Error Response:
```json
{
    "success": false,
    "message": "Error description",
    "error": "Detailed error message"
}
```

## 🐛 Common Issues & Solutions

### 1. "API key not found"
- Kiểm tra x-api-key header
- Verify API key tồn tại trong database
- Kiểm tra permissions array

### 2. "Email already registered"
- Thay đổi email trong signup request
- Hoặc test login với email đã có

### 3. "Invalid password"
- Kiểm tra password spelling
- Verify shop đã được tạo thành công

### 4. "Failed to generate tokens"
- Kiểm tra JWT dependencies
- Verify crypto functions working
- Check server logs for detailed errors

## 🔧 Development Notes

### Fixed Issues:
- ✅ TypeScript compilation errors resolved
- ✅ Static method access fixed (AccessService.login)
- ✅ KeyToken service parameters completed
- ✅ Null token validation added
- ✅ Shop login API fully implemented

### Current Status:
- ✅ Shop Registration: Working
- ✅ Shop Login: Working (newly fixed)
- 🔄 JWT Verification Middleware: Coming next
- 🔄 Protected Routes: Coming next

### Database Collections Used:
- `shops`: User accounts
- `keytokens`: JWT key storage
- `apikeys`: API authentication

## 📝 Next Development Steps

1. **JWT Verification Middleware** - Protect routes với Bearer tokens
2. **Role-based Authorization** - Admin vs Shop permissions
3. **Product Management APIs** - CRUD operations
4. **Input Validation** - Request validation middleware
5. **Error Logging** - Enhanced error tracking 