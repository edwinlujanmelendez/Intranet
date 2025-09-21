import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  //private subjectDatosItinerario: any;
  private subjectDatosItinerarioVuelta: any;
  private subjectDatosAsientosIda: any;
  private subjectDatosAsientosVuelta: any;
  private subjectRegresarDatosItinerarioIda: any;
  private subjectRegresarDatosAsientosIda: any;
  private subjectRegresarDatosItinerarioVuelta: any;
  private subjectRegresarDatosAsientosVuelta: any;
  private subjectDatosPasajeros: any;
  private subjectConfirmacionCompra: any;
  private subjectRegresarDatosPasajeros: any;

  constructor() { }

  /*enviarDatosItinerarioIda(data: any){
    this.subjectDatosItinerario = data;
  }

  getDatosItinerarioIda(){
    return this.subjectDatosItinerario;
  }*/

  enviarDatosItinerarioVuelta(data: any){
    this.subjectDatosItinerarioVuelta = data;
  }

  getDatosItinerarioVuelta(){
    return this.subjectDatosItinerarioVuelta;
  }

  enviarDatosAsientosIda(data: any){
    this.subjectDatosAsientosIda = data;
  }

  getDatosAsientosIda(){
    return this.subjectDatosAsientosIda;
  }

  enviarDatosAsientosVuelta(data: any){
    this.subjectDatosAsientosVuelta = data;
  }

  getDatosAsientosVuelta(){
    return this.subjectDatosAsientosVuelta;
  }

  enviarRegresarDatosItinerarioIda(data: any){
    this.subjectRegresarDatosItinerarioIda = data;
  }

  getRegresarDatosItinerarioIda(){
    return this.subjectRegresarDatosItinerarioIda;
  }

  enviarRegresarDatosAsientosIda(data: any){
    this.subjectRegresarDatosAsientosIda = data;
  }

  getRegresarDatosAsientosIda(){
    return this.subjectRegresarDatosAsientosIda;
  }

  enviarRegresarDatosItinerarioVuelta(data: any){
    this.subjectRegresarDatosItinerarioVuelta = data;
  }

  getRegresarDatosItinerarioVuelta(){
    return this.subjectRegresarDatosItinerarioVuelta;
  }

  enviarRegresarDatosAsientosVuelta(data: any){
    this.subjectRegresarDatosAsientosVuelta = data;
  }

  getRegresarDatosAsientosVuelta(){
    return this.subjectRegresarDatosAsientosVuelta;
  }

  enviarDatosPasajeros(data: any){
    this.subjectDatosPasajeros = data;
  }

  getDatosPasajeros(){
    return this.subjectDatosPasajeros;
  }

  enviarConfirmacionPasajes(data: any){
    this.subjectConfirmacionCompra = data;
  }

  getConfirmacionPasajes(){
    return this.subjectConfirmacionCompra;
  }

  enviarRegresarDatosPasajeros(data: any){
    this.subjectRegresarDatosPasajeros = data;
  }

  getRegresarDatosPasajeros(){
    return this.subjectRegresarDatosPasajeros;
  }

}