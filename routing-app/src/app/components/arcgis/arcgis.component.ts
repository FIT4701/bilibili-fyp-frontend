import { Component } from '@angular/core';
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Popup from '@arcgis/core/widgets/Popup'; 
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'

import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import * as Papa from 'papaparse';
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import Color from "@arcgis/core/Color.js";
import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer.js";


@Component({
  selector: 'app-arcgis',
  templateUrl: './arcgis.component.html',
  styleUrls: ['./arcgis.component.css']
})
export class ArcgisComponent {

  csvFileInput: any;
  statisticalArea2Layer!: FeatureLayer;
  map!: any;
  renderer: any;

  ngOnInit(){
    esriConfig.apiKey = "AAPKec494d08b92e410a832aca68af6c08ccRwAYSa7l5iUVz_9786FInnz8CIBxsLUPLWXem0ePCii_h-ycfUmotzastMOAKwhP";

    const vtlLayer = new VectorTileLayer({
      url: "https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/"
    });

    const map = new Map({
      basemap: "arcgis-topographic", // Basemap layer service
      layers: [vtlLayer]
    })

    const view = new MapView({
      map: map,
      center: [133.7751, -25.2744], // Longitude, Latitude of Australia's center
      zoom: 4, 
      container: "viewDiv" // Div element
    });



    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const statisticalArea2Labels = <any>{
      symbol: {
        type: "text",
        color: "#FFFFFF",
        haloColor: "#5E8D74",
        haloSize: "2px",
        font: {
          size: "12px",
          family: "Noto Sans",
          style: "italic",
          weight: "normal"
        }
      },

      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.PHA_CODE16"
      }
    };

    // Create a FeatureLayer for the SA2 of Australia
    var statisticalArea2Layer = new FeatureLayer({
      url: "https://services7.arcgis.com/nMBRP09Dx4VqvXeZ/arcgis/rest/services/HSVD_prevalence_PHA/FeatureServer/0",
      labelingInfo: [statisticalArea2Labels],
    });    
    
    const less35 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#fffcd4",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const less50 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#b1cdc2",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const more50 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#38627a",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    const more75 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#0d2644",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5]
      }
    };

    /*****************************************************************
     * Set each unique value directly in the renderer's constructor.
     * At least one field must be used (in this case the "COL_DEG" field).
     * The label property of each unique value will be used to indicate
     * the field value and symbol in the legend.
     *****************************************************************/

    const renderer: any = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "stroke_reported",
      legendOptions: {
        title: "% of adults (25+) with a college degree"
      },
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "black",
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: [50, 50, 50, 0.6]
        }
      },
      defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 0.6999,
          symbol: less35,
          label: "< 35%"
        },
        {
          minValue: 0.7000,
          maxValue: 0.9999,
          symbol: less50,
          label: "35 - 50%"
        },
        {
          minValue: 1,
          maxValue: 1.1119,
          symbol: more50,
          label: "50 - 75%"
        },
        {
          minValue: 1.2,
          maxValue: 10,
          symbol: more75,
          label: "> 75%"
        }
      ]
    };

    this.renderer = renderer;

    // statisticalArea2Layer.renderer = renderer;

    // Add the states layer to the map
    map.add(statisticalArea2Layer);

    this.statisticalArea2Layer = statisticalArea2Layer;
    this.map = map;

    // Create a Popup template
    var popupTemplate2 = {
      title: "{name}",
      content: "Some information about {name}"
    };

    // Create a Popup instance
    var popup = new Popup({
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: true,
        breakpoint: false
      }
    });
    // Set the popup template for the states layer
    statisticalArea2Layer.popupTemplate = <any>popupTemplate2;

    // Enable popups for the states layer
    view.popup = popup;



  //   const basemapToggle = new BasemapToggle({
  //     view: view,
  //     nextBasemap: "arcgis-imagery"
  //  });

  //   view.ui.add(basemapToggle,"bottom-right");

    // const basemapGallery = new BasemapGallery({
    //   view: view,
    //   source: {
    //     query: {
    //       title: '"World Basemaps for Developers" AND owner:esri'
    //     }
    //   }
    // });

    // view.ui.add(basemapGallery,"top-right");
    
    setTimeout(()=>{
      // Define the new field and its value
      var newField = {
        name: "stroke_reported",
        type: "integer",
        alias: "Stroke Reported",
      };

      // Add the new field to the existing fields
      var existingFields = statisticalArea2Layer.fields.slice(); // Copy existing fields
      existingFields.push(<any>newField);

      // Create a new FeatureLayer with the updated fields
      var updatedFeatureLayer = new FeatureLayer({
        url: "https://services7.arcgis.com/nMBRP09Dx4VqvXeZ/arcgis/rest/services/HSVD_prevalence_PHA/FeatureServer/0",
        outFields: ["*"], // Include all existing fields
        definitionExpression: "1=1", // Include all features
        objectIdField: "OBJECTID",
        fields: existingFields, // Include the updated fields
      });

      // Query all features and set the value of the new field
      updatedFeatureLayer
        .queryFeatures()
        .then(function (results) {
          var updates: Graphic[] = [];
          results.features.forEach(function (feature) {
            feature.attributes.stroke_reported = 5;
            updates.push(feature);
          });

          // Apply updates to the features
          updatedFeatureLayer.applyEdits({
            updateFeatures: updates,
          });
        });
      updatedFeatureLayer.renderer= renderer
      map.add(updatedFeatureLayer);

    }, 3000)
    
    
  }

  onFileSelected(event:any){
    const file:File = event.target.files[0];
    if (file) {
      this.loadCsvData(file);
    }
  }

  loadCsvData(file: File) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const csvData:any = result.data;
        const graphics: any[] = [];

        this.statisticalArea2Layer.queryFeatures().then((featureSet) => {
          featureSet.features.forEach((feature) => {
            const code = feature.attributes.PHA_CODE16;
            const matchingCSVRow = csvData.find((row: { [x: string]: any; }) => row['Code'].toString() === code);
            if (matchingCSVRow) {
              const cvdRate = matchingCSVRow['stroke reported'];
              feature.attributes['stroke_reported'] = cvdRate;
              graphics.push(feature);
            }
          });

          console.log(graphics)
          console.log(this.statisticalArea2Layer.fields)

          const combinedFeatureLayer = new FeatureLayer({
            source: graphics,
            objectIdField: 'OBJECTID_1',
            geometryType: 'polygon',
            fields: this.statisticalArea2Layer.fields,
          });
          combinedFeatureLayer.renderer = this.renderer;

          this.statisticalArea2Layer.source = <any>graphics;
          this.statisticalArea2Layer.renderer = this.renderer;
          this.statisticalArea2Layer.refresh();
          this.map.removeAll();
          this.map.add(this.statisticalArea2Layer);
          this.map.add(combinedFeatureLayer)
        });
      },
    });
  }
}
