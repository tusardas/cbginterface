import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-console',
  templateUrl: './game-console.component.html',
  styleUrls: ['./game-console.component.css']
})
export class GameConsoleComponent implements OnInit {
    public playerId:string;
    public game;
    public cardReserves;
    public gameStatus;
    public isGameLoaded:Boolean = false;
    public nextPlayerId;

    public isMyCardReserveSelected:Boolean = false;
    public myCardReserve;

    public isHisCardReserveSelected:Boolean = false;
    public hisCardReserve;

  constructor(private _GameService : GameService) { 

  }

    ngOnInit(): void {
        this.playerId = this._GameService.getPlayerId();
        this.checkIfGameExists();
    }

    checkIfGameExists() : void{ 
        this._GameService.getGameByPlayer(this.playerId)
            .subscribe(
                data => this.loadGame(data),
                error => console.log(error)
            );
    }

    loadGame(game:any) : void {
        console.log("here -------> " + game.id);
        if(game.id) {
            console.log("inside ------>");
            this.game = game;
            this.cardReserves = game.gamePlayers.find(gamePlayer => gamePlayer.player.id == this.playerId).cardReserves;
            this.gameStatus = game.gameState.gameStatus;
            this.nextPlayerId = game.gameState.nextPlayerId;
            this.isGameLoaded = true;
        }
        console.log("game -------> " + this.game.id);
    }

    saveNewGame() : void {
        this._GameService.saveNewGame(this.playerId)
            .subscribe(
                data => this.loadGame(data),
                error => console.log(error)
            );
    }

    playTurn() : void {
        if(this.gameStatus !=3 && this.nextPlayerId == this.playerId) {
            if(this.myCardReserve != undefined) {
                let myCardAttribute = this.myCardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "odi_runs");
                this._GameService.playTurn(this.playerId, this.myCardReserve, myCardAttribute)
                    .subscribe(
                        data => this.loadGame(data),
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
        console.log("cardReserve ----> " + cardReserve);
        var fileName = cardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "file").attributeValue;
        console.log("fileName ----> " + fileName);
        return fileName;
    }

    selectCard(cardReserve:any) : string {
        if(this.gameStatus !=3 && this.nextPlayerId == this.playerId) {
            console.log("cardReserve ----> " + cardReserve);
            var fileName = cardReserve.card.cardAttributes.find(cardAttribute => cardAttribute.attributeKey === "file").attributeValue;
            console.log("fileName ----> " + fileName);
            this.myCardReserve = cardReserve;
            this.isMyCardReserveSelected = true;
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
