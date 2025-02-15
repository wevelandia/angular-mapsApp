import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

// Como en los marker no se puede obtener el color, se realiza una interface para poder mantener las propiedades del marker y su color
interface MarkerAndColor {
  color: string;
  marker: Marker;
}

// Como se va a almacenar en el locaStorage la información del marker y el color, definimos una interface porque el marker tiene mucha información y no la necesitamos.
interface PlainMarker {
  color: string;
  lngLat: number[]; // Esto es lo mismo que tener lngLat: [number, number];
}

@Component({
  selector: 'maps-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  // Definimos una variable para mantener los marcadores que se seleccionen
  public markers: MarkerAndColor[] = [];

  // Vamos a hacer referencia a un objeto HTML en este caso a #map
  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;  // Este map puede estar nulo en algun determinado momento.
  public currentLngLat: LngLat = new LngLat(-74.1472510767637, 4.609742054962979);

  // Despues de que la vista ha sido inicializada.
  // En container: Me permite recibir un string o un HTMLElement que en este caso seria nuesta referencia de #map (div).
  ngAfterViewInit(): void {

    // this.divMap?.nativeElement: Esto puede ser en alguno momento nulo, por ello se pone la siguiente validación antes de cargar el mapa
    //console.log(this.divMap);
    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      //container: 'map', // container ID, si en el HTML se tiene id="map"
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      //center: [-74.5, 40], // starting position [lng, lat]
      center: this.currentLngLat,
      zoom: 13
    });

    // Despues de que se ha cargado el mapa se traen los datos del localStorage
    this.readFromLocalStorage();

    // Se pueden crear marcadores personalizados
    //const markerHtml = document.createElement('div');
    //markerHtml.innerHTML = 'William E. Velandia I.';

    // Para crear un marcador, se asignan las coordenadas y se le añade al mapa.
    //const marker = new Marker({
    //    //color: 'red'
    //    element: markerHtml
    //})
    //  .setLngLat( this.currentLngLat )
    //  .addTo( this.map );

  }

  // como en addMarker se reciben las coordenadas para el marker, se crea un nuevo metodo.
  createMarker() {
    if ( !this.map ) return;
    // Definimos un color aleatorio.
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    // Obtenemos como coordenadas el centro del mapa
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color );
  }

  // Se va a crear un metodo para añadir marcadores
  addMarker( lngLat: LngLat, color: string ) {
    if ( !this.map ) return;

    const marker = new Marker({
      color: color,
      draggable: true /* Esto me permite mover el marker. */
    })
      .setLngLat( lngLat )
      .addTo( this.map );

    // Cada vez que se crea un marker se adiciona en markers.
    this.markers.push({ color, marker });
    //this.markers.push( {
    //  color: color,
    //  marker: marker
    //} );

    this.saveToLocalStorage();

    // Actualizamos el localStorage para cuando se termine de mover el Marker.
    marker.on( 'dragend', () => this.saveToLocalStorage() );

  }

  deleteMarker( index: number ) {
    // Eliminamos el marker del mapa
    this.markers[index].marker.remove();
    // Eliminamos el marker de la listaen el html.
    this.markers.splice( index, 1 );
  }

  // Creamos el siguiente metodo para cuando se de click en un elemento html de un marcador me mueva hasta la localización del mismo.
  flyTo( marker: Marker ) {

    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });

  }


  // Para hacer persistente la información y almacenar esso marker en el localStorgae se realizan los dos siguientes metodos.
  saveToLocalStorage() {
    //console.log( this.markers );
    // En lugar de colorMarker se puede desestructurar y queda color, marker
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    } );

    //console.log( plainMarkers );
    // Almacenamos en nuestro localStorage
    localStorage.setItem( 'palinMarkers', JSON.stringify( plainMarkers ) );

  }

  // Recostruimos los marker desde el locaStorage
  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    // Reconstrimos los marker del localStorahge en plainMarkers
    // const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); // Ojo! Esto potencialmente inseguro porque PlainMarker es una interface y su igualdad puede no tener esa misma estructura
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); // Confiamos en que lo que retorna tiene la misma estructura de la interface.

    //console.log( plainMarkers );
    // Ahora ponemos esos plainMarkers en el mapa.
    // Desestructuranis elk valor de plainMarker
    //plainMarkers.forEach( plainMarker => {}
    plainMarkers.forEach( ({ color, lngLat }) => {
      // Aplicamos desestructuracion de lngLat
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color );
    } );

  }

}
