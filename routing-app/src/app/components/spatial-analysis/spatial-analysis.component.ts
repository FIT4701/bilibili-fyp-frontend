import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopupComponent } from '../machine-learning/warning-popup/warning-popup.component';
import { SubSink } from 'subsink';
import { selectDataset, selectFeatures } from '../state-controllers/dataset-controller/selectors/dataset.selectors';
import { DatasetState } from '../state-controllers/dataset-controller/states';
import esriConfig from '@arcgis/core/config';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';


import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import { SpatialAnalysisServices } from 'src/app/services/sa-services';
import { DatasetService } from 'src/app/services/dataset-service';
import { DatasetActions } from '../state-controllers/dataset-controller/actions';
import { map } from 'lodash';


export interface Variable {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-spatial-analysis',
  templateUrl: './spatial-analysis.component.html',
  styleUrls: ['./spatial-analysis.component.css']
})
export class SpatialAnalysisComponent implements OnInit {
  apiUrl: string;
  httpClient: HttpClient;
  private subs = new SubSink();
  user_id = '6435575578b04a2b1549c17b';
  locationCode: any;
  displayName: any;
  mainForm!: FormGroup;
  dataset$ = this.datasetStore.select(selectDataset);
  datasetId: any;
  variables: any;
  results: any;
  location_params: any = {
    locations_list : [
      {
        location_code: "AUS",
        // country_name: null,
      },
    ],
  }

  constructor(
    httpClient: HttpClient,
    private datasetStore: Store<DatasetState>,
    private mlWekaStore: Store,
    private dialog: MatDialog,
    private SAservice: SpatialAnalysisServices,
    private formBuilder: FormBuilder,
    private datasetService: DatasetService,
  ) {
    this.apiUrl = 'http://127.0.0.1:5000/';
    this.httpClient = httpClient;
  }

  ngOnInit(): void {

    this.mainForm = this.formBuilder.group({

      dataset_id: ['', Validators.required],
      user_id: [this.user_id, Validators.required],
      area_level: ['counties', Validators.required],
      target_variable: ['', Validators.required],
      mapping_variable: ['', Validators.required],
      save_results: [false],
      // year: [2016, Validators.required],
      // countries: ['', Validators.required],

    });

    this.subs.sink = this.dataset$.subscribe((data) => {
      console.log(data)
      this.datasetId = data._id;
      this.mainForm.patchValue({dataset_id: data._id})
      this.variables = data.attributes;
    });

    // esriConfig.apiKey = "AAPKec494d08b92e410a832aca68af6c08ccRwAYSa7l5iUVz_9786FInnz8CIBxsLUPLWXem0ePCii_h-ycfUmotzastMOAKwhP";

    // const vtlLayer = new VectorTileLayer({
    //   url: "https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/"
    // });

    // const map = new Map({
    //   basemap: "arcgis-topographic", // Basemap layer service
    // })

    // const view = new MapView({
    //   map: map,
    //   center: [-118.805, 34.027], // Longitude, Latitude of Australia's center
    //   zoom: 13, 
    //   container: "viewDiv" // Div element
    // });
    // const graphicsLayer = new GraphicsLayer();
    // map.add(graphicsLayer);

    // const polygonGeometry = new Polygon({
    //   rings: [
    //     [
    //       [-118.818984489994, 34.0137559967283],
    //       [-118.806796597377, 34.0215816298725],
    //       [-118.791432890735, 34.0163883241613],
    //       [-118.79596686535, 34.008564864635],
    //       [-118.808558110679, 34.0035027131376]
    //     ]
    //   ]
    // });

    // const simpleFillSymbol = new SimpleFillSymbol({
    //   color: [227, 139, 79, 0.8],
    //   outline: {
    //     color: [255, 255, 255],
    //     width: 1
    //   }
    // });

    // const polygonGraphic = new Graphic({
    //   geometry: polygonGeometry,
    //   symbol: simpleFillSymbol
    // });
    // graphicsLayer.add(polygonGraphic);
  }

  // onSelectAlgo(locationName: string, code: string){
  //   this.locationCode = code
  //   this.displayName = locationName
  //   // this.algoParamsFormData = null;
  // }

  onParamsChange(i:number, event:any){
    this.location_params.locations_list[i].location_code = event.value
    // this.countries_params.countries_list[i].country_name = {}
  }

  addLocations(){
    this.location_params.locations_list.push({
      location_code: null,
      // country_name: null,
    })
  }

  deleteCountries(index: number){
    this.location_params.locations_list.splice(index, 1)
  }

  runAnalysis(){
    const request_params = {
      DATASET_ID: this.mainForm.controls['dataset_id'].value,
      user_id: this.mainForm.controls['user_id'].value,
      target_variable: this.mainForm.controls['target_variable'].value,
      area_level: this.mainForm.controls['area_level'].value,
      // year: this.mainForm.controls['year'].value,
      request_type: "SA",
      countries_params: {...this.location_params},
      save: this.mainForm.controls['save_results'].value,
      mapping_variable: this.mainForm.controls['mapping_variable'].value,
    };
    console.log(request_params)
    this.SAservice.runSA(request_params)
    .subscribe(response => {
      console.log(response)
      this.results = response
      this.datasetService.getResponseDataset("6435575578b04a2b1549c17b")
      .subscribe(response => {
        console.log(response.data)
        var new_data = response.data.filter((e: { _id: string | any; }) => e._id.includes(this.datasetId))[0]
        new_data.attributes = new_data.attributes.filter((attribute: string[]) => !attribute.includes("DATASET_ID"))
        console.log(new_data.attributes)
        this.datasetStore.dispatch(DatasetActions.loadSelectedDatasetInit({ data: new_data }))
      })
    })    
    
  }


}
