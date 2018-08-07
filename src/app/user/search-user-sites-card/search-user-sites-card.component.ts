import { Component, OnInit, Input } from '@angular/core';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-search-user-sites-card',
  templateUrl: './search-user-sites-card.component.html',
  styleUrls: ['./search-user-sites-card.component.scss']
})
export class SearchUserSitesCardComponent implements OnInit {

  @Input() userSites: UserAuthorities[] = [];

  private dataSource: MatTableDataSource<UserAuthorities>;

  displayedColumns: string[] = ['Sites', 'Roles', 'Bill To'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<UserAuthorities>(this.userSites);
  }

}
