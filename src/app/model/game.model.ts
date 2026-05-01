// 這是單筆遊戲評分的格式，要跟後端的 GameRatingResponse DTO 完全對應
export interface GameRatingResponse {
  title: string;
  platformName: string;
  metascore: number; // 後端是 BigDecimal，前端用 number 接收即可
  userScore: number;
}

// 這是 Spring Data Page 的包裝格式
export interface PageResponse<T> {
  content: T[];           // 真正的資料陣列在這邊
  totalPages: number;     // 總頁數
  totalElements: number;  // 總筆數
  size: number;           // 每頁幾筆
  number: number;         // 當前頁碼 (0 開始)
  // 你可以根據需要增加其他 Page 屬性，例如 last: boolean 等
}
