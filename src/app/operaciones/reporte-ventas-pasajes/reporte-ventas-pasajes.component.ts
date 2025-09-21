import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-reporte-ventas-pasajes',
  templateUrl: './reporte-ventas-pasajes.component.html',
  styleUrls: ['./reporte-ventas-pasajes.component.css']
})
export class ReporteVentasPasajesComponent implements OnInit {

  date!: Date;
  date_actual: string = "";
  anio: string = "";

  ltAgencias: any = [];
  codSelectUsuario: number = 0;
  agencia_id: number = 0;
  ListUsuariosCounter: any = [];
  ListReporteDetallado: any = [];

  cantidad_pagados_pagolink: number = 0;
  monto_dinero_pagados_pagolink: number = 0;
  cantidad_ventas_ef: number = 0;
  monto_dinero_ventas_ef: number = 0;
  cantidad_ventas_tc: number = 0;
  monto_dinero_ventas_tc: number = 0;
  cantidad_credito: number = 0;
  monto_dinero_credito: number = 0;
  cantidad_nota_credito: number = 0;
  monto_dinero_nota_credito: number = 0;
  cantidad_cortesias: number = 0;
  monto_dinero_cortesias: number = 0;
  cantidad_prepagado: number = 0;
  monto_dinero_prepagado: number = 0;
  cantidad_recibo_caja: number = 0;
  monto_dinero_recibo_caja: number = 0;
  cantidad_deposito: number = 0;
  monto_dinero_deposito: number = 0;
  cantidad_migracion: number = 0;
  monto_dinero_migracion: number = 0;

  cantidad_reserva: number = 0;
  cantidad_anulados: number = 0;

  /************ MODAL ************/
  modal_venpas_id: number = 0;
  modal_tipo_movimiento: string = "";
  modal_boleto: string = "";
  modal_nro_control: string = "";
  modal_pasajero: string = "";
  modal_nro_asiento: string = "";
  modal_importe: number = 0;
  modal_origen: string = "";
  modal_destino: string = "";
  modal_fecha_partida: string = "";
  modal_hora_partida: string = "";
  modal_comprobante: string = "";
  modal_forma_pago: string = "";
  modal_tipo_forma_pago: string = "";
  modal_operador_tarjeta: string = "";
  modal_tarjeta_credito: string = "";
  modal_nro_operacion: string = "";
  modal_usuario_venta: string = "";
  modal_fecha_expiracion: string = "";
  modal_hora_expiracion: string = "";
  modal_fecha_hora_pago: string = "";
  modal_observaciones: string = "";
  modal_url_pago: string = "";
  modal_email_pasajero: string = "";
  modal_sendmailpasajeros_id: string = "";
  modal_numoperacion: string = "";
  modal_numero_cip: string = "";
  /************ MODAL ************/

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";

  ArrayMostrarModal: any = [];

  constructor(private router:Router, private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) {
    this.date = new Date();
    var dia = "";
    if(Number(this.date.getDate()) < 10){
      dia = "0"+ this.date.getDate();
    }else{
      dia = String(this.date.getDate());
    }
    var mes = "";
    if(Number(this.date.getMonth() + 1) < 10){
      mes = "0"+ Number(this.date.getMonth() + 1);
    }else{
      mes = String(this.date.getMonth() + 1);
    }
    var anio = this.date.getFullYear();

    this.date_actual = anio + "-" + mes + "-" + dia;
  }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona

    this.date_fecha_inicio = this.date_actual;
    this.date_fecha_fin = this.date_actual;

