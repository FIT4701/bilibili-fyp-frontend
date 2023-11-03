import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cls-random-forest-params',
  templateUrl: './random-forest-params.component.html',
  styleUrls: ['./random-forest-params.component.css']
})
export class RandomForestParamsComponent {
  @Output() valueChange = new EventEmitter<any>()

  paramsForm = new FormGroup({
    max_depth: new FormControl(),
    random_state: new FormControl(0),
  });

  constructor() { }

  ngOnInit(){
    this.onChange()
    this.paramsForm.valueChanges.subscribe(() => {
      this.onChange()
    })
  }

  onChange(){
    this.valueChange.emit(this.paramsForm.getRawValue()) 
  }
}
