import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

  private serverUrl:String = "http://localhost:8888";

  public getServerUrl() : String {
      return this.serverUrl;
  }

  public getValidateAuthUrl() : string {
      return this.serverUrl + "/validateAuth";
  }

  public getGetGameByPlayerUrl() : string {
    return this.serverUrl + "/getGameByPlayer";
  }

  public getSaveNewGameUrl() : string {
    return this.serverUrl + "/saveNewGame";
  }

  public getTurnUrl() : string {
    return this.serverUrl + "/turn";
  }
  
}
