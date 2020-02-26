import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import playerDetails from '../../assets/players.json';

@Component({
  selector: 'app-scorer',
  templateUrl: './scorer.component.html',
  styleUrls: ['./scorer.component.css']
})
export class ScorerComponent implements OnInit {
  playersData: any;
  constructor(private playersService: PlayersService) {
    this.playersService.updatePlayerScore(playerDetails);
  }
  battingTeam = '';
  bowlingTeam = '';
  teams = ['Hotshots', 'Daredevils', 'The Assassinators', 'TNT', 'Ninjas', 'Simeio Spirits', 'Roaring Lions', 'Skarp Elva']
  player1 = {
    'name': '',
    'batting': {
      'runs': 0,
      'fours': 0,
      'sixes': 0,
      'twentyfive': 0,
      'fifties': 0
    }
  }

  player2 = {
    'name': '',
    'batting': {
      'runs': 0,
      'fours': 0,
      'sixes': 0,
      'twentyfive': 0,
      'fifties': 0
    }
  }

  player3 = {
    'name': '',
    'bowling': {
      'wickets': 0,
      'wickets3': 0,
      'wickets5': 0,
      'wickets7': 0
    },
    'fielding': {
      'catches': 0,
      'stumping': 0
    }
  }

  player4 = {
    'name': '',
    'fielding': {
      'catches': 0,
      'stumping': 0
    }
  }
  ngOnInit() {
    this.playersService.players.subscribe(p => {
      this.playersData = p;
    })
  }

  getBattingTeamPlayers() {
    return this.playersData.filter(p => p.team === this.battingTeam);
  }

  getBowlingTeamPlayers() {
    return this.playersData.find(p => p.team === this.bowlingTeam);
  }

  updateBattingPoints(player) {
    this.playersData.map(p => {
      if (p.name === player.name) {
        p.points = p.points + (player.batting.runs * 0.5 + player.batting.fours * 0.5 + player.batting.sixes * 1 + player.batting.twentyfive * 4 + player.batting.fifties * 8)
      }
    })
    this.playersService.updatePlayerScore(this.playersData);
  }

  updateBowlingPoints(player) { }

  updateFieldingPoints(player) { }
}
