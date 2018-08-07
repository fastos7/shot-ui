import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-times',
  templateUrl: './list-times.component.html',
  styleUrls: ['./list-times.component.css']
})
export class ListTimesComponent implements OnInit {

  @Input() timesArray: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
