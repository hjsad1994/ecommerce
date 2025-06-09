# Project Brief - E-commerce Backend NodeJS

## Tổng quan dự án
Dự án ecommerce backend được xây dựng với Node.js, Express và TypeScript. Đây là một RESTful API backend phục vụ cho ứng dụng thương mại điện tử.

## Mục tiêu chính
1. Xây dựng backend API hoàn chỉnh cho hệ thống ecommerce
2. Sử dụng TypeScript để đảm bảo type safety và code quality
3. Thiết kế architecture scalable và maintainable
4. Implement các tính năng core: User management, Product catalog, Order processing

## Yêu cầu kỹ thuật
- **Runtime**: Node.js >= 16
- **Language**: TypeScript với strict mode
- **Framework**: Express.js
- **Database**: MongoDB (sẽ được tích hợp)
- **Authentication**: JWT (sẽ được implement)
- **Validation**: Express validator hoặc Joi
- **Documentation**: API documentation với Swagger

## Cấu trúc core
```
src/
├── controllers/     # Route handlers
├── middleware/      # Express middleware
├── models/         # Database models
├── services/       # Business logic
├── types/          # TypeScript definitions
├── utils/          # Helper functions
├── app.ts          # Express configuration
└── server.ts       # Entry point
```

## Features cần implement
1. **User Management**
   - Registration/Login
   - Profile management
   - Role-based access (admin/customer)

2. **Product Management**
   - CRUD operations
   - Category management
   - Search và filtering
   - Image upload

3. **Order Management**
   - Shopping cart
   - Order processing
   - Payment integration
   - Order tracking

4. **Admin Features**
   - Dashboard
   - User management
   - Product management
   - Order management

## Standards và Conventions
- RESTful API design
- Consistent error handling
- Type-safe code với TypeScript
- Clean code principles
- Git conventional commits
- API response format chuẩn hóa 