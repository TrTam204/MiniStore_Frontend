# MiniStore Frontend

Frontend của hệ thống bán hàng MiniStore, được xây dựng bằng Angular và kết nối với ASP.NET Core Web API.

## Repository liên quan

- Frontend: `https://github.com/TrTam204/MiniStore_Frontend.git`
- Backend: `https://github.com/TrTam204/MiniStore_Backend.git`

Frontend cần được chạy cùng backend để có thể đăng nhập, lấy danh sách sản phẩm, đặt hàng, sử dụng voucher và thực hiện các chức năng quản trị.

## Công nghệ sử dụng

- Angular 18
- Angular Standalone Component
- TypeScript
- RxJS
- PrimeNG
- PrimeIcons
- PrimeNG Aura Theme
- Reactive Forms
- Angular Router
- HttpClient
- JWT Interceptor
- Route Guard
- Chart.js
- XLSX
- HTML
- CSS

## Chức năng chính

### Chức năng dành cho khách hàng

- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Tìm kiếm và lọc sản phẩm
- Xem sản phẩm liên quan
- Đăng ký tài khoản
- Đăng nhập
- Quên mật khẩu bằng OTP
- Xem và cập nhật thông tin cá nhân
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Áp dụng voucher
- Thanh toán bằng COD hoặc QR Pay mô phỏng
- Xem lịch sử đơn hàng
- Tải hóa đơn PDF
- Xem các voucher đang hoạt động

### Chức năng dành cho quản trị viên

- Xem dashboard và số liệu tổng quan
- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý thương hiệu
- Quản lý người dùng
- Quản lý đơn hàng
- Cập nhật trạng thái đơn hàng
- Quản lý voucher
- Xem báo cáo và thống kê

## Cấu trúc repository

