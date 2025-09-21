import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-confirmacion-pasajes',
  templateUrl: './confirmacion-pasajes.component.html',
  styleUrls: ['./confirmacion-pasajes.component.css']
})
export class ConfirmacionPasajesComponent implements OnInit {

  public innerWidth: any;

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  DatosPasajeros: any;
  ConfirmacionPasajes: any;

  ida_vuelta: number = 0;
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";

  servicioIda: string = "";
  fechaEmbarqueIda: string = "";
  horaEmbarqueIda: string = "";
  horaDesembarqueIda: string = "";
  agenciaEmbarqueIda: string = "";
  agenciaDesembarqueIda: string = "";
  servicioVuelta: string = "";
  fechaEmbarqueVuelta: string = "";
  horaEmbarqueVuelta: string = "";
  horaDesembarqueVuelta: string = "";
  agenciaEmbarqueVuelta: string = "";
  agenciaDesembarqueVuelta: string = "";
  subArrayFinal: any = [];

  arrayCliente: any = [];
  emailCliente: string = "";

  linkPagoLink: string = "";
  numPagoEfectivo: string = "";
  titulo_confirmar_pasaje: string = "Venta por Confirmar";

  nroOperacionPagoLink: string = "";
  ValErrorPagoLink: number = 0;         // 0 = CORRECTO, 1 = ERROR
  ValErrorPagoEfectivo: number = 0;     // 0 = CORRECTO, 1 = ERROR

  textoGenerado: string = "";

  constructor(private router:Router, private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService){
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
    this.anio = String(anio);

    this.hora_hoy = this.date.getHours() + ":" + this.date.getMinutes();
  }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit(){
    if(this.sharedService.getConfirmacionPasajes() == undefined){
      this.router.navigate(['operaciones/ventas-reserva/itinerario']);
    }else{
      $(".loader").fadeIn("slow");

      this.DatosPasajeros = this.sharedService.getDatosPasajeros();
      this.ConfirmacionPasajes = this.sharedService.getConfirmacionPasajes();

      console.log(this.DatosPasajeros);
      console.log(this.ConfirmacionPasajes);

      this.ida_vuelta = this.DatosPasajeros['ida_vuelta'];
      this.nombre_ciudad_origen = this.DatosPasajeros['nombre_ciudad_origen'];
      this.nombre_ciudad_destino = this.DatosPasajeros['nombre_ciudad_destino'];

      this.servicioIda = this.DatosPasajeros['servicioIda'];
      this.fechaEmbarqueIda = this.DatosPasajeros['fechaEmbarqueIda'];
      this.horaEmbarqueIda = this.DatosPasajeros['horaEmbarqueIda'];
      this.horaDesembarqueIda = this.DatosPasajeros['horaDesembarqueIda'];
      this.agenciaEmbarqueIda = this.DatosPasajeros['agenciaEmbarqueIda'];
      this.agenciaDesembarqueIda = this.DatosPasajeros['agenciaDesembarqueIda'];

      this.servicioVuelta = this.DatosPasajeros['servicioVuelta'];
      this.fechaEmbarqueVuelta = this.DatosPasajeros['fechaEmbarqueVuelta'];
      this.horaEmbarqueVuelta = this.DatosPasajeros['horaEmbarqueVuelta'];
      this.horaDesembarqueVuelta = this.DatosPasajeros['horaDesembarqueVuelta'];
      this.agenciaEmbarqueVuelta = this.DatosPasajeros['agenciaEmbarqueVuelta'];
      this.agenciaDesembarqueVuelta = this.DatosPasajeros['agenciaDesembarqueVuelta'];

      //************* MENSAJE  *************/
      //this.date_salida = this.funcionesService.convert_format_fecha_barra(this.DatosPasajeros['fechaEmbarqueIda']);
      this.arrayCliente = this.ConfirmacionPasajes['cliente'];
      this.emailCliente = this.ConfirmacionPasajes['ventaPasajeros'][0]['ventaIda']['emailContacto'];
      //************* MENSAJE  *************/

      this.subArrayFinal = this.ConfirmacionPasajes['ventaPasajeros'];

      this.generarTexto();

      this.mostrarPagoEfectivo(this.ConfirmacionPasajes);

      setTimeout(() => {
        this.ConfirmacionPasajes['descripcionVenta'] = this.textoGenerado;
      }, 1500);

      $(".loader").fadeOut("slow");
    }
  }

