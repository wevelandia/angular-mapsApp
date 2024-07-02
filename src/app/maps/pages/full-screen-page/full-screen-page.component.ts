import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

@Component({
  selector: 'maps-full-screen-page',
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements AfterViewInit {

  // Vamos a hacer referencia a un objeto HTML en este caso a #map
  @ViewChild('map') divMap?: ElementRef;

  // Despues de que la vista ha sido inicializada.
  // En container: Me permite recibir un string o un HTMLElement que en este caso seria nuesta referencia de #map (div).
  ngAfterViewInit(): void {

    // this.divMap?.nativeElement: Esto puede ser en alguno momento nulo, por ello se pone la siguiente validación antes de cargar el mapa
    //console.log(this.divMap);
    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    const map = new Map({
      //container: 'map', // container ID, si en el HTML se tiene id="map"
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }

}
