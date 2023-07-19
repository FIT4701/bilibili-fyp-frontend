import { Component } from '@angular/core';
import { PreprocssingService } from 'src/app/services/preprocessing-services';
import { DatasetState } from '../../state-controllers/dataset-controller/states';
import { Store } from '@ngrx/store';
import { selectDataset } from '../../state-controllers/dataset-controller/selectors/dataset.selectors';
import { Chart } from 'chart.js/auto';
import { DatasetActions } from '../../state-controllers/dataset-controller/actions';

@Component({
  selector: 'app-feature-selection',
  templateUrl: './feature-selection.component.html',
  styleUrls: ['./feature-selection.component.css']
})
export class FeatureSelectionComponent {

  // selectedPreprocessingMethodId: any;
  datasetId: any;

  selectedAlgoId: any;
  selectedAlgoName: any;
  algoParamsFormData: any;

  selectionData: any;

  chart: any;

  displaySave = false;

  constructor(
    private datasetStore: Store<DatasetState>,
    private preprocessingService: PreprocssingService
    ) {
  }

  // preprocessingMethods = [
  //   {id: "feature selection", name: "Feature Selection"},
  // ]

  dataset$ = this.datasetStore.select(selectDataset);
  sink = this.dataset$.subscribe((data) =>{
    this.datasetId = data._id
  })

  onSelectAlgo(displayValue: string, algoId:string){
    this.selectedAlgoId = algoId
    this.selectedAlgoName = displayValue
    this.algoParamsFormData = null;
  }

  onParamsChange(newValue: any){
    this.algoParamsFormData = newValue
    console.log(this.algoParamsFormData)
  }

  sortScore(data: any) {
    let i, key, j; 
    for (i = 1; i < data.length; i++)
    { 
        key = [data[i][0], data[i][1]]; 
        j = i - 1; 

        while (j >= 0 && data[j][1] < key[1])
        { 
            data[j + 1] = data[j]; 
            j = j - 1; 
        } 
        data[j + 1] = key; 
    }
    return data
  }

  runPreprocessing() {
    // console.log(typeof(this.algoParamsFormData))
    this.preprocessingService.runPreprocessing(this.datasetId, this.selectedAlgoId, this.algoParamsFormData).subscribe(response => {
      if(response.flag) {
        this.selectionData = response.body
        this.displayData(this.sortScore(this.selectionData))
        this.displaySave = true
        // console.log(data)
      }
    })
  }

  public displayData(data: any[]){
    if (this.chart != null) {
      this.chart.destroy()
    }
    this.plotGraph(data)
  }

  public plotGraph(selected_data: any[]) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: selected_data.map(row => row[0]),
        datasets:[
          {
            label:'ranking score',
            data: selected_data.map(row => row[1])
          }
        ]
        }
    })
  }

  public saveSelectionData() {
    const data = []
    data.push(this.algoParamsFormData.target_attribute)
    for (let i = 0; i < this.selectionData.length; i++) {
      data.push(this.selectionData[i][0])
    }
    console.log(data)
    this.datasetStore.dispatch(DatasetActions.loadSelectedFeatureInit({ data: data }))
  }

}
