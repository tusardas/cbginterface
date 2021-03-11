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
    public myCardAttribute = undefined;
    public displayName = undefined;
    public displayCountry = undefined;
    public displayStats = undefined;
    public winnerPlayerName = undefined;
    public showNewGameLink = false;

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
        this.myCardAttribute = undefined;
        this.displayName = undefined;
        this.displayCountry = undefined;
        this.displayStats = undefined;

        this.hideSelectStatModal();
        this.loadGame(responseData);
    }

    loadGame(responseData:any) : void {
        if(responseData != null) {
            let game = responseData.game;
            let round = responseData.round;
            this.game = game;
            
            console.log("game -------> " + game.id);
            //console.log("round -------> " + round.id);
            if(game.id && game.gameState.gameStatus === 3) {
                this.myCardAttribute = undefined;
                let winnerPlayerId = game.winnerPlayerId;
                this.winnerPlayerName = game.gamePlayers.find(gamePlayerTemp => gamePlayerTemp.player.id == winnerPlayerId).player.displayName;
                this.showNewGameLink = true;
                this.isGameLoaded = true;
            }
            else if(game.id && round.id) {
                //console.log("inside ------>");
                this.round = round;
                this.turns = round.turns;
                let cardReserves = game.gamePlayers.find(gamePlayer => gamePlayer.player.id == this.playerId).cardReserves;
                this.cardReservesPlayable = this.filterCardReserves(cardReserves, 1);
                //console.log("useable -----> " + this.cardReservesPlayable);
                this.cardReservesJustWon = this.filterCardReserves(cardReserves, 2);
                //console.log("justWon -----> " + this.cardReservesJustWon);
                
                if(this.round.attributeKey !== null) {
                    this.myCardAttribute = this.round.attributeKey;
                }
                else {
                    this.myCardAttribute = undefined;
                }
                this.winnerPlayerName = undefined;
                this.isGameLoaded = true;
            }
        }
        else {
            this.showNewGameLink = true;
        }
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
                if(this.myCardAttribute != undefined) {
                    let selectedCardAttribute = this.myCardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === this.myCardAttribute);
                    this._GameService.playTurn(this.playerId, this.myCardReserve, selectedCardAttribute)
                        .subscribe(
                            data => this.playedTurnSuccess(data),
                            error => console.log(error)
                        );
                }
                else {
                    this.showError("Please select a stat");
                }
            }
            else {
                this.showError("Please select a card");
            }
        }
        else {
            this.showError("Please wait for your turn");
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
            let fileName = undefined;
            this.myCardReserve = cardReserve;
            this.displayStats = new Array();
            let gameFormat = this.game.gameSettings.gameFormat.toLowerCase();
            cardReserve.card.cardAttributes.forEach(cardAttribute => {
                let attributeKey = cardAttribute.attributeKey;
                let attributeValue = cardAttribute.attributeValue;
                if(attributeKey == "file") {
                    fileName = attributeValue;
                }
                else if(attributeKey == "name") {
                    this.displayName = attributeValue;
                }
                else if(attributeKey == "country") {
                    this.displayCountry = attributeValue;
                }
                else if(attributeKey.indexOf(gameFormat) === 0) {
                    let isSelected = this.round.attributeKey == attributeKey
                    this.displayStats.push({
                        "attributeKey" : attributeKey,
                        "attributeKeyDisplay" : attributeKey,
                        "attributeValue" : attributeValue,
                        "isSelected" : isSelected
                    });
                }
            });
            return fileName;
        }
        else {
            this.showError("Please wait for your turn!");
        }
    }

    showError(errorMsg:string) : void {
        alert(errorMsg);
    }

    showSelectStatModal() {
        if(this.game.gameStatus !=3 && this.round.nextPlayerId == this.playerId) {
            if(this.myCardReserve != undefined) {
                var modal = document.getElementById("selectStateModal");
                modal.style.display = "block";
            }
            else {
                this.showError("Please select your card first!");
            }
        }
        else {
            this.showError("Please wait for your turn!");
        }
    }

    hideSelectStatModal() {
        var modal = document.getElementById("selectStateModal");
        modal.style.display = "none";

    }

    selectAttribute(event, attributeKey) {
        let attributeKeyForRound = this.round.attributeKey;
        if(attributeKeyForRound === null) {
            this.myCardAttribute = attributeKey;
        }
        else{
            this.showError("State for this round locked to: " + attributeKeyForRound);
            return false;
        }        
    }

}
