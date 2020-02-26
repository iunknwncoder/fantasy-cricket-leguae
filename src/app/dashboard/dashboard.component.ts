import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import allTeamDetails from '../../assets/allPlayers.json';
// import playerDetails from '../../assets/players.json';
import ownerDetails from '../../assets/owners.json';
import captainetails from '../../assets/captains.json';
import { PlayersService } from '../players.service.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['myName', 'teamName', 'points'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  playerDetails = [];
  constructor(private playersService: PlayersService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(allTeamDetails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.playersService.players.subscribe(p => {
      this.playerDetails = p;
    })
  }

  calculatePoints(team) {
    let points = 0;

    // calculat owner points
    const owner = ownerDetails.find(p => p.name === team.owner.name);
    if (owner) {
      points = points + +owner.points;
    }

    // calculat captain points
    const captain = captainetails.find(p => p.name === team.captain.name);
    if (captain) {
      points = points + +captain.points;
    }

console.log(this.playerDetails);
    // calculat players points
    team.players.map(pl => {
      const player = this.playerDetails.find(p => p.name === pl.name);
      if (player) {
        points = points + +player.points
      }
    });

    return points;
  }
}
