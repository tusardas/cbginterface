import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {GameConsoleComponent} from "./game-console/game-console.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
    {path: "", redirectTo : "/login", pathMatch : "full"},
    {path: "login", component : LoginComponent},
    {path: "game-console", component : GameConsoleComponent},
    {path: "**", component : PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const rountingComponents = [
    LoginComponent,
    GameConsoleComponent,
    PageNotFoundComponent

];
