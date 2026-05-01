import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GameRatingResponse, PageResponse } from '../../app/model/game.model';
@Component({
  selector: 'app-game-component',
  standalone: false,
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent {
  // 綁定搜尋輸入框的變數
  keyword: string = '';
  // 控制載入中動畫的變數
  isLoading: boolean = false;
  // 判斷是否已經搜尋過
  hasSearched: boolean = false;
  // 存放搜尋結果的陣列
  games: GameRatingResponse[] = [];
  currentPage: number = 1;  // UI 顯示從第 1 頁開始
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 12;    // 每頁顯示幾筆
  constructor(private http: HttpClient) { }
  // 搜尋功能
  searchGames(page: number = 1) {
    if (!this.keyword.trim()) {
      alert('請輸入遊戲名稱進行查詢！');
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.currentPage = page; // 更新目前頁碼

    // 💡 注意：後端 Spring Data 的 Page 是從 0 開始，所以 API 參數要帶 page-1
    const apiUrl = `http://localhost:8080/api/games?title=${this.keyword}&page=${page}&size=${this.pageSize}`;

    this.http.get<PageResponse<GameRatingResponse>>(apiUrl).subscribe({
      next: (data) => {
        this.games = data.content;
        this.totalPages = data.totalPages;     // 從後端接住總頁數
        this.totalElements = data.totalElements; // 從後端接住總筆數
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API 錯誤:', err);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.searchGames(page);
    }
  }
  // 判斷分數顏色的邏輯
  getScoreClass(score: any, isMeta: boolean): string {
    if (!score || score === 'N/A') return '';
    const num = parseFloat(score);
    if (isMeta) {
      if (num >= 80) return 'score-high';
      if (num >= 60) return 'score-mid';
      return 'score-low';
    } else {
      if (num >= 8.0) return 'score-high';
      if (num >= 6.0) return 'score-mid';
      return 'score-low';
    }
  }


  getPlatformIcon(platformName: string): string {
    if (!platformName) return '👾';
    const name = platformName.toLowerCase();

    if (name.includes('playstation') || name.includes('ps')) return '🎮';
    if (name.includes('xbox')) return '❎';
    if (name.includes('switch') || name.includes('nintendo') || name.includes('wii') || name.includes('ds') || name.includes('gamecube')) return '🕹️';
    if (name.includes('pc') || name.includes('windows')) return '💻';
    if (name.includes('mac') || name.includes('ios')) return '🍎';
    if (name.includes('dreamcast') || name.includes('sega')) return '🌀';

    return '👾'; // 預設圖示
  }
}
