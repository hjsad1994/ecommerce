# E-commerce Backend với Node.js và TypeScript

Đây là backend API cho ứng dụng thương mại điện tử được xây dựng với Node.js, Express và TypeScript.

## Yêu cầu hệ thống

- Node.js >= 16
- npm >= 8

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd ecommerce-backend-nodejs
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env:
```bash
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm run dev` - Chạy server development với nodemon
- `npm run dev:ts` - Chạy server development với ts-node
- `npm run build` - Build TypeScript thành JavaScript
- `npm start` - Chạy production server
- `npm run clean` - Xóa thư mục dist

## Cấu trúc dự án

```
src/
├── controllers/     # Controllers xử lý request
├── middleware/      # Middleware functions
├── models/         # Database models
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## TypeScript Configuration

Dự án sử dụng TypeScript với cấu hình strict mode để đảm bảo type safety. File `tsconfig.json` đã được cấu hình với:

- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps enabled
- Declaration files generated
- Path mapping (@/* -> src/*)

## Development

Để phát triển với TypeScript:

1. Chạy development server:
```bash
npm run dev
```

2. TypeScript sẽ tự động compile và restart server khi có thay đổi

3. Kiểm tra type errors:
```bash
npx tsc --noEmit
```

## Production

1. Build project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## API Response Format

Tất cả API responses sử dụng format chuẩn:

```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```

## Error Handling

- Custom AppError class cho error handling
- Global error middleware
- Async error handling với asyncHandler utility

## Types

Dự án sử dụng TypeScript interfaces cho:
- User
- Product  
- Order
- API Responses
- Và nhiều types khác trong `src/types/` 