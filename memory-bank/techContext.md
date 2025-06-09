# Technical Context - E-commerce Backend

## Tech Stack
### Core Technologies
- **Runtime**: Node.js 16+
- **Language**: TypeScript 5.8+ (strict mode enabled)
- **Framework**: Express.js 5.1+
- **Database**: MongoDB (sẽ tích hợp với Mongoose)
- **Authentication**: JWT tokens
- **Validation**: Express validator

### Development Tools
- **Build Tool**: TypeScript Compiler (tsc)
- **Dev Server**: ts-node + nodemon
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier (sẽ setup)
- **Testing**: Jest, Supertest (sẽ setup)

### Dependencies hiện tại
```json
{
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.2",
    "@types/morgan": "^1.9.9", 
    "@types/node": "^22.15.29",
    "morgan": "^1.10.0",
    "nodemon": "^3.1.10",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
}
```

## TypeScript Configuration
### tsconfig.json highlights:
- Target: ES2020
- Module: CommonJS  
- Strict mode: enabled
- Source maps: enabled
- Declaration files: generated
- Path mapping: `@/*` -> `src/*`
- Output directory: `./dist`

### Development Setup
1. **Dev Scripts**:
   - `npm run dev`: nodemon với ts-node
   - `npm run dev:ts`: direct ts-node execution
   - `npm run build`: TypeScript compilation
   - `npm start`: production server từ dist/

2. **File Structure**:
```
src/
├── types/index.ts           # TypeScript interfaces
├── middleware/errorHandler.ts # Error handling
├── utils/asyncHandler.ts    # Async wrapper
├── app.ts                   # Express config
└── server.ts                # Entry point
```

## Environment Setup
- **Development**: ts-node + nodemon auto-reload
- **Production**: Compiled JavaScript từ dist/
- **Port**: 5000 (configurable via PORT env)
- **Node Environment**: Từ NODE_ENV

## API Design Patterns
### Response Format
```typescript
interface ApiResponse<T = any> {
    success: boolean;
    message: string; 
    data?: T;
    error?: string;
}
```

### Error Handling
- Custom `AppError` class
- Global error middleware
- Async error catching với `asyncHandler`
- Type-safe error responses

## Next Technical Steps
1. Database integration (MongoDB + Mongoose)
2. Authentication system (JWT)
3. Validation middleware
4. Testing setup (Jest)
5. API documentation (Swagger)
6. Deployment configuration 