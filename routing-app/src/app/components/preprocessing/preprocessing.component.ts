import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map } from 'rxjs';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import { selectDataset } from '../state-controllers/dataset-controller/selectors/dataset.selectors';
import { Store } from '@ngrx/store';
import { PreprocssingService } from 'src/app/services/preprocessing-services';

export interface Variable {
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-preprocessing',
  templateUrl: './preprocessing.component.html',
  styleUrls: ['./preprocessing.component.css']
})
export class PreprocessingComponent implements OnInit{
  apiUrl: string;
  httpClient: HttpClient;
  
  selectedPreprocessingMethodId: any;
  datasetId: any;

  variables: Variable[] = [];
  allVariablesSelected: boolean = true;

  private gridApi!: GridApi;
  columnApi: any;
  
  // Data that gets displayed in the grid
  public rowData: any;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private preprocessingService: PreprocssingService
    ) {
      this.apiUrl = 'http://127.0.0.1:5000/'
      this.httpClient = httpClient;
  }

  preprocessingMethods = [
    {id: "mean imputation", name: "Mean Imputation"}, 
    {id: "median imputation", name: "Median Imputation"}, 
    {id: "standardization", name: "Standardization"},
    {id: "normalization", name: "Normalization"},
    {id: "label encoding", name: "Label Encoding"},
  ]

  dataset$ = this.datasetStore.select(selectDataset);
  
  columnDefs: ColDef[] = [
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  ngOnInit(): void {
    this.dataset$.subscribe((data) =>{
      this.datasetId = data._id
    })

    this.dataset$.pipe(map((data) => data.attributes))
    .subscribe((variables) => {
      this.variables = [];
      variables.forEach((variable: any) => {
        this.variables.push({name: variable, selected: true})
      });
    });
  }

  // Example load data from server
  onGridReady(params: GridReadyEvent) {    
    this.gridApi! = params.api;
    this.columnApi = params.columnApi;

    const request_body = {
      user_id: "6435575578b04a2b1549c17b",
      DATASET_ID: this.datasetId
    }

    this.preprocessingService.getResponseData("6435575578b04a2b1549c17b", this.datasetId)
    .subscribe( response => {
      console.log(response)
      const data = response.data
      for (const key in data[0]){
        this.columnDefs.push({
          headerName: key,
          field: key
        })
      }
      this.gridApi.setColumnDefs(this.columnDefs)
      this.rowData = data
    })
  }

  public getHttpHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
}

  public runPreprocessing(){
    const variables: string[] = this.variables.filter(variable => variable.selected).map(variable => variable.name)
    this.preprocessingService.runPreprocessing(this.datasetId, this.selectedPreprocessingMethodId, null, variables)
      .subscribe((response) => {
        if (response.flag) {
          this.preprocessingService.getResponseData("6435575578b04a2b1549c17b", this.datasetId)
          .subscribe(response => {
            console.log(response)
            const data = response.data
            // for (const key in data[0]){
            //   this.columnDefs.push({
            //     headerName: key,
            //     field: key
            //   })
            // }
            // this.gridApi.setColumnDefs(this.columnDefs)
            this.rowData = data
          })
        }
      })
  }

  updateAllSelected() {
    this.allVariablesSelected = this.variables.every((a) => a.selected);
  }

  someSelected(): boolean {
    return (
      this.variables.filter((a) => a.selected).length > 0 && !this.allVariablesSelected
    );
  }

  setAll(selected: boolean) {
    this.allVariablesSelected = selected;
    this.variables.forEach((a) => (a.selected = selected));
  }

}
