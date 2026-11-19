# Frontend Implementation Guidelines

Tài liệu này là quy ước bắt buộc cho mọi feature mới và mọi thay đổi feature
trong Sanyo Vision Board FE.

## Quy tắc bắt buộc trước khi code

Mỗi lần triển khai phải đọc tài liệu này trước khi chỉnh sửa source code.

Mọi feature phải đi theo flow:

```text
type → service → hooks / store → feature
```

Không viết UI gọi Axios trực tiếp. Không để business logic chính trong
component.

## Flow triển khai chuẩn

### 1. Type

Khai báo request, response, entity và các type dùng chung trước.

Vị trí:

```text
src/types/
```

Quy ước:

- Type API dùng camelCase theo response mà frontend nhận được.
- Không khai báo lại cùng một entity trong nhiều component.
- Error type dùng contract chung trong `src/types/api.types.ts`.
- Type của feature có thể đặt trong thư mục feature nếu không dùng bên ngoài.
- Type dùng nhiều feature phải đặt tại `src/types/`.

### 2. Service

Service chịu trách nhiệm gọi API và map request/response cần thiết.

Vị trí:

```text
src/services/
```

Quy ước:

- Service chỉ sử dụng `apiClient` dùng chung.
- Endpoint phải lấy từ `src/config/endpoints.config.ts`.
- Service không render UI.
- Service không gọi toast.
- Service không tự redirect.
- Service không chứa state của component.
- Một service trả về dữ liệu đã được type đầy đủ.

Ví dụ flow:

```text
feature → hook → service → apiClient → backend
```

### 3. Hooks và state

#### Server state

Dùng TanStack Query cho dữ liệu từ API:

```text
src/hooks/
```

Hook chịu trách nhiệm:

- `useQuery` cho đọc dữ liệu.
- `useMutation` cho create/update/delete/login/logout.
- Quản lý loading, error và success state ở mức dữ liệu.
- Invalidate hoặc cập nhật query cache sau mutation.
- Dùng query key từ `src/lib/query/query-keys.ts`.

Không gọi service trực tiếp trong component nếu request cần cache, retry,
invalidate hoặc đồng bộ giữa nhiều màn hình.

#### Client state

Dùng Zustand khi state cần tồn tại giữa nhiều component hoặc nhiều bước UI.

Vị trí:

```text
src/stores/
```

Chỉ dùng Zustand cho client state như:

- Session display state.
- Sidebar state.
- Form flow nhiều bước.
- UI preference.

Không dùng Zustand thay cho server cache của TanStack Query.

Không lưu access token vào localStorage hoặc sessionStorage. Auth token của
admin/staff nằm trong HttpOnly cookie do backend quản lý.

### 4. Feature

Feature là nơi kết hợp hook, state và component để tạo use case hoàn chỉnh.

Mỗi feature phải có cấu trúc:

```text
src/features/<feature-name>/
├── components/
│   ├── <feature-component>.tsx
│   └── ...
├── index.tsx
├── hooks/                 # chỉ khi hook thực sự đặc thù feature
├── schemas/               # validation form nếu có
└── types.ts               # type chỉ dùng trong feature nếu cần
```

`index.tsx` là entry point của feature. Route hoặc page chỉ import feature từ
entry point này, không đi sâu vào component nội bộ.

Ví dụ:

```tsx
import { AdminFeature } from '@/features/admin'
```

## Motion trong feature container

Khi một feature render nhiều trạng thái trong cùng một container (ví dụ danh
sách, form và confirm card), `feature/index.tsx` phải quản lý state chuyển đổi
và bọc phần nội dung bằng một wrapper có `key` theo trạng thái hiện tại. Motion
dùng chung được khai báo trong `src/app/globals.css`; không đặt animation riêng
lặp lại trong từng card.

```tsx
<div key={view} className="feature-panel-motion">
  {renderCurrentView()}
</div>
```

Mỗi motion phải có fallback cho `prefers-reduced-motion: reduce`.

## Quy tắc component

## Quy tắc UI và styling

Khi triển khai UI:

- Không hard-code style trực tiếp trong component nếu style có thể dùng lại.
- Không tạo style inline để thay thế cho class CSS dùng chung.
- Style phải được triển khai thông qua `src/app/globals.css` và các class
  hoặc token CSS đã được chuẩn hóa.
- Tái sử dụng layout, spacing, màu sắc, typography, animation và responsive
  rule đã có trước khi tạo mới.