    let StorageUsuarioHardware = JSON.parse(localStorage.getItem('StorageUsuarioHardware') || '{}');
    //console.log(StorageUsuarioHardware);
    this.agencia_id = StorageUsuarioHardware['agencia']['agencia_id'];
    this.changeSelectAgencia();
  }

  ngAfterViewInit(){
    this.taskService.getAgencias().subscribe(responsegetAgencias => {
      //console.log(responsegetAgencias);
      this.ltAgencias = responsegetAgencias;
    });

    $("#tabla_reportes").DataTable();
  }

  changeSelectAgencia(){
    if(isPlatformBrowser(this.platformId)){
      this.taskService.getUsuariosCounter(this.agencia_id, this.date_fecha_inicio, this.date_fecha_fin).subscribe(responsegetUsuariosCounter => {
        //console.log(responsegetUsuariosCounter);
        this.ListUsuariosCounter = responsegetUsuariosCounter;
      });
    }
  }

  buscarReporteDetallado(){
    $(".loader").fadeIn("slow");

    this.cantidad_pagados_pagolink = 0;
    this.monto_dinero_pagados_pagolink = 0;
    this.cantidad_reserva = 0;
    this.cantidad_anulados = 0;
    this.ListReporteDetallado = [];
    var cantidad_pagos_pagolink: any = [];
    $("#tabla_reportes").DataTable().destroy();

    this.taskService.getReporteDetallado(this.agencia_id, this.codSelectUsuario, $("#fechaInicio").val(), $("#fechaFin").val()).subscribe(responsegetReporteDetallado => {
      //console.log(responsegetReporteDetallado);
      this.ListReporteDetallado = responsegetReporteDetallado;

      setTimeout(() => {
        $("#tabla_reportes").DataTable({pageLength: 10,
          deferRender: true,
          scrollY: 400,
          scrollCollapse: true,
          scroller: true,
          "searching": true,
          order: [[6, "desc"]]
        });
      }, 100);

      $(".loader").fadeOut("slow");

      // TODO: CONTAR CANTIDAD Y DINERO, PAGOLINK Y PAGOEFECTIVO
      for(var a=0; a<responsegetReporteDetallado.length; a++){
        if(responsegetReporteDetallado[a]['tipo_movimiento'] == "EFECTIVO"){
          if(responsegetReporteDetallado[a]['tipforpag'] != "ORBIS"){
            cantidad_pagos_pagolink.push(responsegetReporteDetallado[a]['n_numopeban']);
            this.monto_dinero_pagados_pagolink = this.monto_dinero_pagados_pagolink + responsegetReporteDetallado[a]['n_imppag'];
          }
        }
        if(responsegetReporteDetallado[a]['tipo_movimiento'] == "RESERVA"){
          this.cantidad_reserva++;
        }
        if(responsegetReporteDetallado[a]['tipo_movimiento'] == "ANULACION"){
          this.cantidad_anulados++;
        }
      }

      // TODO: PAGOLINK
      cantidad_pagos_pagolink = [...new Set(cantidad_pagos_pagolink)];
      this.cantidad_pagados_pagolink = cantidad_pagos_pagolink.length;
    });
  }

  contar_cantidad_dinero_reporte(responsegetReporteDetallado: any){
    // ? DECLARAR VARIABLES
    var cantidad_pagados_pagolink: any = [];
    var cantidad_ventas_ef: any = [];
    var cantidad_ventas_tc: any = [];
    var cantidad_credito: any = [];
    var cantidad_nota_credito: any = [];
    var cantidad_cortesias: any = [];
    var cantidad_prepagado: any = [];
    var cantidad_recibo_caja: any = [];
    var cantidad_deposito: any = [];
    var cantidad_migracion: any = [];
    
    // TODO: CONTAR CANTIDAD Y DINERO, PAGOLINK
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'] == "V.(PGLINK)"){
        if(responsegetReporteDetallado[a]['c_login'] != "depositopm"){
          cantidad_pagados_pagolink.push(responsegetReporteDetallado[a]['n_numopeban']);
          this.monto_dinero_pagados_pagolink = this.monto_dinero_pagados_pagolink + responsegetReporteDetallado[a]['netoPagado'];
        }
      }
    }
    cantidad_pagados_pagolink = [...new Set(cantidad_pagados_pagolink)];
    this.cantidad_pagados_pagolink = cantidad_pagados_pagolink.length;

    // TODO: CONTAR CANTIDAD Y DINERO, VENTAS EF
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'].includes("(EF)")){
        cantidad_ventas_ef.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_ventas_ef = this.monto_dinero_ventas_ef + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_ventas_ef = [...new Set(cantidad_ventas_ef)];
    this.cantidad_ventas_ef = cantidad_ventas_ef.length;

    // TODO: CONTAR CANTIDAD Y DINERO, VENTAS TC
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'] == "V.(TC)"){
        cantidad_ventas_tc.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_ventas_tc = this.monto_dinero_ventas_tc + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_ventas_tc = [...new Set(cantidad_ventas_tc)];
    this.cantidad_ventas_tc = cantidad_ventas_tc.length;

    // TODO: CONTAR CANTIDAD Y DINERO, CREDITO
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'] == "CREDITO"){
        cantidad_credito.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_credito = this.monto_dinero_credito + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_credito = [...new Set(cantidad_credito)];
    this.cantidad_credito = cantidad_credito.length;

    // TODO: CONTAR CANTIDAD Y DINERO, NOTA CREDITO
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'] == "NOTA CREDITO"){
        cantidad_nota_credito.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_nota_credito = this.monto_dinero_nota_credito + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_nota_credito = [...new Set(cantidad_nota_credito)];
    this.cantidad_nota_credito = cantidad_nota_credito.length;

    // TODO: CONTAR CANTIDAD Y DINERO, CORTESIAS
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'].includes("CORT")){
        cantidad_cortesias.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_cortesias = this.monto_dinero_cortesias + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_cortesias = [...new Set(cantidad_cortesias)];
    this.cantidad_cortesias = cantidad_cortesias.length;

    // TODO: CONTAR CANTIDAD Y DINERO, PREPAGADO
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'].includes("PREP.")){
        cantidad_prepagado.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_prepagado = this.monto_dinero_prepagado + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_prepagado = [...new Set(cantidad_prepagado)];
    this.cantidad_prepagado = cantidad_prepagado.length;

    // TODO: CONTAR CANTIDAD Y DINERO, RECIBO CAJA
    for(var a=0; a<responsegetReporteDetallado.length; a++){
      if(responsegetReporteDetallado[a]['tipoVenta'].includes("RC.")){
        cantidad_recibo_caja.push(responsegetReporteDetallado[a]['nroBoleto']);
        this.monto_dinero_recibo_caja = this.monto_dinero_recibo_caja + responsegetReporteDetallado[a]['netoPagado'];
      }
    }
    cantidad_recibo_caja = [...new Set(cantidad_recibo_caja)];
    this.cantidad_recibo_caja = cantidad_recibo_caja.length;
  }

  tableToExcel(): void {
    $(".loader").fadeIn("slow");

    const header = ['RUTA', 'TIPO', 'N° COMPROB.', 'IMPORTE', 'USUARIO VENTA', 'ESTADO', 'FECHA VENTA', 'EMAIL PASAJERO', 'CORREO', 'N° OPERACION', 'OBSERVACIONES'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteDetallado.length; i++) {
      var tipo_movimiento = "";
      if(this.ListReporteDetallado[i]['tipo_movimiento'] == "EFECTIVO"){
        tipo_movimiento = "PAGADO";
      }else if(this.ListReporteDetallado[i]['tipo_movimiento'] == "RESERVA"){
        tipo_movimiento = "RESERVA";
      }else if(this.ListReporteDetallado[i]['tipo_movimiento'] == "ANULACION SISTEMA"){
        tipo_movimiento = "EXPIRADO";
      }else if(this.ListReporteDetallado[i]['tipo_movimiento'] == "ANULACION"){
        tipo_movimiento = "ANULADO";
      }

      const correo_enviado = this.ListReporteDetallado[i]['correo_enviado'];
      const numBoleto = this.ListReporteDetallado[i]['c_numboleto'];

      body.push([
        `${this.ListReporteDetallado[i]['origen']} - ${this.ListReporteDetallado[i]['destino']}`,
        `${this.ListReporteDetallado[i]['tipforpag']}`,
         numBoleto ? `${numBoleto}` : "",
        `${this.ListReporteDetallado[i]['n_imppag']}`,
        `${this.ListReporteDetallado[i]['c_login']}`,
        `${tipo_movimiento}`,
        `${this.ListReporteDetallado[i]['audfecins']}`,
        `${this.ListReporteDetallado[i]['email_pasajero']}`,
         correo_enviado == 1 ? "ENVIADO" : (correo_enviado == 0 || correo_enviado == 2 ? "NO ENVIADO" : ""),
        `${this.ListReporteDetallado[i]['n_numopeban']}`,
        `${this.ListReporteDetallado[i]['c_observaciones']}`
      ]);
    }

    this.funcionesService.exportarReporteExcel(header, body, 'ReporteVentasCallCenter');
    $(".loader").fadeOut("slow");
  }

  ver_venta_modal(dat: any){
    //console.log(dat);

    this.modal_venpas_id = dat['venpas_id'];
    if(dat['tipo_movimiento'] == "ANULACION SISTEMA"){
      this.modal_tipo_movimiento = "EXPIRADO";
    }else{
      this.modal_tipo_movimiento = dat['tipo_movimiento'];
    }
    this.modal_boleto = dat['c_numboleto'];
    this.modal_nro_control = dat['c_numcontrol'];
    this.modal_pasajero = dat['nombre_pasajero'];
    this.modal_nro_asiento = dat['n_numasiento'];
    this.modal_importe = dat['n_imppag'];
    this.modal_origen = dat['origen'];
    this.modal_destino = dat['destino'];
    this.modal_fecha_partida = dat['fecha_partida'];
    this.modal_hora_partida = dat['hora_partida'];
    if(dat['c_numboleto'] != null){
      if(dat['c_numboleto'].includes("FB")){
        this.modal_comprobante = "FACTURA";
      }else if(dat['c_numboleto'].includes("BB")){
        this.modal_comprobante = "BOLETA DE VENTA";
      }
    }else{
      this.modal_comprobante = "";
    }
    
    this.modal_forma_pago = dat['forpag'];
    this.modal_tipo_forma_pago = dat['tipforpag'];
    this.modal_operador_tarjeta = dat['opetarcre'];
    this.modal_tarjeta_credito = dat['tarcre'];
    this.modal_nro_operacion = dat['n_numopeban'];
    this.modal_usuario_venta = dat['c_login'];
    this.modal_fecha_expiracion = dat['fecha_exp_reserva'];
    this.modal_hora_expiracion = dat['hora_exp_reserva'];
    this.modal_fecha_hora_pago = dat['fecha_hora_pago'];
    this.modal_observaciones = dat['c_observaciones'];
    this.modal_url_pago = dat['url_pago'];
    this.modal_email_pasajero = dat['email_pasajero'];
    this.modal_sendmailpasajeros_id = dat['sendmailpasajeros_id'];
    this.modal_numoperacion = dat['n_numopeban'];
    this.modal_numero_cip = dat['numero_cip'];

    this.abrirModal('ModalVerVenta');
  }

  enviar_url_pago(){
    if(this.modal_email_pasajero != null){
      $(".loader").fadeIn("slow");

      var datos = {
        email: this.modal_email_pasajero,
        url_pago: this.modal_url_pago,
        numoperacion: this.modal_numoperacion
      }

      this.taskService.postEnviarUrlPago(datos).subscribe(responsepostEnviarUrlPago => {
        //console.log(responsepostEnviarUrlPago);
        if(Number(responsepostEnviarUrlPago) == 1){
          $(".loader").fadeOut("slow");
          this.cerrarModal('ModalVerVenta');
          this.funcionesService.notificacion_mensaje("Success", "Se envió el correo correctamente.");
          this.buscarReporteDetallado();
        }else{
          this.funcionesService.notificacion_mensaje("Error", "Hubo problemas al enviarse el correo.");
        }
      });
    }
  }

  abrirModal(nombreModal: string) {
    this.ArrayMostrarModal[nombreModal] = true;
    document.body.classList.add('overflow-x-hidden');
  }

  cerrarModal(nombreModal: string) {
      this.ArrayMostrarModal[nombreModal] = false;
      document.body.classList.remove('overflow-x-hidden');
  }
}