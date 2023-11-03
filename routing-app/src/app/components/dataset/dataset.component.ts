import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Observable, delay, map } from 'rxjs';
import { TestConnectionState } from 'src/app/test-connection/store/states';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import { DatasetActions } from '../state-controllers/dataset-controller/actions';
import { DatasetService } from 'src/app/services/dataset-service';
import { Comparators } from '../utilities/comparators';
import { DeleteCellRendererComponent, DeleteCellRendererParams } from '../utilities/delete-cell-renderer/delete-cell-renderer.component';
import { ToastrService } from 'ngx-toastr';
import { selectDataset } from '../state-controllers/dataset-controller/selectors/dataset.selectors';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent {
  apiUrl: string;
  httpClient: HttpClient;
  gridOptions: GridOptions;

  dataset$ = this.datasetStore.select(selectDataset);
  datasetId: any;

  datasetName: any;
  uploadedFile!: FormData;
  
  private gridApi!: GridApi;
  columnApi!: ColumnApi;

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private datasetService: DatasetService,
    private toaster: ToastrService
    ) {
      this.apiUrl = 'http://127.0.0.1:5000/'
      this.httpClient = httpClient;
      this.gridOptions = <GridOptions>{
        context: {
            componentParent: this
        }
    };
  }

  columnDefs: ColDef[] = [
    { 
      headerName: "Name",
      field: 'name' 
    },
    { 
      headerName: "Date Uploaded",
      field: 'create_date',
      sort: 'desc',
      comparator: Comparators.dateComparator, 
    },
    { 
      headerName: "Last Updated",
      field: 'update_date',
      comparator: Comparators.dateComparator, 
    },
    { 
      headerName: "MongoDB ID",
      field: '_id' 
    },
    { 
      headerName: "Delete Action",
      field: "_id",
      cellRenderer: DeleteCellRendererComponent,
      cellRendererParams: { 
        service: this.datasetService, 
      } as DeleteCellRendererParams,
    },
  ];

   // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  ngOnInit(){
    this.dataset$.subscribe((data) => {
      this.datasetId = data._id;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi! = params.api;
    this.columnApi = params.columnApi;

    this.rowData$ = this.datasetService.getResponseDataset("6435575578b04a2b1549c17b")
    .pipe(map(response => response.data)) 
  }

  onFirstDataRendered(event: FirstDataRenderedEvent){
    const allColumnIds: string[] = [];
    this.columnApi.getColumns()!.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    console.log(allColumnIds)
    this.columnApi.autoSizeColumns(allColumnIds, false);

    this.gridApi.forEachNode(node => {
        if (node.data._id == this.datasetId){
          node.setSelected(true);
          this.gridApi.ensureNodeVisible(node)
        }
    })
  }

  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
    const data = e.data
    this.datasetStore.dispatch(DatasetActions.loadSelectedDatasetInit({ data: data }))
  }

  onDeleteCompleted(response: any){
    console.log(response)
    if (response.flag) {
      this.rowData$ = this.datasetService.getResponseDataset("6435575578b04a2b1549c17b")
      .pipe(map(response => response.data)) 
    }
  }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }


  public getHttpHeader() {
    console.log("wwwd")
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return httpOptions;
  }

  onFileSelected(event:any){
    const file:File = event.target.files[0];
    if (file){
      console.log(file)
      this.datasetName = file.name;
      this.uploadedFile = new FormData();
      this.uploadedFile.append('dataset', file);
      this.uploadedFile.append('user_id', '6435575578b04a2b1549c17b')
      // this.httpClient.post<any>(this.apiUrl + '/upload-dataset', this.uploadedFile, this.getHttpHeader())
      // const upload$ = this.httpClient.post(this.apiUrl + '/upload-dataset', this.uploadedFile);

      //       upload$.subscribe();
      this.datasetService.upload(this.uploadedFile).subscribe(response => {
        console.log(response)
        if (response.flag) {
          this.toaster.success('Uploaded Successfully')
          this.rowData$ = this.datasetService.getResponseDataset("6435575578b04a2b1549c17b")
          .pipe(map(response => response.data)) 
        }
        else {
          this.toaster.error(
            response.error
          );
        }
      })
    }
  }

}
