import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { UrlService } from '../url.service';

@Component({
  selector: 'app-game-console',
  templateUrl: './game-console.component.html',
  styleUrls: ['./game-console.component.css']
})
export class GameConsoleComponent implements OnInit {
    public playerId:string;
    public game;
    public round;
    public turns;
    public cardReservesPlayable;
    public cardReservesJustWon;
    public fileUrl:string = "";
    public isGameLoaded:Boolean = false;
    public myCardReserve = undefined;

  constructor(private _GameService : GameService, private _UrlService:UrlService) { 
    if(!this._GameService.getPlayerId()) {
        this._GameService.setSessionId(localStorage.getItem("sessionId"));
        this._GameService.setPlayerId(localStorage.getItem("playerId"));
        this.playerId = this._GameService.getPlayerId();
    }
  }

    ngOnInit(): void {
        this.playerId = this._GameService.getPlayerId();
        this.checkIfGameExists();
        this.fileUrl = this._UrlService.getFileUrl();
    }

    checkIfGameExists() : void{ 
        this._GameService.getGameByPlayer(this.playerId)
            .subscribe(
                data => this.loadGame(data),
                error => console.log(error)
            );
    }

    playedTurnSuccess(responseData:any) : void {
        this.myCardReserve = undefined;
        this.loadGame(responseData);
    }

    loadGame(responseData:any) : void {
        let game = responseData.game;
        let round = responseData.round;
        //console.log("game -------> " + game.id);
        //console.log("round -------> " + round.id);
        if(game.id && round.id) {
            //console.log("inside ------>");
            this.game = game;
            this.round = round;
            this.turns = round.turns;

            let cardReserves = game.gamePlayers.find(gamePlayer => gamePlayer.player.id == this.playerId).cardReserves;
            this.cardReservesPlayable = this.filterCardReserves(cardReserves, 1);
            //console.log("useable -----> " + this.cardReservesPlayable);
            this.cardReservesJustWon = this.filterCardReserves(cardReserves, 2);
            //console.log("justWon -----> " + this.cardReservesJustWon);
            
            this.isGameLoaded = true;
        }
        //console.log("game -------> " + this.game.id);
    }

    filterCardReserves(cardReserves:any, reserveType:any) : any {
        var finalArray = [];
        for(let i=0 ; i<cardReserves.length; i++) {
            if(reserveType === cardReserves[i].reserveType){
                finalArray.push(cardReserves[i]);
            }
        }
        return finalArray;
    }

    saveNewGame() : void {
        this._GameService.saveNewGame(this.playerId)
        .subscribe(
            data => this.loadGame(data),
            error => console.log(error)
        );
    }

    playTurn() : void {
        if(this.game.gameStatus !=3 && this.round.nextPlayerId == this.playerId) {
            if(this.myCardReserve != undefined) {
                let myCardAttribute = this.myCardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "odi_runs");
                this._GameService.playTurn(this.playerId, this.myCardReserve, myCardAttribute)
                    .subscribe(
                        data => this.playedTurnSuccess(data),
                        error => console.log(error)
                    );
            }
            else {
                this.showError("Please select your card first!");
            }
        }
        else {
            this.showError("Please wait for your turn!");
        }
    }

    getFile(cardReserve:any) : string {
        //console.log("cardReserve ----> " + cardReserve);
        var fileName = cardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "file").attributeValue;
        //console.log("fileName ----> " + fileName);
        return fileName;
    }

    getFileByTurn(turn:any) {
        let cardReserveForTurn;
        let gamePlayers = this.game.gamePlayers;
        for(let i = 0; i<gamePlayers.length; i++) {
            let cardReserves = gamePlayers[i].cardReserves;
            console.log("cardReserves.length -------> " + cardReserves.length);
            
            cardReserveForTurn = cardReserves.find(cardReserve => cardReserve.card.id === turn.cardId);
            if(cardReserveForTurn != undefined) {
                break;
            }
            
        }
        console.log("cardReserveForTurn -------> " + cardReserveForTurn);
        return this.getFile(cardReserveForTurn);
    }

    selectCard(cardReserve:any) : string {
        if(this.game.gameStatus !=3 && this.round.nextPlayerId == this.playerId) {
            //console.log("cardReserve ----> " + cardReserve);
            var fileName = cardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "file").attributeValue;
            //console.log("fileName ----> " + fileName);
            this.myCardReserve = cardReserve;
            return fileName;
        }
        else {
            this.showError("Please wait for your turn!");
        }
    }

    showError(errorMsg:string) : void {
        alert(errorMsg);
    }

}
