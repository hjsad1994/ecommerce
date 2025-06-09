# System Patterns - E-commerce Backend

## Architecture Overview
Dự án sử dụng **Layered Architecture** với separation of concerns:

```
┌─────────────────┐
│   Controllers   │  ← HTTP request handling
├─────────────────┤
│    Services     │  ← Business logic
├─────────────────┤  
│     Models      │  ← Data layer
├─────────────────┤
│   Database      │  ← MongoDB storage
└─────────────────┘
```

## Design Patterns Implemented

### 1. MVC Pattern
- **Models**: Database schemas và data operations
- **Controllers**: Route handlers, HTTP request/response
- **Services**: Business logic layer (View được frontend handle)

### 2. Middleware Pattern
- **Error Handling**: Global error middleware
- **Authentication**: JWT verification middleware (sẽ implement)
- **Validation**: Request validation middleware (sẽ implement)
- **Logging**: Morgan HTTP request logging

### 3. Factory Pattern
- **Error Factory**: `AppError` class cho consistent error creation
- **Response Factory**: Standardized `ApiResponse` format

### 4. Dependency Injection
- Service layer separation để easy testing và maintainability

## Key Components

### Error Handling System
```typescript
// Custom error class
class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

// Global error handler
errorHandler(err, req, res, next) => {
    // Centralized error processing
}

// Async wrapper
asyncHandler(fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}
```

### Type System
```typescript
// Interfaces for core entities
interface User { id, email, role, ... }
interface Product { id, name, price, ... }
interface Order { id, userId, items, ... }

// API response standardization
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
```

## Folder Structure Pattern
```
src/
├── controllers/     # Route handlers
│   ├── userController.ts
│   ├── productController.ts
│   └── orderController.ts
├── services/        # Business logic
│   ├── userService.ts
│   ├── productService.ts
│   └── orderService.ts
├── models/          # Database models
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
├── middleware/      # Express middleware
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── utils/          # Helper functions
│   ├── asyncHandler.ts
│   └── helpers.ts
├── types/          # TypeScript definitions
│   └── index.ts
├── configs/        # Configuration files
│   └── database.ts
├── app.ts          # Express setup
└── server.ts       # Entry point
```

## Security Patterns
1. **Input Validation**: Validate tất cả user inputs
2. **Authentication**: JWT-based stateless auth
3. **Authorization**: Role-based access control
4. **Error Sanitization**: Hide sensitive info trong production
5. **Rate Limiting**: Prevent abuse (sẽ implement)

## Data Flow Pattern
```
Request → Middleware → Controller → Service → Model → Database
                                     ↓
Response ← Middleware ← Controller ← Service ← Model ← Database
```

## Configuration Pattern
- Environment-based configuration
- Separate configs cho dev/prod/test
- Type-safe configuration với TypeScript

## Testing Patterns (Planned)
- **Unit Tests**: Service layer testing
- **Integration Tests**: API endpoint testing
- **Mocking**: Database và external service mocks
- **Test Data**: Factory pattern cho test data generation

## Performance Patterns
- **Async/Await**: Non-blocking operations
- **Database Indexing**: Optimize queries
- **Caching**: Redis caching layer (future)
- **Pagination**: Large dataset handling 