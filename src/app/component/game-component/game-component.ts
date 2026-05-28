import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GameRatingResponse, PageResponse } from '../../model/game.model';
@Component({
  selector: 'app-game-component',
  standalone: false,
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent implements OnInit{
  keyword: string = '';
  selectedPlatform: string = ''; // 💡 新增：用來綁定下拉選單的變數 (預設為空，代表所有平台)
  isLoading: boolean = false;
  hasSearched: boolean = false;
  games: GameRatingResponse[] = [];
  groupedGames: any[] = []; // 💡 新增：用來存放「分組後」的遊戲資料
  availablePlatforms: string[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 12;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.loadPlatforms();
  }

  searchGames(page: number = 1) {
    // 💡 拿掉空字串警告：讓使用者不輸入關鍵字時，可以撈出全部資料 (因為後端有處理了！)
    this.isLoading = true;
    this.hasSearched = true;
    this.currentPage = page;

    // 💡 我們的 Spring Boot Service 已經完美處理了從 1 開始的頁碼轉換
    // 所以這裡放心大膽地直接傳 1, 2, 3... 過去就好
    // const apiUrl = `http://localhost:8080/api/games?title=${this.keyword}&platform=${this.selectedPlatform}&page=${page}&size=${this.pageSize}`;
        const apiUrl = `http://172.29.144.1:8080/api/games?title=${this.keyword}&platform=${this.selectedPlatform}&page=${page}&size=${this.pageSize}`;

    this.http.get<PageResponse<GameRatingResponse>>(apiUrl).subscribe({
      next: (data) => {
        this.games = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.groupedGames = this.groupGames(this.games);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API 錯誤:', err);
        this.isLoading = false;
      }
    });
  }


  groupGames(games: GameRatingResponse[]) {
    const map = new Map<string, any>();

    games.forEach(g => {
      // 如果這款遊戲還沒被加入 map，就先建立它的主體結構
      if (!map.has(g.title)) {
        map.set(g.title, {
          title: g.title,
          genre: g.genre,
          developer: g.developer,
          releaseDate: g.releaseDate,
          summary: g.summary,
          ratings: [] // 準備一個陣列來放各平台評分
        });
      }

      // 把平台評分塞進該遊戲的 ratings 陣列中
      map.get(g.title).ratings.push({
        platformName: g.platformName,
        metascore: g.metascore,
        userScore: g.userScore,
        mediaReviewCount: g.mediaReviewCount,
        userReviewCount: g.userReviewCount
      });
    });

    // 把 Map 轉回 Array 回傳給 HTML 使用
    return Array.from(map.values());
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.searchGames(page);
    }
  }


  // 💡 參數型別明確化，對應後端傳來的 Integer / Float 以及可能為 null 的情況
  getScoreClass(score: number | null, isMeta: boolean): string {
    if (score === null || score === undefined) return '';

    if (isMeta) {
      if (score >= 80) return 'score-high';
      if (score >= 60) return 'score-mid';
      return 'score-low';
    } else {
      if (score >= 8.0) return 'score-high';
      if (score >= 6.0) return 'score-mid';
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

    return '👾';
  }

  loadPlatforms() {
    // this.http.get<string[]>('http://localhost:8080/api/games/platforms').subscribe({
        this.http.get<string[]>('http://172.29.144.1:8080/api/games/platforms').subscribe({

      next: (data) => {
        this.availablePlatforms = data;
      },
      error: (err) => {
        console.error('無法載入平台清單:', err);
      }
    });
  }

}
