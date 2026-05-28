import { Component, OnInit } from '@angular/core';
import { GameRatingResponse } from '../../model/game.model';
import { HttpClient } from '@angular/common/http';
interface PlatformRanking {
  platformName: string;
  games: GameRatingResponse[];
}
@Component({
  selector: 'app-rank',
  standalone: false,
  templateUrl: './rank.html',
  styleUrl: './rank.css',
})
export class Rank implements OnInit {
  ps5Ranks: GameRatingResponse[] = [];
  pcRanks: GameRatingResponse[] = [];
  xboxRanks: GameRatingResponse[] = [];
  allPlatformRanks: PlatformRanking[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAllRankings();
  }

  loadAllRankings() {
    this.isLoading = true;
    // const baseUrl = 'http://localhost:8080/api/games';
 const baseUrl = 'http://172.29.144.1:8080/api/games';
    // 1. 先抓取所有平台名稱
    this.http.get<string[]>(`${baseUrl}/platforms`).subscribe({
      next: (platforms) => {
        let requestsCompleted = 0;
        const tempRanks: PlatformRanking[] = []; // 暫存結果的陣列

        if (platforms.length === 0) {
          this.isLoading = false;
          return;
        }

        // 2. 針對每一個平台，去抓取它的前 10 名
        platforms.forEach(plat => {
          this.http.get<GameRatingResponse[]>(`${baseUrl}/rank?platform=${plat}&limit=10`).subscribe({
            next: (games) => {
              // 💡 只有當該平台「真的有遊戲資料」時，才建立卡片，避免出現空蕩蕩的排行板
              if (games.length > 0) {
                tempRanks.push({ platformName: plat, games: games });
              }

              requestsCompleted++;

              // 💡 當所有 API 都請求完畢時，關閉 loading 並顯示畫面
              if (requestsCompleted === platforms.length) {
                // 依照平台名稱排序，確保每次畫面顯示順序一致，不會因為 API 回傳快慢而亂跳
                tempRanks.sort((a, b) => a.platformName.localeCompare(b.platformName));
                this.allPlatformRanks = tempRanks;
                this.isLoading = false;
              }
            },
            error: (err) => {
              requestsCompleted++;
              if (requestsCompleted === platforms.length) {
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: (err) => {
        console.error('無法取得平台列表', err);
        this.isLoading = false;
      }
    });
  }
  // 判斷前三名的獎牌樣式 (對應你的圖表設計)
  getMedalStyle(index: number): any {
    switch (index) {
      case 0: // 金牌
        return { borderLeft: '4px solid #eab308', background: 'rgba(234, 179, 8, 0.1)', color: '#facc15', fontWeight: 'bold' };
      case 1: // 銀牌
        return { borderLeft: '4px solid #94a3b8', background: 'rgba(148, 163, 184, 0.1)', color: '#cbd5e1' };
      case 2: // 銅牌
        return { borderLeft: '4px solid #d97706', background: 'rgba(217, 119, 6, 0.1)', color: '#f59e0b' };
      default: // 第四名以後
        return { borderLeft: '4px solid #334155', background: 'rgba(30, 41, 59, 0.4)', color: '#94a3b8' };
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
}
