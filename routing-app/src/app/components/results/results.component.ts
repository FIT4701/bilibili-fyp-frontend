import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Chart } from 'chart.js/auto';
import { Observable, map } from 'rxjs';

import { ChartService } from 'src/app/services/chart-service';
import { Comparators } from '../utilities/comparators';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  apiUrl: string;
  httpClient: HttpClient;

  user_id = "6435575578b04a2b1549c17b";
  
  private gridApi!: GridApi;
  columnApi: any;

  chart: any;
  selectedData: any[] = [];

  displayActionToolbar: any;

  constructor(httpClient: HttpClient,
    private chartService: ChartService
  ) {
    this.apiUrl = 'http://127.0.0.1:5000/'
    this.httpClient = httpClient;
  }

  columnDefs: ColDef[] = [
    { 
      checkboxSelection: true 
    },
    { 
      headerName: "MongoDB Document ID",
      field: '_id' 
    },
    { 
      headerName: "ML Algorithm",
      field: 'algo_type' 
    },
    { 
      headerName: "Run Name",
      field: 'run_name' 
    },
    { 
      headerName: "Run ID",
      field: 'run_id' 
    },
    { 
      headerName: "Created Date",
      field: 'create_date',
      comparator: Comparators.dateComparator,
    },
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  ngOnInit() {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi! = params.api;
    this.columnApi = params.columnApi;

    const request_body = {
      user_id: this.user_id
    }

    this.rowData$ = this.chartService.getResults(request_body)
      .pipe(map(response => response.data))
  }

  onFirstDataRendered(event: FirstDataRenderedEvent){
    const allColumnIds: string[] = [];
    this.columnApi.getColumns()!.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    console.log(allColumnIds)
    this.columnApi.autoSizeColumns(allColumnIds, false);
  }
  
  onSelectionChanged(event: any){
    const selectedNodes = this.gridApi.getSelectedNodes()
    if (selectedNodes.length > 0){
      console.log("display toolbar")
      this.displayActionToolbar = true
    } else {
      console.log("hide toolbar")
      this.displayActionToolbar = false
    }
    this.selectedData = selectedNodes.map(node => node.data)
  }

  clearAllSelections(){
    this.gridApi.deselectAll()
  }

  public plotGraph(selected_data: any[]) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: selected_data.map(row => row.run_name + " (" + row.run_id + ")"),
        datasets:[
          {
            label:'r2 score',
            data: selected_data.map(row => row.metrics.r2_score)
          },
          {
            label:'mae',
            data: selected_data.map(row => row.metrics.mae)
          },
          {
            label:'mse',
            data: selected_data.map(row => row.metrics.mse)
          },
          {
            label:'rmse',
            data: selected_data.map(row => row.metrics.rmse)
          },
          {
            label:'mean absolute percentage',
            data: selected_data.map(row => row.metrics.mean_absolute_percentage)
          },
          {
            label:'median absolute',
            data: selected_data.map(row => row.metrics.media_absolute)
          },
          {
            label:'max error',
            data: selected_data.map(row => row.metrics.max_error)
          },
        ]
        }
    })
  }

  public displayData(){
    if (this.chart != null) {
      this.chart.destroy()
    }
    this.plotGraph(this.selectedData)
  }
  
  onDeleteRows(){
    const doc_ids = this.gridApi.getSelectedNodes().map(node => node.data["_id"])
    this.chartService.delete(doc_ids).subscribe({
        next: () => {
          console.log('Items deleted successfully');
          const request_body = {
            user_id: this.user_id
          }
          this.rowData$ = this.chartService.getResults(request_body)
          .pipe(map(response => response.data))
        },
        error: (error) => {
          console.log('Error deleting items', error);
        }
    })
  }
}
