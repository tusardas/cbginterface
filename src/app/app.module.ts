import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule, rountingComponents} from './app-routing.module';
import { AppComponent } from './app.component';

import {LoginService} from './login.service';
import {GameService} from './game.service';
import {UrlService} from './url.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    rountingComponents,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [LoginService, GameService, UrlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
