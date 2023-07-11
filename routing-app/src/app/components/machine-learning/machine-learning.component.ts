import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { selectDataset, selectFeatures } from '../state-controllers/dataset-controller/selectors/dataset.selectors';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import { WekaMLActions } from '../state-controllers/weka-machine-learning-controller/actions';
import { getResultMetrics } from '../state-controllers/weka-machine-learning-controller/selectors/weka-ml.selectors';
import { set } from 'lodash';

export interface Variable {
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-machine-learning',
  templateUrl: './machine-learning.component.html',
  styleUrls: ['./machine-learning.component.css'],
})
export class MachineLearningComponent implements OnInit{
  apiUrl: string;
  httpClient: HttpClient;

  dataset$ = this.datasetStore.select(selectDataset);

  datasetId: any;
  user_id = '6435575578b04a2b1549c17b';
  selectedAlgoId: any;
  selectedAlgoName: any;
  results: any;
  algoParamsFormData: any;

  targetVariable: any;
  independentVariables: Variable[] = [];

  variables: any[] = [];
  allSelected: boolean = false;

  resultLogForm = new FormGroup({
    runName: new FormControl(''),
  });

  constructor(
    httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private mlWekaStore: Store
  ) {
    this.apiUrl = 'http://127.0.0.1:5000/';
    this.httpClient = httpClient;
  }

  ngOnInit(){
    this.mlWekaStore.select(getResultMetrics).subscribe((results) => {
      console.log(results);
      this.results = results.data;
    });

    this.dataset$.subscribe((data) => {
      this.datasetId = data._id;
    });

    this.dataset$.pipe(map((data) => data.attributes))
    .subscribe((variables) => {
      this.variables = variables;
    });

    this.datasetStore.select(selectFeatures).subscribe((results) => {
      if (results != null && results.length != 0) {
        this.targetVariable = results[0]
        // console.log(results)
        // console.log(this.variables)
        const set2 = new Set(results)
        const diff = this.variables.filter(v => !set2.delete(v));
        // console.log(diff)
        diff
        .forEach((variable: any) => {
          this.independentVariables.push({
            name: variable,
            selected: false,
          });
        });

        results
        .slice(1)
        .forEach((variable: any) => {
          this.independentVariables.push({
            name: variable,
            selected: true,
          });
        });

        
      }
    })
  }

  runAlgorithm() {
    const selectedIndependentVariables = this.independentVariables
      .filter((variable) => variable.selected == true)
      .map((variable) => variable.name);

    const request_params = {
      DATASET_ID: this.datasetId,
      user_id: this.user_id,
      algo_type: this.selectedAlgoId,
      target_variable: this.targetVariable,
      independent_variables: selectedIndependentVariables,
      algo_params: {...this.algoParamsFormData},
      result_logging: { ...this.resultLogForm.value },
    };
    
    console.log(request_params)

    this.mlWekaStore.dispatch(
      WekaMLActions.wekaMLAlgoInit({
        request_params: request_params,
      })
    );
  }

  onSelectAlgo(displayValue: string, algoId:string){
    this.selectedAlgoId = algoId
    this.selectedAlgoName = displayValue

    this.algoParamsFormData = null;

    this.results = null;
  }

  onSelectTarget() {
    this.independentVariables = []
    this.variables
      .filter((a) => a != this.targetVariable)
      .forEach((variable: any) => {
        this.independentVariables.push({
          name: variable,
          selected: false,
        });
      });
  }

  updateAllSelected() {
    this.allSelected = this.independentVariables.every((a) => a.selected);
  }

  someSelected(): boolean {
    return (
      this.independentVariables.filter((a) => a.selected).length > 0 && !this.allSelected
    );
  }

  setAll(selected: boolean) {
    this.allSelected = selected;
    this.independentVariables.forEach((a) => (a.selected = selected));
  }

  onParamsChange(newValue: any){
    this.algoParamsFormData = newValue
    console.log(this.algoParamsFormData)
  }
}

