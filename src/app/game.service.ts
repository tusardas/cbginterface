import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UrlService} from './url.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    
    private sessionId:string;
    private playerId:string;

    setSessionId(sessionId:string) : void {
        this.sessionId = sessionId;
    }

    getSessionId() : string {
        return this.sessionId;
    }

    setPlayerId(playerId:string) : void {
        this.playerId = playerId;
    }

    getPlayerId() : string {
        return this.playerId;
    }

    constructor(private _HttpClient : HttpClient, private _UrlService:UrlService) { 

    }

    getGameByPlayer(playerId:string) : Observable<any> {
        return this._HttpClient.get(this._UrlService.getGetGameByPlayerUrl() + "/" +playerId);
    }

    saveNewGame(playerId:string) : Observable<any> {
        return this._HttpClient.post(this._UrlService.getSaveNewGameUrl() + "/" +playerId, {});
    }

    playTurn(playerId:string) : Observable<any> {
        return this._HttpClient.post(this._UrlService.getTurnUrl() + "/" +playerId, {});
    }
}
