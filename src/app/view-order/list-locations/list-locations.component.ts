import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-locations',
  templateUrl: './list-locations.component.html',
  styleUrls: ['./list-locations.component.css']
})
export class ListLocationsComponent implements OnInit {

  @Input() locArray: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
