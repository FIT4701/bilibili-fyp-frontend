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
    n_neighbors: new FormControl(5)
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
