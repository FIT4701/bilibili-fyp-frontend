import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map } from 'rxjs';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import { selectDataset } from '../state-controllers/dataset-controller/selectors/dataset.selectors';
import { Store } from '@ngrx/store';
import { PreprocssingService } from 'src/app/services/preprocessing-services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

export interface Variable {
  name: string;
  selected: boolean;
  
}
@Component({
  selector: 'app-preprocessing',
  templateUrl: './preprocessing.component.html',
  styleUrls: ['./preprocessing.component.css'],
})
export class PreprocessingComponent implements OnInit{
  apiUrl: string;
  httpClient: HttpClient;
  
  selectedPreprocessingMethodId: any;
  datasetId: any;

  variables: Variable[] = [];
  allVariablesSelected: boolean = true;

  mainForm!: FormGroup;
  independentVariables: Variable[] = [];
  private gridApi!: GridApi;
  columnApi: any;
  
  // Data that gets displayed in the grid
  public rowData: any;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private preprocessingService: PreprocssingService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
    ) {
      this.apiUrl = 'http://127.0.0.1:5000/'
      this.httpClient = httpClient;
  }

  preprocessingMethods = [
    {id: "mean imputation", name: "Mean Imputation"}, 
    {id: "median imputation", name: "Median Imputation"}, 
    {id: "standardization", name: "Standardization"},
    {id: "normalization", name: "Normalization"},
    // {id: "label encoding", name: "Label Encoding"},
    {id: "outlier", name: "Outliers Removal"},
    {id: "split dataset", name:"Split Dataset"}
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
        if (["DATASET_ID", "_id"].includes(key)){
          continue
        }
        const columnDef: ColDef = {
          headerName: key,
          field: key,
        };
        if(!Number.isNaN(parseFloat(data[0][key]))){
          columnDef.valueParser = (params) => parseFloat(params.newValue);
          columnDef.valueFormatter = (params) => parseFloat(params.value).toFixed(4);
        }
        this.columnDefs.push(columnDef)
      }
      this.gridApi.setColumnDefs(this.columnDefs)
      this.rowData = data
    })
  }

  onSelectPreprocessingMethod(methodId: string) {
    this.selectedPreprocessingMethodId = methodId;
    this.cdr.detectChanges();
  }

  public getHttpHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
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

isSplitVarDisabled(variable: any){
  return this.mainForm.get("target_variable")?.value == variable;
}

  public runPreprocessing(){
    const variables: string[] = this.variables.filter(variable => variable.selected).map(variable => variable.name)
    this.preprocessingService.runPreprocessing(this.datasetId, this.selectedPreprocessingMethodId, null, variables)
      .subscribe((response) => {
        if (response.flag) {
          this.toaster.success('Preprocessing Completed')
          this.preprocessingService.getResponseData("6435575578b04a2b1549c17b", this.datasetId)
          .subscribe(response => {
            console.log(response)
            this.rowData = response.data
          })
        }
        else {
          this.toaster.error(
            response.error
          );
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
