import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from "mapbox-gl";

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {

  @Input() lngLat?: [number, number];

  // Vamos a hacer referencia a un objeto HTML en este caso a #map
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {
    if ( !this.divMap?.nativeElement ) throw 'Map Div no found';

    if ( !this.lngLat ) throw "LngLat cant't be null";

    const map = new Map({
      //container: 'map', // container ID, si en el HTML se tiene id="map"
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false // Me realiza las retricciones de hacer zoom, de moverlo
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( map );

  }

}
