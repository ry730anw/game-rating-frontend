import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './component/game-component/game-component';
import { Rank } from './component/rank/rank';

const routes: Routes = [
  { path: 'search', component: GameComponent },
  { path: 'rank', component: Rank },
  { path: '', redirectTo: '/search', pathMatch: 'full' } // 預設進到查詢頁
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
