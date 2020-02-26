import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import allTeams from '../../assets/allPlayers.json';
// import playerDetails from '../../assets/players.json';
import ownerDetails from '../../assets/owners.json';
import captainetails from '../../assets/captains.json';
import { PlayersService } from '../players.service.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

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
  allTeamDetails = [];

  constructor(private playersService: PlayersService) { }

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs

    this.allTeamDetails = allTeams
    this.dataSource = new MatTableDataSource<any>(this.allTeamDetails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.playersService.players.subscribe(p => {
      this.playerDetails = p;
    })

    this.calculatePoints();
  }

  calculatePoints() {
    this.allTeamDetails.map(team => {
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

      // calculat players points
      team.players.map(pl => {
        const player = this.playerDetails.find(p => p.name === pl.name);
        if (player) {
          points = points + +player.points
        }
      });

      team.points = points;
    })

    this.sortArray();

    this.dataSource = new MatTableDataSource<any>(this.allTeamDetails);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortArray() {
    this.allTeamDetails.sort(function (a, b) {
      const x = a.points;
      const y = b.points;

      if (x === y) {
        return 0;
      }
      if (typeof x === typeof y) {
        return x > y ? -1 : 1;
      }
      return typeof x < typeof y ? -1 : 1;
    });
  }

  downloadFileTop10() {
    const top10Teams = this.allTeamDetails.slice(0, 10);
    pdfMake.createPdf(this.getDocumentDefinition(top10Teams)).open();
  }

  downloadFile() {
    pdfMake.createPdf(this.getDocumentDefinition(this.allTeamDetails)).open();
  }

  getDocumentDefinition(teamDetails) {
    const nameArr = [];
    const teamNameArr = [];
    const ponitsArr = [];

    teamDetails.map(team => {
      nameArr.push({
        text: team.myName,
        fontSize: 12,
        alignment: 'center'
      })

      teamNameArr.push({
        text: team.teamName,
        fontSize: 12,
        alignment: 'center'
      })

      ponitsArr.push({
        text: team.points,
        fontSize: 12,
        alignment: 'center'
      })
    })

    return {
      content: [
        {
          text: 'Simeio Cricket Fantasy League Report',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            [{
              text: 'Name',
              bold: true,
              fontSize: 12,
              alignment: 'center',
              margin: [0, 0, 0, 10]
            },
              nameArr
            ],
            [{
              text: 'Team Name',
              bold: true,
              fontSize: 12,
              alignment: 'center',
              margin: [0, 0, 0, 10]
            },
              teamNameArr
            ],
            [{
              text: 'Points',
              bold: true,
              fontSize: 12,
              alignment: 'center',
              margin: [0, 0, 0, 10]
            },
              ponitsArr
            ]
          ]
        }]
    };
  }
}
