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
    
    getCommonMap() : any {
        return {
            sessionId : this.sessionId,
            playerId : this.playerId
        };
    }

    getGameByPlayer(playerId:string) : Observable<any> {
        console.log("----> " + this.getCommonMap().sessionId);
        console.log("----> " + this.getCommonMap().playerId);
        return this._HttpClient.post(this._UrlService.getGetGameByPlayerUrl() + "/" +playerId, this.getCommonMap());
    }

    saveNewGame(playerId:string) : Observable<any> {
        return this._HttpClient.post(this._UrlService.getSaveNewGameUrl() + "/" +playerId, this.getCommonMap());
    }

    playTurn(playerId:string, cardReserve:any, cardAttribute:any) : Observable<any> {
        let turnMap = this.getCommonMap();
        turnMap['cardReserve'] = cardReserve;
        turnMap['cardAttribute'] = cardAttribute;
        return this._HttpClient.post(this._UrlService.getTurnUrl() + "/" +playerId, turnMap);
    }
}