  mostrarPagoEfectivo(ConfirmacionPasajes: any){
    // ? El botón de PagoEfectivo solo estará habilitado para compras mayores e iguales a 86 soles.
    if(Number(ConfirmacionPasajes['montoTotal']) >= 86){
      $('#div_pago_efectivo').css('display', 'inline');

      var cont = 0;
      for(var a=0; a<ConfirmacionPasajes['ventaPasajeros'].length; a++){
        if(ConfirmacionPasajes['ventaPasajeros'][a]['ventaIda']['namePromocion'].includes("BBVA") || ConfirmacionPasajes['ventaPasajeros'][a]['ventaIda']['namePromocion'].includes("IBK") ||
           ConfirmacionPasajes['ventaPasajeros'][a]['ventaIda']['namePromocion'].includes("SCOT") || ConfirmacionPasajes['ventaPasajeros'][a]['ventaIda']['namePromocion'].includes("FALABELLA") || 
           ConfirmacionPasajes['ventaPasajeros'][a]['ventaIda']['namePromocion'].includes("BANCO DE LA NACION")){
          cont++;
        }

        if(ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta'] != null){
          if(ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta']['namePromocion'].includes("BBVA") || ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta']['namePromocion'].includes("IBK") ||
             ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta']['namePromocion'].includes("SCOT") || ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta']['namePromocion'].includes("FALABELLA") || 
             ConfirmacionPasajes['ventaPasajeros'][a]['ventaVuelta']['namePromocion'].includes("BANCO DE LA NACION")){
            cont++;
          }
        }
      }

