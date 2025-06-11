# Active Context - E-commerce Backend

## Current Work Focus
**JWT Authentication System & Shop Registration API - COMPLETED** ✅
**API Key System & Symmetric Keys Naming - COMPLETED** ✅

Đã hoàn thành:
- Complete shop registration với JWT authentication
- TypeScript configuration với strict mode  
- Express.js setup với type safety (Express 5.x compatibility issues resolved)
- **Comprehensive TypeScript Types System** cho toàn bộ ecommerce domain
- MongoDB Atlas integration hoàn chỉnh
- JWT token generation và management với proper symmetric key naming
- **API Key Authentication System** với permission-based access control
- Type-safe service và controller layers
- Development workflow setup

## Recent Changes (Latest Session)
1. **Symmetric Keys Naming Convention - FIXED** ✅
   - **Variable Naming**: Chuyển từ `privateKey/publicKey` sang `accessTokenSecret/refreshTokenSecret`
   - **Code Clarity**: Rõ ràng mục đích sử dụng từng secret key
   - **JWT Token Creation**: Separate secrets cho access và refresh tokens
   - **Database Comments**: Thêm comment giải thích mục đích trong schema
   - **Consistency**: Unified naming convention throughout codebase

2. **API Key System Implementation** ✅
   - **API Key Model**: Schema với key, status, permissions fields
   - **Permission Levels**: 0000 (basic), 1111 (shop), 2222 (admin)
   - **Middleware Integration**: x-api-key header validation
   - **Access Control**: Permission-based route protection
   - **Service Layer**: ApiKeyService với proper CRUD operations

3. **JWT Authentication System Implementation**
   - **Symmetric Key Generation**: `crypto.randomBytes(64).toString('hex')` cho production-ready keys
   - **KeyToken Management**: Database storage cho access/refresh token secrets
   - **Token Creation**: Access token (2 days) và refresh token (7 days) với HS256 algorithm
   - **Error Handling**: Comprehensive error handling cho token creation failures
   - **Proper Naming**: accessTokenSecret/refreshTokenSecret thay vì publicKey/privateKey
   
4. **Shop Registration API - FULLY WORKING**
   - **Endpoint**: `POST /v1/api/shop/signup` - TESTED và WORKING ✅
   - **Authentication Flow**: Email → Password hashing → Key generation → Token creation
   - **Database Integration**: Shop data và KeyToken storage hoàn chỉnh
   - **Response Format**: Standardized API response với shop info và tokens
   - **Security**: bcrypt password hashing, JWT tokens, type-safe operations

5. **TypeScript Type System Enhancements**
   - **Fixed getInfoData utility**: Generic types với proper type constraints
   - **Type-safe service responses**: ShopResponse interface với proper typing
   - **Utility function**: `getInfoData<T>` cho selective field extraction
   - **Error handling**: Type-safe error responses throughout

6. **Database & Environment Setup**
   - **MongoDB Atlas**: Fully connected và operational
   - **Environment Config**: Type-safe `.env` configuration
   - **Models**: Shop model, KeyToken model, ApiKey model working
   - **Connection Monitoring**: Active connection tracking

## Active Decisions & Considerations

### ✅ Completed Decisions:
- **Language**: TypeScript với strict mode (type safety priority)
- **Framework**: Express.js (mature, flexible)
- **Database**: MongoDB Atlas với Mongoose
- **Authentication**: JWT với symmetric key generation (HS256)
- **API Key System**: x-api-key header với permission-based access control
- **Key Naming**: accessTokenSecret/refreshTokenSecret cho clarity
- **Password Security**: bcrypt với salt rounds 10
- **Architecture**: Layered architecture (Controllers → Services → Models)
- **Error Handling**: Centralized error middleware với custom AppError
- **API Format**: Standardized ApiResponse interface
- **Development Setup**: ts-node + nodemon với tsconfig-paths

### 🔄 Next Implementation Priorities:
1. **Shop Login API** - Complement registration với login functionality
2. **JWT Verification Middleware** - Protect routes và user authentication
3. **Role-based Authorization** - Admin vs Shop user permissions  
4. **Product Management APIs** - CRUD operations cho products
5. **Input Validation** - express-validator hoặc Joi integration

## Current Working Features

### 🟢 Fully Functional:
1. **API Key Authentication System**
   - x-api-key header validation
   - Permission-based access control (0000, 1111, 2222)
   - ApiKey model với status và permissions
   - Middleware integration cho all routes

2. **Shop Registration API** (`POST /v1/api/shop/signup`)
   - Input validation (name, email, password required)
   - Email uniqueness check
   - Password hashing với bcrypt
   - JWT token generation (access + refresh) với proper secret naming
   - Database storage (shop + keytokens)
   - Type-safe responses
   
