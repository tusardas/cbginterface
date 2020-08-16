import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-console',
  templateUrl: './game-console.component.html',
  styleUrls: ['./game-console.component.css']
})
export class GameConsoleComponent implements OnInit {
    private playerId:string;
    
  constructor(private _GameService : GameService) { 

  }

    ngOnInit(): void {
        this.playerId = this._GameService.getPlayerId();
        this.checkIfGameExists();
    }

    checkIfGameExists() : void{ 
        this._GameService.getGameByPlayer(this.playerId)
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            );
    }


}
