import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { selectDataset, selectFeatures } from '../state-controllers/dataset-controller/selectors/dataset.selectors';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import { WekaMLActions } from '../state-controllers/weka-machine-learning-controller/actions';
import { getResultMetrics } from '../state-controllers/weka-machine-learning-controller/selectors/weka-ml.selectors';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopupComponent } from '../machine-learning/warning-popup/warning-popup.component';
import { SubSink } from 'subsink';

import { Chart } from 'chart.js/auto';

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
  // rocPlot: string | null = null;
  // prPlot: string | null = null;
  // cmPlot: string | null = null;

  dataset$ = this.datasetStore.select(selectDataset);
  features$ = this.datasetStore.select(selectFeatures);
  mlWekaStore$ = this.mlWekaStore.select(getResultMetrics);

  datasetId: any;
  datasetName: any;
  user_id = '6435575578b04a2b1549c17b';
  selectedAlgoName: any;
  results: any;
  splitDataset: boolean = false;
  algoParamsFormData: any;

  chart_radar: any;
  chart_bar: any;

  independentVariables: Variable[] = [];

  variables: any[] = [];
  allSelected: boolean = false;

  mainForm!: FormGroup;
  resultLogForm = new FormGroup({
    save_results: new FormControl(''),
    runName: new FormControl(''),
  });

  private subs = new SubSink();

  constructor(
    httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private mlWekaStore: Store,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.apiUrl = 'http://127.0.0.1:5000/';
    this.httpClient = httpClient;
  }

  ngOnInit(){
    this.mainForm = this.formBuilder.group({
      dataset_id: ['', Validators.required],
      user_id: [this.user_id, Validators.required],
      algo_type: ['', Validators.required],
      algo_name: ['', Validators.required],
      split_variable: ['',],
      target_variable: ['', Validators.required],
      independent_variables: ['',],
    });

    this.subs.sink = this.mlWekaStore$.subscribe((results) => {
      console.log(results);
      
      if(results.hasOwnProperty('error')){
        this.openWarningDialog(results.error)
      }

      this.results = results.data;

      if (this.results[0].importance_values) {
        setTimeout(() => {
          const type = 'radar'
          const values = []
          const variables = this.results[0].independent_variables
          if (this.results.length > 1) {
            for (const result of this.results){
              values.push(
                {
                  data: result.importance_values,
                  label: result.split_value
                }
                )
            }
          }
          else if (this.results.length == 1) {
            values.push(
              {
                data: this.results[0].importance_values,
                label: 'region results'
              }
              )
          }

          this.displayData(values, variables, type);
        }, 2000);
        // this.displayData()
      } 

      if (this.mainForm!.get('algo_type')?.value == 'regr')
      {
        setTimeout(() => {
          const type = 'bar'
          const values = []
          let variables: any[] = []
          if (this.results.length > 1) {
            for (const result of this.results){
              variables.push(result.split_value)
            }
          }
          else if (this.results.length == 1) {
            // Jia Hao can help push the state name into 
            variables.push('metrics')
          }

          values.push(
            {
              label: 'mae',
              data: this.results.map((row: { mae: any; }) => row.mae)
            },
            {
              label: 'mse',
              data: this.results.map((row: { mse: any; }) => row.mse)
            },
            {
              label: 'rmse',
              data: this.results.map((row: { rmse: any; }) => row.rmse)
            },
            {
              label: 'mean absolute percentage',
              data: this.results.map((row: { mean_absolute_percentage: any; }) => row.mean_absolute_percentage)
            },
            {
              label: 'max error',
              data: this.results.map((row: { max_error: any; }) => row.max_error)
            },
            {
              label: 'r2 score',
              data: this.results.map((row: { r2_score: any; }) => row.r2_score)
            })
  
            this.displayData(values, variables, type)
        }, 2000);
      }

      else if (this.mainForm!.get('algo_type')?.value == 'cls') {
        setTimeout(() => {
          const type = 'bar'
          const values = []
          let variables: any[] = []
          if (this.results.length > 1) {
            for (const result of this.results){
              variables.push(result.split_value)
            }
          }
          else if (this.results.length == 1) {
            // Jia Hao can help push the state name into 
            variables.push('metrics')
          }

          values.push(
            {
              label: 'Accuracy',
              data: this.results.map((row: { accuracy: any; }) => row.accuracy)
            },
            {
              label: 'AUC-ROC',
              data: this.results.map((row: { auc: any; }) => row.auc)
            },
            {
              label: 'F1-score',
              data: this.results.map((row: { f1: any; }) => row.f1)
            },
            {
              label: 'Precision score',
              data: this.results.map((row: { precision: any; }) => row.precision)
            },
            {
              label: 'Recall score',
              data: this.results.map((row: { recall: any; }) => row.recall)
            },
            {
              label: 'Specificity',
              data: this.results.map((row: { specificity: any; }) => row.specificity)
            })
  
            this.displayData(values, variables, type)
        }, 2000);
      }


      // this.rocPlot = this.decodeAndDisplayImage(this.results.roc_plot);
      // this.prPlot = this.decodeAndDisplayImage(this.results.pr_plot);
      // this.cmPlot = this.decodeAndDisplayImage(this.results.cm_plot);

    });

    this.subs.sink = this.dataset$.subscribe((data) => {
      console.log(data)
      this.datasetId = data._id;
      this.mainForm.patchValue({dataset_id: data._id})
      this.datasetName = data.name;
      this.variables = data.attributes;
    });

    this.subs.sink = this.features$.subscribe((results) => {
      if (results != null && results.length != 0) {
        this.mainForm.patchValue({target_variable: results[0]})
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
    if (this.chart_bar != null) {
      this.chart_bar.destroy()
    }
    if (this.chart_radar != null) {
      this.chart_radar.destroy()
    }
    const selectedIndependentVariables = this.independentVariables
      .filter((variable) => variable.selected == true)
      .map((variable) => variable.name);

    const request_params = {
      DATASET_ID: this.mainForm.controls['dataset_id'].value,
      user_id: this.mainForm.controls['user_id'].value,
      algo_type: this.mainForm.controls['algo_type'].value,
      algo_name: this.mainForm.controls['algo_name'].value,
      split_variable: this.splitDataset ? this.mainForm.controls['split_variable'].value: null,
      target_variable: this.mainForm.controls['target_variable'].value,
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

  onSelectAlgo(displayValue: string, algoId:string, algoType:string){
    this.mainForm.patchValue({algo_type: algoType})
    this.mainForm.patchValue({algo_name: algoId})
    this.selectedAlgoName = displayValue

    this.algoParamsFormData = null;

    this.results = null;
  }

  onToggleSplit($event: any){
    if (!$event.checked){
      this.mainForm.patchValue({split_variable: null})
    }
    this.onSelectSplitVar()
  }

  onSelectSplitVar(){
    this.independentVariables = []
    this.variables
      .filter((a) => ![this.mainForm.get("target_variable")?.value, this.mainForm.get("split_variable")?.value].includes(a))
      .forEach((variable: any) => {
        this.independentVariables.push({
          name: variable,
          selected: false,
        });
      });
  }

  isSplitVarDisabled(variable: string){
    return this.mainForm.get("target_variable")?.value == variable;
  }

  onSelectTarget() {
    this.independentVariables = []
    this.variables
      .filter((a) => ![this.mainForm.get("target_variable")?.value, this.mainForm.get("split_variable")?.value].includes(a))
      .forEach((variable: any) => {
        this.independentVariables.push({
          name: variable,
          selected: false,
        });
      });
  }

  isTargetVarDisabled(variable: string){
    return this.mainForm.get("split_variable")?.value == variable;
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

  decodeAndDisplayImage(encodedImage: string): string {
    const decodedImage = atob(encodedImage);
    const buffer = new Uint8Array(decodedImage.length);
    for (let i = 0; i < decodedImage.length; i++) {
      buffer[i] = decodedImage.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  openWarningDialog(messaage: string): void {
    const dialogRef = this.dialog.open(WarningPopupComponent, {
      width: '500px',
      data: {
        title: 'Error',
        message: messaage,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('close');
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public displayData(values: any[], variables: any[], type: string){

    if (type == 'radar') {
      if (this.chart_radar != null) {
        this.chart_radar.destroy()
      }
      this.plotRadarGraph(values, variables)
    }
    else if (type == 'bar') {
      if (this.chart_bar != null) {
        this.chart_bar.destroy()
      }
      this.plotBarGraph(values, variables)
    }
    
  }

  public plotRadarGraph(values: any[], variables: any[]) {    
    const data = {
      labels: variables,
      datasets: [{data: 0}]
    }

    data.datasets = values
  
    this.chart_radar = new Chart('importance', {
      type: 'radar',
      options: {
        plugins: {
            title: {
                display: true,
                text: 'Feature Importance'
            }
        }
    },
      data: data
    })

  }

  public plotBarGraph(values: any[], variables: any[]) {
    const data = {
      labels: variables,
      datasets: [{data: 0}]
    }

    data.datasets = values
  
    this.chart_bar = new Chart('regr_metrics', {
      type: 'bar',
      options: {
        plugins: {
            title: {
                display: true,
                text: 'Metrics Obtained on Test Set'
            }
        }
    },
      data: data
    })

  }

}

