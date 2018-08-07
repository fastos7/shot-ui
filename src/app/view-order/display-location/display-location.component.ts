import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-location',
  templateUrl: './display-location.component.html',
  styleUrls: ['./display-location.component.css']
})
export class DisplayLocationComponent implements OnInit {

  @Input() locData: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
