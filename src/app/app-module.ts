import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { GameComponent } from '../component/game-component/game-component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Footer } from '../component/footer/footer';

@NgModule({
  declarations: [
    App,
    GameComponent,
    Footer
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
