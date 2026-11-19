# Sanyo Vision Board API - FE Integration

Tài liệu này mô tả các endpoint hiện có để frontend map API.

## Base URL

Local:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

API local cần PostgreSQL và Redis đang chạy. FE phải gửi cookie cho các
request admin.

## Authentication

Admin và Staff dùng chung endpoint login:

```text
POST /admin/auth/login
```

Frontend phải bật credentials:

```ts
await fetch(`${API_URL}/admin/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    password,
  }),
})
```

API lưu JWT trong HttpOnly cookie:

```text
sanyo_admin_access_token
```

Không đọc token bằng JavaScript. Các request admin sau đó vẫn cần:

```ts
credentials: 'include'
```

## Roles

```text
admin
staff
```

Quyền hiện tại:

| Chức năng | Admin | Staff |
| --- | --- | --- |
| Login | Có | Có |
| Xem session hiện tại | Có | Có |
| Xem danh sách staff | Có | Không |
| Tạo staff | Có | Không |
| Cập nhật staff | Có | Không |
| Xóa staff | Có | Không |

## Response account

```json
{
  "id": "uuid",
  "email": "staff@example.com",
  "role": "staff",
  "isActive": true,
  "createdBy": "uuid",
  "lastLoginAt": null,
  "createdAt": "2026-11-16T10:00:00Z",
  "updatedAt": "2026-11-16T10:00:00Z"
}
```

Không có field password trong response.

## POST /admin/auth/login

Dùng cho cả Admin và Staff.

Request:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response `200`:

```json
{
  "admin": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdBy": null,
    "lastLoginAt": "2026-11-16T10:00:00Z",
    "createdAt": "2026-11-16T09:00:00Z",
    "updatedAt": "2026-11-16T10:00:00Z"
  }
}
```

Field `admin` là tên response hiện tại, nhưng có thể chứa account có role
`staff`.

## POST /admin/auth/logout

```ts
await fetch(`${API_URL}/admin/auth/logout`, {
  method: 'POST',
  credentials: 'include',
})
```

Response `200`:

```json
{
  "message": "Đã đăng xuất."
}
```

## GET /admin/auth/me

Kiểm tra session hiện tại và lấy account đang đăng nhập.

```ts
await fetch(`${API_URL}/admin/auth/me`, {
  credentials: 'include',
})
```

Response có cùng format với login:

```json
{
  "admin": {
    "id": "uuid",
    "email": "staff@example.com",
    "role": "staff",
    "isActive": true,
    "createdBy": "uuid",
    "lastLoginAt": "2026-11-16T10:00:00Z",
    "createdAt": "2026-11-16T09:00:00Z",
    "updatedAt": "2026-11-16T10:00:00Z"
  }
}
```

FE có thể dùng `admin.role` để quyết định hiển thị menu quản lý staff.

## POST /admin/staff

Chỉ Admin được gọi.

Request:

```json
{
  "email": "staff@example.com",
  "password": "strong-password",
  "confirmPassword": "strong-password"
}
```

Rules:

```text
email: email hợp lệ
password: tối thiểu 8 ký tự
confirmPassword: phải giống password
role: backend tự đặt là staff
```

Response `201` là account vừa tạo.

## GET /admin/staff

Chỉ Admin được gọi.

Có thể kết hợp các bộ lọc với cursor:

```text
GET /admin/staff?pageSize=20&search=sanyo&role=staff&isActive=true
```

Query params:

```text
search: tìm theo email
role: admin | staff
isActive: true | false
pageSize: 1..100
cursor: cursor trả về từ request trước
```

Request đầu tiên:

```text
GET /admin/staff?pageSize=20
```

Request tiếp theo dùng `nextCursor`:

```text
GET /admin/staff?pageSize=20&cursor=<nextCursor>
```

Response:

```json
{
  "items": [
    {
      "id": "uuid",
      "email": "staff@example.com",
      "role": "staff",
      "isActive": true,
      "createdBy": "uuid",
      "lastLoginAt": null,
      "createdAt": "2026-11-16T10:00:00Z",
      "updatedAt": "2026-11-16T10:00:00Z"
    }
  ],
  "nextCursor": "opaque-cursor-or-null",
  "hasMore": true,
  "pageSize": 20
}
```

FE không cần decode hoặc tự tạo cursor. Chỉ lưu và gửi lại nguyên giá trị
`nextCursor`.

## GET /admin/staff/{staffId}

Chỉ Admin được gọi.

```text
GET /admin/staff/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

Response `200` là một account object.

## PATCH /admin/staff/{staffId}

Chỉ Admin được gọi. Có thể cập nhật email, nâng quyền và soft delete.

### Nâng Staff lên Admin

```json
{
  "role": "admin"
}
```

### Cập nhật email

```json
{
  "email": "new-staff@example.com"
}
```

### Soft delete / vô hiệu hóa

```json
{
  "isActive": false
}
```

Soft delete không xóa record khỏi database. Account bị vô hiệu hóa sẽ không
login được.

Response `200` là account sau cập nhật.

## GET /admin/stats

Admin và Staff đều được xem thống kê tổng quan CMS.

```text
GET /admin/stats
```

Response `200`:

```json
{
  "adminCount": 1,
  "staffCount": 2,
  "activeCount": 2,
  "inactiveCount": 1
}
```

## DELETE /admin/staff/{staffId}

Chỉ Admin được gọi. Đây là hard delete và bắt buộc FE gửi lại email để xác nhận.

Request:

```ts
await fetch(`${API_URL}/admin/staff/${staffId}`, {
  method: 'DELETE',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: typedEmail,
  }),
})
```

Body:

```json
{
  "email": "staff@example.com"
}
```

Response thành công:

```text
204 No Content
```

Nếu email xác nhận không khớp:

```text
400 BAD_REQUEST
```

## Error contract

Tất cả lỗi API có format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ.",
    "details": [
      {
        "field": "email",
        "message": "value is not a valid email address"
      }
    ]
  }
}
```

Các mã FE cần xử lý:

| Status | Code | Ý nghĩa |
| --- | --- | --- |
| 400 | `BAD_REQUEST` | Request không hợp lệ hoặc email xác nhận sai |
| 401 | `UNAUTHENTICATED` | Chưa login hoặc session hết hạn |
| 403 | `FORBIDDEN` | Đã login nhưng không đủ quyền |
| 404 | `NOT_FOUND` | Không tìm thấy account |
| 409 | `CONFLICT` | Email trùng hoặc vi phạm rule account |
| 422 | `VALIDATION_ERROR` | Sai format/body |
| 429 | `RATE_LIMITED` | Vượt rate limit |
| 503 | `SERVICE_UNAVAILABLE` | Dependency backend đang unavailable |

## Rate limit login

```text
5 lần / 60 giây / IP
```

Khi nhận `429`, FE không retry liên tục. Có thể đọc header:

```text
Retry-After
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

## Chưa triển khai

Các endpoint sau chưa có trong API hiện tại:

```text
CMS content endpoints
Player endpoints
Image pool endpoints
```
