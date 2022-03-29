import { Location } from './leaflet-map';
import * as L from 'leaflet';
import Map = L.Map;
import Layer = L.Layer;
import LayersObject = L.Control.LayersObject;
import LayerGroup = L.LayerGroup;
import LayerControl = L.Control.Layers;
import { push } from "svelte-spa-router";

export interface Location {
  lat: number;
  lng: number;
}

export interface MapConfig {
  location: Location;
  zoom: number;
  minZoom: number;
}

var myIcon = L.icon({
  iconUrl: 'src\\assets\\bumblebee-honey-bee-icon-png-favpng-MZSpn1HbbLY4S7fGw0czxtSux-removebg-preview.png',
  iconSize: [48, 48],
  iconAnchor: [24, 36],
  popupAnchor: [-3, -76]
  //shadowUrl: 'my-icon-shadow.png',
  //shadowSize: [68, 95],
  //shadowAnchor: [22, 94]
});

export class LeafletMap {
  imap: Map;
  control: LayerControl;
  overlays = {
/*     Wind : L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png?appid={apiKey}', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
      apiKey: "f33068d3d58af2a1629e8e31ceeaddcc",
      opacity: 0.5
    }),
    Clouds : L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid={apiKey}', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
      apiKey: "f33068d3d58af2a1629e8e31ceeaddcc",
      opacity: 0.5
    }),
    Pressure : L.tileLayer('http://{s}.tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png?appid={apiKey}', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
      apiKey: "f33068d3d58af2a1629e8e31ceeaddcc",
      opacity: 0.5
    }) */
  }

  // https://leaflet-extras.github.io/leaflet-providers/preview/

  baseLayers = {
    Terrain: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }),
    Satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }),
  };

  constructor(id: string, descriptor: MapConfig, activeLayer = '') {
    let defaultLayer = this.baseLayers.Terrain;
    if (activeLayer) {
      defaultLayer = this.baseLayers[activeLayer];
    }
    this.imap = L.map(id, {
      center: [descriptor.location.lat, descriptor.location.lng],
      zoom: descriptor.zoom,
      minZoom: descriptor.minZoom,
      zoomControl: false,
      layers: [defaultLayer]
    });
  }

  addLayer(title: string, layer: Layer) {
    this.overlays[title] = layer;
    this.imap.addLayer(layer);
  }

  addLayerGroup(title: string) {
    this.overlays[title] = L.layerGroup([]);
    this.imap.addLayer(this.overlays[title]);
  }

  showLayerControl() {
    this.control = L.control.layers(this.baseLayers, this.overlays,{collapsed:false}).addTo(this.imap);
  }

  showZoomControl(position = 'topleft') {
    L.control
        .zoom({
          position: position
        })
        .addTo(this.imap);
  }

  moveTo(zoom: number, location: Location) {
    this.imap.setZoom(zoom);
    this.imap.panTo(new L.LatLng(location.lat, location.lng));
  }

  zoomTo(location: Location) {
    this.imap.setView(new L.LatLng(location.lat, location.lng), 8);
  }

  addMarker(location: Location, popupText = '', layerTitle = 'default', draggable = false) {
    let group: LayerGroup;
    let marker;
    let position;
    if (draggable){
      marker = L.marker([location.lat, location.lng],{draggable: true, autoPan: true});
      marker.on('dragend', function(event){
        marker = event.target;
        position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true', autoPan: true});
        location.lat = position.lat;
        location.lng = position.lng;
        return location;
      });
      
    } else {
      marker = L.marker([location.lat, location.lng], {icon: myIcon});
      position = marker.getLatLng();

    }

    if (popupText) {
      var popup = L.popup({ autoClose: false, closeOnClick: false });
      popup.setContent(popupText);
      marker.bindPopup(popup);
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });
      marker.on('click', function (e) {
        console.log(e)
        push("/hives")
      });
       
    }


    if (!this.overlays[layerTitle]) {

      group = L.layerGroup([]);
      this.overlays[layerTitle] = group;
      this.imap.addLayer(group);
    } else {
      group = this.overlays[layerTitle] as LayerGroup;
    }
    marker.addTo(group);
    return {location, text: popupText};
  }

  clearHives(group){
    this.imap.removeLayer(group);
  }

  invalidateSize() {
    this.imap.invalidateSize();
    let hiddenMethodMap = this.imap as any;
    hiddenMethodMap._onResize();
  }
}
