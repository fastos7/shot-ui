import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pool-patient-button-group',
  templateUrl: './pool-patient-button-group.component.html',
  styleUrls: ['./pool-patient-button-group.component.scss']
})
export class PoolPatientButtonGroupComponent implements OnInit {

  @Input("value") value:string = "Pool";

  @Output("valueChange") valueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  OnClick() {
    this.valueChange.emit(this.value);    
  }

}