- Ưu tiên mở rộng class hoặc token global hiện có thay vì tạo một biến thể
  cục bộ trong feature.
- Không tự ý đưa thêm thư viện UI, thư viện styling hoặc hệ thống design token
  mới.

## Quy tắc tái sử dụng

Trước khi tạo mới bất kỳ component, hook, utility, style hoặc asset nào:

1. Rà lại code hiện tại để tìm implementation có thể tái sử dụng.
2. Nếu có, dùng lại hoặc mở rộng implementation đó.
3. Chỉ tạo mới khi code hiện tại thực sự không đáp ứng được yêu cầu.
4. Phải hỏi và được xác nhận trước khi tạo mới một phần dùng chung hoặc một
   pattern mới.

Việc tạo component đặc thù trong đúng feature vẫn được thực hiện khi cần,
nhưng không được nhân bản component dùng chung đã tồn tại.

### Component dùng chung

Component có khả năng tái sử dụng giữa nhiều feature đặt tại:

```text
src/components/common/
```

Ví dụ:

- Page header.
- Empty state.
- Error state.
- Loading state.
- Confirm dialog wrapper.
- Data table wrapper.

### Component UI nền tảng

Component primitive hoặc component UI nền tảng đặt tại:

```text
src/components/ui/
```

Ví dụ:

- Button.
- Input.
- Dialog.
- Table.
- Select.
- Badge.

### Component trong feature

Component nằm trong feature khi nó chứa logic hoặc UI đặc thù cho feature đó:

```text
src/features/admin/components/
src/features/journey/home/components/
```

Feature component được phép:

- Import component từ `src/components/ui`.
- Import component từ `src/components/common`.
- Dùng hook của feature hoặc hook dùng chung.
- Kết hợp nhiều primitive thành UI nghiệp vụ.

Feature component không nên:

- Gọi Axios trực tiếp.
- Khai báo lại API endpoint.
- Lặp lại component UI đã có.
- Chứa logic server state phức tạp.

## Quy tắc import

Ưu tiên import theo hướng:

```text
feature
  → hooks / stores
  → services
  → lib / config / types
```

Không tạo import vòng giữa các feature.

Không import component nội bộ của feature khác. Nếu cần dùng chung, đưa
component đó về `src/components/common`.

## Quy tắc route và page

Page trong `src/app/` chỉ chịu trách nhiệm:

- Định nghĩa route.
- Đặt layout phù hợp.
- Render entry point của feature.

Page không chứa:

- API call trực tiếp.
- Business logic dài.
- Form logic lớn.
- Query mutation logic.

## Checklist trước khi hoàn thành feature

## CMS theme tokens

Mọi UI trong CMS phải dùng token theme thay vì hard-code font hoặc màu glass:

- Glass chính: `--cms-glass-*` và `--cms-glass-tint`.
- Card nằm trên glass: `--cms-overlay-color`.
- Typography: `--cms-text-display`, `--cms-text-title`, `--cms-text-heading`,
  `--cms-text-subheading`, `--cms-text-body-lg`, `--cms-text-body`,
  `--cms-text-label`, `--cms-text-caption`.
- Font chung: `--cms-font-family` và `--cms-text-weight`.

Các token được cấu hình tại `/admin/settings`, lưu qua `CmsThemeProvider` và
được áp dụng cho toàn bộ vùng CMS. Khi tạo component mới, không tạo bộ màu
hoặc cỡ chữ riêng nếu có thể dùng các token trên.

- [ ] Đã đọc file này trước khi code.
- [ ] Đã khai báo type request/response.
- [ ] Đã thêm endpoint vào endpoint config.
- [ ] Đã tạo service dùng `apiClient`.
- [ ] Đã tạo hook TanStack Query cho server state.
- [ ] Đã dùng Zustand nếu có client state dùng chung.
- [ ] Đã tách feature thành `components/` và `index.tsx`.
- [ ] Component feature chỉ kết hợp UI chung và logic feature.
- [ ] Không lưu JWT ở localStorage/sessionStorage.
- [ ] Đã xử lý loading, empty, error và success state.
- [ ] Đã chạy `pnpm build` sau khi thay đổi.

## Thứ tự review code

Khi review một feature, kiểm tra theo thứ tự:

```text
types
→ endpoints
→ services
→ hooks / stores
→ feature components
→ feature index
→ page / route
```

Nếu một feature bỏ qua tầng hoặc đặt sai trách nhiệm, cần chỉnh lại kiến trúc
trước khi mở rộng thêm code.
