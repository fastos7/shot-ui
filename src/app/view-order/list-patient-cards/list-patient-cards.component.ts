import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-patient-cards',
  templateUrl: './list-patient-cards.component.html',
  styleUrls: ['./list-patient-cards.component.css']
})
export class ListPatientCardsComponent implements OnInit {

  @Input() patList: any[] = [];
  @Input() dayOrWeek: string;

  constructor() { }

  ngOnInit() {
  }

}