3. **Server Infrastructure**
   - Express.js server on port 3052
   - MongoDB Atlas connection
   - Error handling middleware
   - Security headers (helmet)
   - Request logging (morgan)
   - CORS and compression

4. **Development Workflow**
   - Hot reload với nodemon
   - TypeScript compilation
   - Path mapping (@/* aliases)
   - Environment variable management

## Authentication Architecture

### Request Flow:
```
1. Client Request
   ├── Header: x-api-key (required)
   └── Header: Authorization (Bearer token - future)

2. API Key Middleware
   ├── Validate x-api-key
   ├── Check permissions
   └── Attach objKey to request

3. JWT Middleware (Next Phase)
   ├── Validate Bearer token
   ├── Verify với stored secrets
   └── Attach user to request

4. Route Handler
   ├── Access req.objKey (API key info)
   ├── Access req.user (user info - future)
   └── Execute business logic
```

### JWT Key Management:
```typescript
// Key Generation (Improved Naming)
const accessTokenSecret = crypto.randomBytes(64).toString('hex');
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');

// Database Storage (KeyToken model)
{
    publicKey: accessTokenSecret,   // access token secret (symmetric)
    privateKey: refreshTokenSecret  // refresh token secret (symmetric)
}

// Token Creation
const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '2 days' });
const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7 days' });
```

## Next Immediate Steps

### Phase 1: Complete Authentication System (IMMEDIATE)
1. **Shop Login API**
   - `POST /v1/api/shop/login` endpoint
   - Email/password validation
   - JWT token refresh mechanism
   - Session management

2. **JWT Verification Middleware**
   - Token verification middleware
   - User context injection
   - Protected route implementation
   - Token refresh handling

### Phase 2: Product Management System
1. **Product CRUD APIs**
   - Create, read, update, delete products
   - Image upload support
   - Category assignment
   - Inventory management

2. **Category Management**
   - Category CRUD operations
   - Hierarchical categories
   - Category-product relationships

### Phase 3: Order & Cart System
1. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent storage

2. **Order Processing**
   - Cart to order conversion
   - Order status management
   - Payment integration prep

## Current Status Assessment
- ✅ **Foundation**: 100% Complete
- ✅ **Database**: 100% Operational (MongoDB Atlas)
- ✅ **API Key System**: 100% Working
- ✅ **Authentication**: 70% Complete (registration working, login needed)
- ✅ **Shop Registration**: 100% Working
- ✅ **JWT Key Naming**: 100% Fixed (symmetric key clarity)
- 🔄 **Protected Routes**: 0% (JWT middleware needed)
- 🔄 **Product Management**: 0%
- 🔄 **Order System**: 0%

## Technical Architecture Established

### Current Tech Stack:
- **Runtime**: Node.js với TypeScript strict mode
- **Framework**: Express.js 5.x
- **Database**: MongoDB Atlas với Mongoose ODM
- **Authentication**: 
  - API Key authentication với x-api-key header
  - JWT với crypto-generated symmetric keys (proper naming)
- **Password Security**: bcrypt hashing
- **Development**: nodemon + ts-node với path mapping
- **Type Safety**: Comprehensive TypeScript type system

### Project Structure:
```
src/
├── auth/
│   ├── authUtils.ts          # JWT token creation với proper naming
│   └── checkAuth.ts          # API key middleware
├── configs/env.config.ts      # Environment configuration  
├── controllers/access.controller.ts  # Shop authentication
├── dbs/init.mongodb.ts        # MongoDB connection
├── helpers/check.connect.ts   # Connection monitoring
├── models/
│   ├── shop.model.ts         # Shop schema
│   ├── keytoken.model.ts     # JWT key storage với comments
│   └── apikey.model.ts       # API key schema
├── routes/index.ts            # Main router với API key middleware
├── routes/accessRouter/index.ts  # Auth routes
├── services/
│   ├── access.services.ts    # Auth business logic với proper naming
│   ├── keyToken.service.ts   # Key management
│   └── apiKey.services.ts    # API key management
├── types/                     # TypeScript definitions
├── Utils/index.ts             # Utility functions
├── app.ts                     # Express configuration
└── server.ts                  # Application entry point
```

## Memory Bank Updates Completed
- Updated activeContext.md với symmetric keys naming improvements
- Documented API Key authentication system
- Tracked JWT key naming convention fixes
- Added authentication architecture documentation
- Updated status assessment với new completed features

## Team Notes
- ✅ **API Key System**: Fully working với permission-based access
- ✅ **Symmetric Keys**: Proper naming convention implemented
- ✅ **JWT Tokens**: accessTokenSecret/refreshTokenSecret clarity
- ✅ **Shop Registration**: Working với proper key generation
- 🔄 **Next Priority**: Shop login API implementation
- All TypeScript compilation errors resolved
- Development workflow fully functional
- Authentication foundation solid và ready for next phase 