```text
MiniStore_Frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── layout/
│   │   │   ├── admin-layout/
│   │   │   └── user-layout/
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── product-detail/
│   │   │   ├── payment/
│   │   │   ├── user-info/
│   │   │   ├── admin-dashboard/
│   │   │   ├── admin-orders/
│   │   │   ├── admin-users/
│   │   │   ├── admin-vouchers/
│   │   │   └── các trang quản lý khác
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── admin.guard.ts
│   │   │   ├── product.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── brand.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── voucher.service.ts
│   │   │   └── report.service.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Yêu cầu trước khi chạy

Máy tính cần cài đặt:

- Git
- Node.js
- npm

Project sử dụng Angular 18.2. Có thể sử dụng một trong các phiên bản Node.js tương thích:

- Node.js 18.19.1 trở lên trong nhánh 18
- Node.js 20.11.1 trở lên trong nhánh 20
- Node.js 22.x

Khuyến nghị sử dụng Node.js 22.

Kiểm tra phiên bản Node.js:

```bash
node --version
```

Kiểm tra phiên bản npm:

```bash
npm --version
```

Không bắt buộc phải cài Angular CLI toàn cục vì project đã có Angular CLI trong `devDependencies` và có thể chạy thông qua `npm start`.

## 1. Clone frontend

Mở PowerShell, Command Prompt hoặc Terminal:

```bash
git clone https://github.com/TrTam204/MiniStore_Frontend.git
```

Di chuyển vào thư mục project:

```bash
cd MiniStore_Frontend
```

Sau khi vào thư mục, cần thấy các file:

```text
package.json
package-lock.json
angular.json
```

Project Angular nằm ngay thư mục gốc repository, không cần di chuyển vào thư mục con khác.

## 2. Cài đặt package

Tại thư mục `MiniStore_Frontend`, chạy:

```bash
npm install
```

Lệnh này sẽ cài đặt các package cần thiết vào thư mục `node_modules`.

Chỉ cần chạy `npm install` trong lần thiết lập đầu tiên hoặc khi `package.json` thay đổi.

## 3. Khởi động backend

Frontend đang gọi API tại địa chỉ:

```text
http://localhost:5128
```

Vì vậy, trước khi sử dụng đầy đủ chức năng, cần chạy backend MiniStore.

Clone backend:

```bash
git clone https://github.com/TrTam204/MiniStore_Backend.git
```

Di chuyển vào thư mục chứa project backend:

```bash
cd MiniStore_Backend
cd MiniStore
```

Chạy backend:

```bash
dotnet run
```

Khi thành công, Terminal backend sẽ hiển thị:

```text
Now listening on: http://localhost:5128
Application started.
```

Swagger backend:

```text
http://localhost:5128/swagger
```

Giữ nguyên cửa sổ Terminal backend trong khi sử dụng frontend.

## 4. Chạy frontend

Mở một cửa sổ Terminal khác tại thư mục:

```text
MiniStore_Frontend
```

Sau đó chạy:

```bash
npm start
```

Lệnh `npm start` trong project tương ứng với:

```bash
ng serve
```

Có thể sử dụng lệnh sau nếu cần:

```bash
npx ng serve
```

Khi chạy thành công, Terminal sẽ hiển thị địa chỉ tương tự:

```text
Local: http://localhost:4200/
```

Mở trình duyệt và truy cập:

```text
http://localhost:4200
```

Trang đăng nhập:

```text
http://localhost:4200/login
```

## 5. Tài khoản quản trị

Tài khoản quản trị dùng để kiểm tra các chức năng Admin:

```text
Email:    admin@gmail.com
Mật khẩu: admin123
```

Sau khi đăng nhập thành công, có thể truy cập khu vực quản trị tại:

```text
http://localhost:4200/admin/dashboard
```

Khu vực quản trị bao gồm:

- Dashboard
- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý thương hiệu
- Quản lý người dùng
- Quản lý đơn hàng
- Quản lý voucher

> Tài khoản trên là tài khoản phục vụ chạy thử và học tập. Backend phải kết nối đúng database có tài khoản `admin@gmail.com`.

> Không nên sử dụng mật khẩu `admin123` khi triển khai dự án lên môi trường thật.

## 6. Thứ tự chạy toàn bộ hệ thống

Hệ thống gồm hai repository riêng biệt:

```text
MiniStore_Backend
MiniStore_Frontend
```

### Terminal 1 – Backend

```bash
cd MiniStore_Backend/MiniStore
dotnet run
```

Backend:

```text
http://localhost:5128
```

### Terminal 2 – Frontend

```bash
cd MiniStore_Frontend
npm install
npm start
```

Frontend:

```text
http://localhost:4200
```

Sau đó đăng nhập bằng:

```text
Email:    admin@gmail.com
Mật khẩu: admin123
```

## 7. Lệnh chạy nhanh frontend

```bash
git clone https://github.com/TrTam204/MiniStore_Frontend.git
cd MiniStore_Frontend
npm install
npm start
```

Truy cập:

```text
http://localhost:4200
```

## 8. Cấu hình địa chỉ backend

Hiện tại địa chỉ API được khai báo trực tiếp trong các service:

```text
http://localhost:5128/api
```

Ví dụ:

```typescript
private apiUrl = 'http://localhost:5128/api/Products';
```

Các service đang sử dụng địa chỉ backend này gồm:

```text
src/app/services/auth.service.ts
src/app/services/product.service.ts
src/app/services/category.service.ts
src/app/services/brand.service.ts
src/app/services/user.service.ts
src/app/services/order.service.ts
src/app/services/voucher.service.ts
src/app/services/report.service.ts
```

Nếu backend chạy ở cổng khác, cần tìm:

```text
http://localhost:5128
```

và đổi thành địa chỉ backend mới trong các file service.

Ví dụ backend chuyển sang cổng `7001`:

```typescript
private apiUrl = 'http://localhost:7001/api/Products';
```

## 9. Cơ chế đăng nhập

Khi đăng nhập thành công, backend trả về:

```text
userId
email
role
token
```

Frontend lưu các thông tin sau vào `localStorage`:

```text
currentUserId
currentUserEmail
role
token
```

JWT Interceptor tự động thêm token vào request:

```text
Authorization: Bearer <token>
```

Khu vực `/admin` chỉ cho phép người dùng có role:

```text
Admin
```

Nếu người dùng không có quyền Admin, hệ thống sẽ chuyển về trang chủ.

## 10. Build project

Để kiểm tra quá trình build:

```bash
npm run build
```

Sau khi build thành công, kết quả được tạo trong:

```text
dist/frontend
```

## 11. Chạy kiểm thử

```bash
npm test
```

## 12. Dừng frontend

Tại Terminal đang chạy frontend, nhấn:

```text
Ctrl + C
```

## 13. Một số lỗi thường gặp

### Lỗi `npm is not recognized`

Nguyên nhân là máy chưa cài Node.js hoặc Node.js chưa được thêm vào biến môi trường.

Kiểm tra:

```bash
node --version
npm --version
```

Nếu không nhận được phiên bản, cần cài lại Node.js rồi mở lại Terminal.

### Frontend mở được nhưng không có dữ liệu

Kiểm tra backend có đang chạy tại:

```text
http://localhost:5128
```

Mở Swagger để kiểm tra:

```text
http://localhost:5128/swagger
```

Nếu Swagger không mở được thì backend chưa chạy hoặc đang sử dụng cổng khác.

### Lỗi `ERR_CONNECTION_REFUSED`

Lỗi này thường xảy ra khi frontend gọi:

```text
http://localhost:5128
```

nhưng backend chưa được khởi động.

Cách khắc phục:

```bash
cd MiniStore_Backend/MiniStore
dotnet run
```

### Không đăng nhập được tài khoản Admin

Kiểm tra:

- Backend đã chạy chưa.
- Database đã được tạo chưa.
- Database có tài khoản `admin@gmail.com` chưa.
- Mật khẩu nhập đúng là `admin123` chưa.
- Giá trị role trong database có phải là `Admin` không.
- Frontend có gọi đúng `http://localhost:5128/api/Auth/login` không.

### Đăng nhập được nhưng không vào trang Admin

Xóa dữ liệu đăng nhập cũ trong trình duyệt rồi đăng nhập lại.

Có thể mở Developer Tools, chọn `Application` → `Local Storage` và kiểm tra:

```text
role = Admin
token = JWT token
```

Sau đó truy cập:

```text
http://localhost:4200/admin/dashboard
```

### Lỗi CORS

Kiểm tra:

- Frontend đang chạy tại `http://localhost:4200`.
- Backend đang chạy tại `http://localhost:5128`.
- Backend đã cấu hình CORS cho frontend.
- Không trộn lẫn `http` và `https` giữa hai project.

### Cổng 4200 đang được sử dụng

Kiểm tra tiến trình sử dụng cổng:

```powershell
netstat -ano | findstr :4200
```

Dừng tiến trình đang chiếm cổng hoặc chạy frontend bằng cổng khác:

```bash
npm start -- --port 4201
```

Nếu đổi cổng frontend, cần kiểm tra lại cấu hình CORS của backend.

### Package bị lỗi sau khi cập nhật

Xóa thư mục `node_modules` rồTam
Dự án MiniStore được thực hiện phục vụ quá trình học tập và thực tập lập trình Fullstack với Angular và ASP.NET Core Web API.
