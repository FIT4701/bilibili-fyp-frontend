import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cls-knn-params',
  templateUrl: './knn-params.component.html',
  styleUrls: ['./knn-params.component.css']
})
export class KnnParamsComponent {

  @Output() valueChange = new EventEmitter<any>()

  paramsForm = new FormGroup({
    radius: new FormControl(0.2),
    weights: new FormControl(''),
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
