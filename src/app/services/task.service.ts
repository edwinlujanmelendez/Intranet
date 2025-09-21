import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Localidad } from '../interfaces/localidad';
import { Rutas } from '../interfaces/rutas';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // TODO: API - INTRANET
  url_api_intranet: string = "https://www.movilbus.pe/backendIntranet/";                                            /* URL PRODUCTIVO - INTRANET */
  //url_api_intranet: string = "https://www.movilbus.pe/backendIntranetQA/";                                          /* URL DESARROLLO - INTRANET */
  //url_api_intranet: string = "http://localhost:8080/";                                                                /* URL Localhost - INTRANET */

  // TODO: API - ECOMMERCE
  url_api_ecommerce: string = "https://www.movilbus.pe/backendEcommerce/";                                          /* URL PRODUCTIVO - ECOMMERCE */
  //url_api_ecommerce: string = "https://www.movilbus.pe/devbackEcoBus/";                                               /* URL DESARROLLO - ECOMMERCE */
  //url_api_ecommerce: string = "http://localhost:8080/";                                                             /* URL Localhost - ECOMMERCE */

  // TODO: CANTIDAD CARACTERES RUC
  MAX_LENGTH_RUC: number = 11;

  // TODO: CONSTANTES
  AMBIENTE: string = "PRODUCCIÓN";                    // PRODUCCIÓN
  //AMBIENTE: string = "DESARROLLO";                  // DESARROLLO

  LIMITE_CANTIDAD_ASIENTOS: number = 20;              // LIMITE CANTIDAD ASIENTOS POR BUS

  VERSION_INTRANET: number = 2.2;

  constructor(private http: HttpClient, private authService: AuthService){ }

  // TODO: ************************************ API - INTRANET ************************************ //
  postLogin(parametrosLoginSispas: any){
    return this.http.post<any[]>(this.url_api_intranet+"Usuarios/loginSispas", parametrosLoginSispas);
  }

  getVerificarCajaAbierta(idUsuario: number, idAgencia: number){
    return this.http.get(this.url_api_intranet+"Usuarios/getVerificarCajaAbierta/"+idUsuario+"/"+idAgencia);
  }

  pagoLinkNiubiz(jsonRegistrarVenta: any){
    return this.http.post<any[]>(this.url_api_intranet+"Ventas/pagoLinkNiubiz", jsonRegistrarVenta);
  }

  pagoLinkPagoEfectivo(jsonRegistrarVenta: any){
    return this.http.post<any[]>(this.url_api_intranet+"Ventas/pagoLinkPagoEfectivo", jsonRegistrarVenta);
  }

  /*getPromocionesVentasReservas(canalVenta: number){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/getPromocionesVentasReservas/1");
  }*/

  getPromocionesSispas(itinerarioIda: number, rutaIda: number, idServicioIda: number, fechaRutaIda: string, itinerarioVuelta: number, rutaVuelta: number, idServicioVuelta: number, fechaRutaVuelta: string){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/getPromocionesSispas/"+itinerarioIda+"/"+rutaIda+"/"+idServicioIda+"/"+fechaRutaIda+"/"+itinerarioVuelta+"/"+rutaVuelta+"/"+idServicioVuelta+"/"+fechaRutaVuelta);
  }

  getPromocionesVentasReservasRuc(idRuc: number){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/getPromocionesVentasReservasRuc/"+idRuc);
  }

  /*verificarPagoNiubiz(numOperacion: string){
    return this.http.get<any[]>(this.url_api_intranet+"Ventas/verificarPagoNiubiz/"+numOperacion, {});
  }*/

  getPromocionesCupones(){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/getPromocionesCupones");
  }

  simularPago(numOperacion: string){
    return this.http.get<any[]>(this.url_api_intranet+"Ventas/simularPago/"+numOperacion);
  }

  getGrupoCupones(){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/getGrupoCupones");
  }

  updateInsertPromocion(data: any){
    return this.http.post<any[]>(this.url_api_intranet+"Promociones/updateInsertPromocion ", data);
  }

  eliminarPromocion(cupon_id: number){
    return this.http.get<any[]>(this.url_api_intranet+"Promociones/eliminarPromocion/"+cupon_id);
  }

  getAgencias(){
    return this.http.get<any[]>(this.url_api_intranet+"Reportes/getAgencias");
  }

  getUsuariosCounter(agencia_id: number, fechaInicio: string, fechaFin: string){
    return this.http.get<any[]>(this.url_api_intranet+"Reportes/getUsuariosCounter/"+agencia_id+"/"+fechaInicio+"/"+fechaFin);
  }

  getReporteDetallado(agencia_id: number, usuario_id: number, fechaInicio: string, fechaFin: string){
    return this.http.get<any[]>(this.url_api_intranet+"Reportes/getReporteDetallado/"+agencia_id+"/"+usuario_id+"/"+fechaInicio+"/"+fechaFin);
  }

  getSeguimientoFrotcom(localidadOrigen: number, localidadDestino: number, fechaInicio: string, fechaFin: string){
    return this.http.get<any[]>(this.url_api_intranet+"Reportes/getSeguimientoFrotcom/"+localidadOrigen+"/"+localidadDestino+"/"+fechaInicio+"/"+fechaFin);
  }

  postEnviarUrlPago(datos: any){
    return this.http.post<any[]>(this.url_api_intranet+"Reportes/postEnviarUrlPago", datos);
  }

  getBuscarPasajes(txt_input: string){
    return this.http.get<any[]>(this.url_api_intranet+"Ventas/getBuscarPasajes/"+txt_input);
  }

  postDescargarPdfPasajes(pasajes: any){
    return this.http.post<any[]>(this.url_api_intranet+"Ventas/DescargarPdfPasajes", pasajes);
  }

  enviarPdfCorreo(datos: any){
    return this.http.post("https://www.movilbus.pe/backendAutoservicio/Home/enviarPdfCorreo", datos, { responseType: 'text' });
  }

  getBuscarTransbordos(boleto: string){
    return this.http.get<any[]>(this.url_api_intranet+"Ventas/getBuscarTransbordos/"+boleto);
  }

  /*cantidadPasajesPorCanjear(){
    return this.http.get<any[]>(this.url_api_intranet+"Programmer/cantidadPasajesPorCanjear", {});
  }*/

  postBloquearAsiento(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number, idUsuario: number, idHardware: number){
    return this.http.post<any[]>(this.url_api_intranet+"Asiento/bloquear", 
    { rutaId : rutaId,
      itinerarioId: itinerarioId,
      fechaPartida: fechaPartida,
      asiento: asiento,
      horaPartida: horaPartida,
      piso: piso,
      tiempoBloqueo: tiempoBloqueo,
      tarifa: tarifa,
      idUsuario: idUsuario,
      idHardware: idHardware
    });
  }

  deleteLiberarAsiento(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number, idUsuario: number, idHardware: number){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        rutaId : rutaId,
        itinerarioId: itinerarioId,
        fechaPartida: fechaPartida,
        asiento: asiento,
        horaPartida: horaPartida,
        piso: piso,
        tiempoBloqueo: tiempoBloqueo,
        tarifa: tarifa,
        idUsuario: idUsuario,
        idHardware: idHardware
      },
    };
    
    return this.http.delete<any[]>(this.url_api_intranet+"Asiento/liberar", options);
  }
  // TODO: ************************************ API - INTRANET ************************************ //




  // TODO: ************************************ API - ECOMMERCE ************************************ //
  getLocalidad(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce + "Maestro/localidad", { headers });
      })
    );
  }

  getLocalidadDestino(idOrigen: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<Localidad[]>(this.url_api_ecommerce+"Maestro/localidad/destino/"+idOrigen, { headers });
      })
    );
  }

  getRutas(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce + "Maestro/rutas", { headers });
      })
    );
  }

  getItinerario(idOrigen: number, idDestino: number, fechaIda: String, fechaVuelta: string, ida_vuelta_iguales: number, minutos_busqueda: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        if(fechaVuelta!=""){
          return this.http.get<any[]>(this.url_api_ecommerce+"Itinerario/disponibles/"+idOrigen+"/"+idDestino+"/"+fechaIda+"/"+fechaVuelta+"/"+ida_vuelta_iguales+"/"+minutos_busqueda, {headers});
        }else{
          return this.http.get<any[]>(this.url_api_ecommerce+"Itinerario/disponibles/"+idOrigen+"/"+idDestino+"/"+fechaIda+"/"+ida_vuelta_iguales+"/"+minutos_busqueda, {headers});
        }
      })
    );
  }

  getEstructuraBus(idItinerario: number, idRuta: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Asiento/estructura/"+idItinerario+"/"+idRuta, {headers});
      })
    );
  }

  getTipoDocumento(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/tipodocumento", {headers});
      })
    );
  }

  getParametrosAsientos(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/parametro", {headers});
      })
    );
  }

  getTerminosCondiciones(): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/terminoscondiciones", {headers});
      })
    );
  }

  getNameDocumento(tipo_doc: number, num_documento: string): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Ventas/pasajero/"+tipo_doc+"/"+num_documento, {headers});
      })
    );
  }

  getDatosRuc(ruc: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Ventas/cliente/"+ruc, {headers});
      })
    );
  }

  getPreciosCounter(itinerario_id: number, ruta_id: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Itinerario/getPreciosCounter/"+itinerario_id+"/"+ruta_id, {headers});
      })
    );
  }

  consultarCupon(nameCupon: any, idItinerario: number, idRuta: number, itinerario_idVuelta: number, ruta_idVuelta: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/consultarCupon/"+nameCupon+"/"+idItinerario+"/"+idRuta+"/"+itinerario_idVuelta+"/"+ruta_idVuelta, {headers});
      })
    );
  }

  postConsumirCupon(nameCupon: any, idItinerario: number, idRuta: number, itinerario_idVuelta: number, ruta_idVuelta: number, usosRestantesIda: number, usosRestantesVuelta: number, cuponAplicado: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/postConsumirCupon/"+nameCupon+"/"+idItinerario+"/"+idRuta+"/"+itinerario_idVuelta+"/"+ruta_idVuelta+"/"+usosRestantesIda+"/"+usosRestantesVuelta+"/"+cuponAplicado, {headers});
      })
    );
  }

  getPromocionBanco(idBanco: number, idItinerario: number, idRuta: number): Observable<any[]> {
    return this.authService.getValidToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(this.url_api_ecommerce+"Maestro/getPromocionBanco/"+idBanco+"/"+idItinerario+"/"+idRuta, {headers});
      })
    );
  }

  getMyIp(){
    return this.http.get<any[]>("https://api.ipify.org/?format=json");
  }
  // TODO: ************************************ API - ECOMMERCE ************************************ //

  postActualizarBloqueoAsiento(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number){
    return this.http.put<any[]>(this.url_api_intranet+"Asiento/actualizar", 
    { rutaId : rutaId,
      itinerarioId: itinerarioId,
      fechaPartida: fechaPartida,
      asiento: asiento,
      horaPartida: horaPartida,
      piso: piso,
      tiempoBloqueo: tiempoBloqueo,
      tarifa: tarifa
    });
  }

  registrarVentaPayment(jsonRegistrarVenta: any){
    return this.http.post<any[]>(this.url_api_intranet+"Ventas/registrarpayment ", jsonRegistrarVenta);
  }

  registrarPagoEfectivo(jsonRegistrarVenta: any){
    return this.http.post(this.url_api_intranet+"Ventas/registrarpagoefectivo ", jsonRegistrarVenta, { responseType: 'text'});
  }

  postBloquearAsientoPromocion(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number){
    return this.http.post<any[]>(this.url_api_intranet+"Asiento/bloquearPromocion", 
    { rutaId : rutaId,
      itinerarioId: itinerarioId,
      fechaPartida: fechaPartida,
      asiento: asiento,
      horaPartida: horaPartida,
      piso: piso,
      tiempoBloqueo: tiempoBloqueo,
      tarifa: tarifa
    });
  }

  postActualizarBloqueoAsientoPromocion(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number){
    return this.http.put<any[]>(this.url_api_intranet+"Asiento/actualizarPromocion", 
    { rutaId : rutaId,
      itinerarioId: itinerarioId,
      fechaPartida: fechaPartida,
      asiento: asiento,
      horaPartida: horaPartida,
      piso: piso,
      tiempoBloqueo: tiempoBloqueo,
      tarifa: tarifa
    });
  }

  deleteLiberarAsientoPromocion(rutaId: number, itinerarioId: number, fechaPartida: string, asiento: any, horaPartida: string, piso: any, tiempoBloqueo: number, tarifa: number){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        rutaId : rutaId,
        itinerarioId: itinerarioId,
        fechaPartida: fechaPartida,
        asiento: asiento,
        horaPartida: horaPartida,
        piso: piso,
        tiempoBloqueo: tiempoBloqueo,
        tarifa: tarifa
      },
    };
    
    return this.http.delete<any[]>(this.url_api_intranet+"Asiento/liberarPromocion", options);
  }

  getSearchOrderBackend(texto: string){
    return this.http.get<any[]>(this.url_api_intranet+"Maestro/getSearchOrder/"+texto);
  }

  postActualizarPromociones(promociones_id: number, nombre: string, fecha_inicio: string, fecha_fin: string, servicios: string, observaciones: string, porcentaje_desc: any, preciofinal_desc: any, estado: number){
    return this.http.post<any[]>(this.url_api_intranet+"Maestro/actualizarPromocion", 
    { promociones_id : promociones_id,
      nombre: nombre,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      servicios: servicios,
      observaciones: observaciones,
      porcentaje_desc: porcentaje_desc,
      preciofinal_desc: preciofinal_desc,
      estado: estado
    });
  }

  postActualizarMaestroCupones(cupones_id: number, nombre: string, fecha_inicio: string, fecha_fin: string, compra_inicio: string, compra_fin: string, servicios: string, porcentaje_desc: any, usos_restantes: number, grupoCuponesId: number, rutas_prohibidas: string, rutas_aceptadas: string, preciofinal_desc: any, estado: number){
    return this.http.post<any[]>(this.url_api_intranet+"Maestro/actualizarMaestroCupones", 
    { cupones_id : cupones_id,
      nombre: nombre,
      porcentaje_desc: porcentaje_desc,
      preciofinal_desc: preciofinal_desc,
      usos_restantes: usos_restantes,
      servicios: servicios,
      rutas_prohibidas: rutas_prohibidas,
      rutas_aceptadas: rutas_aceptadas,
      hora_partida: '',
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      compra_inicio: compra_inicio,
      compra_fin: compra_fin,
      estado: estado,
      grupoCuponesId: grupoCuponesId,
      nombreGrupo_cupon: ''
    });
  }

  insertarPromociones(itinerario_id: number){
    return this.http.get<any[]>(this.url_api_intranet+"Maestro/insertarPromociones/"+itinerario_id);
  }

  getCuponesExistentes(itinerario_id: number){
    return this.http.get<any[]>(this.url_api_intranet+"Maestro/cuponesExistentes/"+itinerario_id);
  }
}