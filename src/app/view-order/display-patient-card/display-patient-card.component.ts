import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-patient-card',
  templateUrl: './display-patient-card.component.html',
  styleUrls: ['./display-patient-card.component.css']
})
export class DisplayPatientCardComponent implements OnInit {

  @Input() patData: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
