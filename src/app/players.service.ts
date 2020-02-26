import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor() { }

  playerService: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly players: Observable<any> = this.playerService.asObservable();

  updatePlayerScore(playerDetails) {
    this.playerService.next(playerDetails);
  }
}