      if(cont == 0){
        $('#div_pago_efectivo').css('display', 'inline');
      }else{
        $('#div_pago_efectivo').css('display', 'none');
      }
    }else{
      $('#div_pago_efectivo').css('display', 'none');
    }
  }

  pagarPaymentPagoEfectivo(TipForPago: number){
    if($('#texto_observaciones').val() != ""){
      $(".loader").fadeIn("slow");
      this.ConfirmacionPasajes['observaciones'] = $('#texto_observaciones').val();

      if(TipForPago == 4){                // TODO: PAGOLINK
        if(this.ValErrorPagoLink == 0){
          this.taskService.pagoLinkNiubiz(this.ConfirmacionPasajes).subscribe(responseRegistroVenta => {
            //console.log(responseRegistroVenta);
            if(responseRegistroVenta['result'] == true){
              this.linkPagoLink = responseRegistroVenta['mensaje'];
      
              this.confirmacionPasajes(TipForPago);
              this.ValErrorPagoLink = 0;
            }else{
              $(".loader").fadeOut("slow");
              this.funcionesService.notificacion_mensaje("Error", responseRegistroVenta['mensaje']);
              this.nroOperacionPagoLink = responseRegistroVenta['nroOperacion'];
              this.ValErrorPagoLink = 1;
              $('#texto_observaciones').prop('disabled', false);
            }
          }, error =>{
            this.funcionesService.notificacion_mensaje("Error", "Error al conectarse con la API - backendIntranet");
            $('#texto_observaciones').prop('disabled', false);
            $(".loader").fadeOut("slow");
          },() =>{});
        }else{
          this.taskService.pagoLinkNiubiz(this.ConfirmacionPasajes).subscribe(responseRegistroVenta => {
            //console.log(responseRegistroVenta);
            if(responseRegistroVenta['result'] == true){
              this.linkPagoLink = responseRegistroVenta['mensaje'];
      
              this.confirmacionPasajes(TipForPago);
              this.ValErrorPagoLink = 0;
            }else{
              $(".loader").fadeOut("slow");
              this.funcionesService.notificacion_mensaje("Error", responseRegistroVenta['mensaje']);
              this.nroOperacionPagoLink = responseRegistroVenta['nroOperacion'];
              this.ValErrorPagoLink = 1;
              $('#texto_observaciones').prop('disabled', false);
            }
          }, error =>{
            this.funcionesService.notificacion_mensaje("Error", "Error al conectarse con la API - backendIntranet");
            $('#texto_observaciones').prop('disabled', false);
            $(".loader").fadeOut("slow");
          },() =>{});
        }
      }else if(TipForPago == 11){         // TODO: PAGOEFECTIVO
        if(this.ValErrorPagoEfectivo == 0){
          this.taskService.pagoLinkPagoEfectivo(this.ConfirmacionPasajes).subscribe(responseRegistroVenta => {
            //console.log(responseRegistroVenta);
            if(responseRegistroVenta['result'] == true){
              this.numPagoEfectivo = responseRegistroVenta['mensaje'];
    
              this.confirmacionPasajes(TipForPago);
            }else{
              $(".loader").fadeOut("slow");
              this.funcionesService.notificacion_mensaje("Error", responseRegistroVenta['mensaje']);
              $('#texto_observaciones').prop('disabled', false);
            }
          }, error =>{
            this.funcionesService.notificacion_mensaje("Error", "Error al conectarse con la API - backendIntranet");
            $('#texto_observaciones').prop('disabled', false);
            $(".loader").fadeOut("slow");
          },() =>{});
        }else{
          this.taskService.pagoLinkPagoEfectivo(this.ConfirmacionPasajes).subscribe(responseRegistroVenta => {
            //console.log(responseRegistroVenta);
            if(responseRegistroVenta['result'] == true){
              this.numPagoEfectivo = responseRegistroVenta['mensaje'];
    
              this.confirmacionPasajes(TipForPago);
            }else{
              $(".loader").fadeOut("slow");
              this.funcionesService.notificacion_mensaje("Error", responseRegistroVenta['mensaje']);
              $('#texto_observaciones').prop('disabled', false);
            }
          }, error =>{
            this.funcionesService.notificacion_mensaje("Error", "Error al conectarse con la API - backendIntranet");
            $('#texto_observaciones').prop('disabled', false);
            $(".loader").fadeOut("slow");
          },() =>{});
        }
      }
    }else{
      this.funcionesService.notificacion_mensaje("Error", "Debe rellenar el campo de Observaciones para poder continuar.");      
    }
  }

  generarTexto(){                 // TODO: GENERAR TEXTO
    //var fecha_salida = this.funcionesService.convert_nom_fecha(this.date_salida);

    var cant_pass_total = 0;
    var cant_pass_ida = 0;
    var cant_pass_vuelta = 0;
    for(var a=0; a<this.subArrayFinal.length; a++){
      if(this.subArrayFinal[a]['ventaIda'] != null){
        cant_pass_ida++;
      }
      if(this.subArrayFinal[a]['ventaVuelta'] != null){
        cant_pass_vuelta++;
      }
    }

    cant_pass_total = cant_pass_ida + cant_pass_vuelta;
    var cantidad_pasajes = "";
    if(cant_pass_total == 1){
      cantidad_pasajes = "1 pasaje";
    }else{
      cantidad_pasajes = cant_pass_total+" pasajes";
    }

    var tipo_comprobante = "";
    if(this.arrayCliente == null){
      tipo_comprobante = '<b>'+"BOLETA"+'</b><br>';
    }else{
      tipo_comprobante = '<b>'+'FACTURA'+'</b><br> <b>RUC: '+this.arrayCliente['nroDoc']+'</b>, perteneciente a la empresa: <b>'+this.arrayCliente['razonSocial']+'</b>, ubicado en: <b>'+this.arrayCliente['direccion']+'</b><br>';
    }

    var servicio_itinerario = "";
    if(cant_pass_ida > 0){
      servicio_itinerario = ' Servicio de ida <b>'+this.servicioIda+'</b>, con Itinerario: <b>'+this.nombre_ciudad_origen+' - '+this.nombre_ciudad_destino+'</b> para el día '+this.funcionesService.convert_nom_fecha(this.fechaEmbarqueIda)+' del '+this.anio+' a las '+this.horaEmbarqueIda+' con embarque en la agencia de <b>'+this.agenciaEmbarqueIda+'</b>, y desembarque en la agencia de <b>'+this.agenciaDesembarqueIda+'</b>.<br>';
      if(cant_pass_vuelta != 0){
        servicio_itinerario = ' Servicio de ida <b>'+this.servicioIda+'</b>, con Itinerario: <b>'+this.nombre_ciudad_origen+' - '+this.nombre_ciudad_destino+'</b> para el día '+this.funcionesService.convert_nom_fecha(this.fechaEmbarqueIda)+' del '+this.anio+' a las '+this.horaEmbarqueIda+' con embarque en la agencia de <b>'+this.agenciaEmbarqueIda+'</b>, y desembarque en la agencia de <b>'+this.agenciaDesembarqueIda+'</b>.<br>'+
                              ' Servicio de retorno <b>'+this.servicioVuelta+'</b>, con Itinerario: <b>'+this.nombre_ciudad_destino+' - '+this.nombre_ciudad_origen+'</b> para el día '+this.funcionesService.convert_nom_fecha(this.fechaEmbarqueVuelta)+' del '+this.anio+' a las '+this.horaEmbarqueVuelta+' con embarque en la agencia de <b>'+this.agenciaEmbarqueVuelta+'</b>, y desembarque en la agencia de <b>'+this.agenciaDesembarqueVuelta+'</b>.';
      }
    }
    
    $('#texto_venta_pasaje').html('Siendo hoy,' + ' <b>' + this.funcionesService.convert_nom_fecha(this.date_actual) + ' a las '+this.hora_hoy+'</b>' + ' se procede a realizar la venta de' + ' <b>' + cantidad_pasajes + '</b>' + ' con tipo de comprobante ' + tipo_comprobante + servicio_itinerario);
    this.textoGenerado = 'Siendo hoy,' + ' <b>' + this.funcionesService.convert_nom_fecha(this.date_actual) + ' a las '+this.hora_hoy+'</b>' + ' se procede a realizar la venta de' + ' <b>' + cantidad_pasajes + '</b>' + ' con tipo de comprobante ' + tipo_comprobante + servicio_itinerario;
  }

  confirmacionPasajes(TipForPago: number){
    if(TipForPago == 4){            // TODO: TARJETA PAGO LINK
      setTimeout(() => {
        $('#div_pago_tarjetas').css('display', 'none');
        $('#div_pago_efectivo').css('display', 'none');
        $('#card_pagolink').css('display', 'block');
        $('#btn_atras').css('display', 'none');
        $('#btn_nueva_venta').css('display', 'inline');
        this.titulo_confirmar_pasaje = "Venta Confirmada";
        $('#texto_observaciones').prop('disabled', true);
        $(".loader").fadeOut("slow");
      }, 2000);
    }else if(TipForPago == 11){     // TODO: PAGOEFECTIVO
      setTimeout(() => {
        $('#div_pago_tarjetas').css('display', 'none');
        $('#div_pago_efectivo').css('display', 'none');
        $('#card_pagoefectivo').css('display', 'block');
        $('#btn_atras').css('display', 'none');
        $('#btn_nueva_venta').css('display', 'inline');
        this.titulo_confirmar_pasaje = "Venta Confirmada";
        $('#texto_observaciones').prop('disabled', true);
        $(".loader").fadeOut("slow");
      }, 2000);
    }
  }

  clickParaCopiarPagoLink(){
    $('#card_pagolink').css('background-color', '#17C653');
    $('#texto_card_pagolink0').css('color', 'white');
    $('#texto_card_pagolink').css('color', 'white');
    $('#icono1_card_pagolink').css('display', 'none');
    $('#icono2_card_pagolink').css('display', 'inline');

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(this.linkPagoLink).select();
    document.execCommand("copy");
    $temp.remove();

    setTimeout(() => {
      $('#card_pagolink').css('background-color', 'white');
      $('#texto_card_pagolink0').css('color', '#1B84FF');
      $('#texto_card_pagolink').css('color', '#1B84FF');
      $('#icono1_card_pagolink').css('display', 'inline');
      $('#icono2_card_pagolink').css('display', 'none');
    }, 8000);
  }

  clickParaCopiarPagoEfectivo(){
    $('#card_pagoefectivo').css('background-color', '#fecc00');
    $('#texto_card_pagoefectivo0').css('color', '#000000');
    $('#texto_card_pagoefectivo').css('color', '#000000');
    $('#icono1_card_pagoefectivo').css('display', 'none');
    $('#icono2_card_pagoefectivo').css('display', 'inline');

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(this.numPagoEfectivo).select();
    document.execCommand("copy");
    $temp.remove();

    setTimeout(() => {
      $('#card_pagoefectivo').css('background-color', 'white');
      $('#texto_card_pagoefectivo0').css('color', '#ff6719');
      $('#texto_card_pagoefectivo').css('color', '#ff6719');
      $('#icono1_card_pagoefectivo').css('display', 'inline');
      $('#icono2_card_pagoefectivo').css('display', 'none');
    }, 8000);
  }

  btn_atras(){
    this.sharedService.enviarRegresarDatosPasajeros(this.ConfirmacionPasajes);
    this.router.navigate(['operaciones/ventas-reserva/datos-pasajeros']);
  }

  btn_nuevo(){
    this.sharedService.enviarConfirmacionPasajes(undefined);
    this.router.navigate(['operaciones/ventas-reserva/itinerario']);
  }
}