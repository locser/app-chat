export enum USER_STATUS {
  NOT_ACTIVE = 0, // Tạm ngưng (không dùng)
  ACTIVE = 1, // Đang hoạt động
  BLOCK = 2, // Đã bị Admin khoá
  REMOVE = 3, // User xoá tài khoản
  REQUEST_REMOVE = 4, // User yêu cầu xoá tài khoản
  USER_BLOCK = 5, // User khoá tài khoản
}
