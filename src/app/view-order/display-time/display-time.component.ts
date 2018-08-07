import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-time',
  templateUrl: './display-time.component.html',
  styleUrls: ['./display-time.component.css']
})
export class DisplayTimeComponent implements OnInit {

  @Input() timeData: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
