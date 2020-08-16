import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';
import {GameService} from '../game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  constructor(private _LoginService : LoginService, 
                private _GameService : GameService,
                private _Router : Router) { 

  }

  private errMsg:String;
  public messageClasses = {
      "error" : this.errMsg != ''
  }
  private email:String;
  private password:String;

  ngOnInit(): void {
  }

  public validateAuth() : void {
    var params = {
        email : this.email,
        password : this.password
    }
    this._LoginService.validateAuth(params)
        .subscribe(
            data => this.validateAuthHandler(data),
            error => console.log(error)
        );
  }

  public validateAuthHandler(data:any):void {
      if(data.status == "ok") {
          //redirect
        this._GameService.setSessionId(data.sessionId);
        this._GameService.setPlayerId(data.playerId);
        this._Router.navigate(["/game-console"]);
        
      }
      else {
          this.errMsg = data.errMsg;
      }
  }

}
