import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectDataset } from 'src/app/components/state-controllers/dataset-controller/selectors/dataset.selectors';
import { DatasetState } from 'src/app/components/state-controllers/dataset-controller/states';


@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {
  @Output() valueChange = new EventEmitter<any>()
  dataset_attributes: any;
  max_length: any;
  selected_model: any;
  estimatorParamsData = {};

  paramsForm = new FormGroup({
    k_best: new FormControl(5),
    selection_type: new FormControl('sfs'),
    target_attribute: new FormControl(''),
    estimator_type: new FormControl('lin_regr'),
    model: new FormControl(''),
  });

  constructor(
    private datasetStore: Store<DatasetState>,
  ) { 
    
  }

  ngOnInit(){
    this.datasetStore.select(selectDataset).subscribe((data) =>{
      this.dataset_attributes = data.attributes
      this.max_length = this.dataset_attributes.length - 1
      // console.log(this.dataset_attributes)
    })
    this.onChange()
    this.paramsForm.valueChanges.subscribe(() => {
      this.onChange()
    })
  }

    onEstimatorChange(){
      this.selected_model= this.paramsForm.get('estimator_type')?.getRawValue()
  }

  onParamsChange(newValue: any){
    this.estimatorParamsData = newValue
    this.onChange()
  }

  onChange(){
    const allParamData = {
      ...this.paramsForm.getRawValue(),
      estimator_params: this.estimatorParamsData
    }
    this.valueChange.emit(allParamData) 
  }
}
