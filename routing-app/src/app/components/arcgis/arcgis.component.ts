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




@Component({
  selector: 'app-arcgis',
  templateUrl: './arcgis.component.html',
  styleUrls: ['./arcgis.component.css']
})
export class ArcgisComponent {

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
      // center: [-118.805, 34.027], // Longitude, latitude
      // zoom: 13, // Zoom level
      center: [133.7751, -25.2744], // Longitude, Latitude of Australia's center
      zoom: 4, 
      container: "viewDiv" // Div element
    });



    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const point: any = { //Create a point
      type: "point",
      longitude: -118.80657463861,
      latitude: 34.0005930608889
    };

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],  // Orange
      outline: {
          color: [255, 255, 255], // White
          width: 1
        }
    };
    
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });
    graphicsLayer.add(pointGraphic);



    // Create a line geometry
    const polyline = {
      type: "polyline",
      paths: [
          [-118.821527826096, 34.0139576938577], //Longitude, latitude
          [-118.814893761649, 34.0080602407843], //Longitude, latitude
          [-118.808878330345, 34.0016642996246]  //Longitude, latitude
      ]
    };
    const simpleLineSymbol = {
      type: "simple-line",
      color: [226, 119, 40], // Orange
      width: 2
    };

    const polylineGraphic = new Graphic({
      geometry: <any>polyline,
      symbol: simpleLineSymbol
    });
    graphicsLayer.add(polylineGraphic);



    // Create a polygon geometry
    const polygon = {
      type: "polygon",
      rings: [
          [-118.818984489994, 34.0137559967283], //Longitude, latitude
          [-118.806796597377, 34.0215816298725], //Longitude, latitude
          [-118.791432890735, 34.0163883241613], //Longitude, latitude
          [-118.79596686535, 34.008564864635],   //Longitude, latitude
          [-118.808558110679, 34.0035027131376]  //Longitude, latitude
      ]
    };

    const simpleFillSymbol = {
      type: "simple-fill",
      color: [227, 139, 79, 0.8],  // Orange, opacity 80%
      outline: {
          color: [255, 255, 255],
          width: 1
      }
    };

    const popupTemplate = {
      title: "{Name}",
      content: "{Description}"
    }
    const attributes = {
        Name: "Graphic",
        Description: "I am a polygon"
    }

    const polygonGraphic = new Graphic({
      geometry: <any>polygon,
      symbol: simpleFillSymbol,
      attributes: attributes,
      popupTemplate: popupTemplate,
    });
    graphicsLayer.add(polygonGraphic);



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
        // expression: "$feature.SA2_MAINCODE_2016" + ": " + "$feature.SA2_NAME_2016"
      }
    };

    // Create a FeatureLayer for the SA2 of Australia
    var statisticalArea2Layer = new FeatureLayer({
      url: "https://services7.arcgis.com/nMBRP09Dx4VqvXeZ/arcgis/rest/services/HSVD_prevalence_PHA/FeatureServer/0",
      labelingInfo: [statisticalArea2Labels],
    });

    // Add the states layer to the map
    map.add(statisticalArea2Layer);

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



    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "arcgis-imagery"
   });

    view.ui.add(basemapToggle,"bottom-right");

    // const basemapGallery = new BasemapGallery({
    //   view: view,
    //   source: {
    //     query: {
    //       title: '"World Basemaps for Developers" AND owner:esri'
    //     }
    //   }
    // });

    // view.ui.add(basemapGallery,"top-right");



    
  }
}
