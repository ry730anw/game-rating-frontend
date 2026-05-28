import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './component/game-component/game-component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Footer } from './component/footer/footer';
import { Header } from './component/header/header';
import { Rank } from './component/rank/rank';

@NgModule({
  declarations: [
    App,
    GameComponent,
    Footer,
    Header,
    Rank
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
    , provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
