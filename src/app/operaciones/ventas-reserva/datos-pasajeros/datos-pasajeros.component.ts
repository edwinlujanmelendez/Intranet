import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-datos-pasajeros',
  templateUrl: './datos-pasajeros.component.html',
  styleUrls: ['./datos-pasajeros.component.css']
})
export class DatosPasajerosComponent implements OnInit {

  public innerWidth: any;

  num_paso: number = 3;
  paso_final: number = 3;
  porcen_bar: number = 100;
  detalle_paso: string = "Datos y Pago";
  detalle_paso2: string = "";
  sub_titulo: string = "Ingresar datos del pasajero.";

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  DatosPasajeros: any;

  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";

  idServicioIda: number = 0;
  servicioIda: string = "";
  idItinerarioIda: number = 0;
  idRutaIda: number = 0;
  fechaEmbarqueIda: string = "";
  fechaDesembarqueIda: string = "";
  nombreFechaIda: string = "";
  horaEmbarqueIda: string = "";
  horaDesembarqueIda: string = "";
  agenciaEmbarqueIda: string = "";
  agenciaDesembarqueIda: string = "";
  direccionEmbarqueIda: string = "";
  direccionDesembarqueIda: string = "";
  idAgenciaEmbarqueIda: number = 0;
  idAgenciaDesembarqueIda: number = 0;

  idServicioVuelta: number = 0;
  servicioVuelta: string = "";
  idItinerarioVuelta: number = 0;
  idRutaVuelta: number = 0;
  fechaEmbarqueVuelta: string = "";
  fechaDesembarqueVuelta: string = "";
  nombreFechaVuelta: string = "";
  horaEmbarqueVuelta: string = "";
  horaDesembarqueVuelta: string = "";
  agenciaEmbarqueVuelta: string = "";
  agenciaDesembarqueVuelta: string = "";
  direccionEmbarqueVuelta: string = "";
  direccionDesembarqueVuelta: string = "";
  idAgenciaEmbarqueVuelta: number = 0;
  idAgenciaDesembarqueVuelta: number = 0;

  pasajero_asientos: Array<{asiento_ida: string, asiento_vuelta: string, precio_ida: any, precio_vuelta: any, piso_ida: number, piso_vuelta: number, porcentaje_descuento_ida: number, porcentaje_descuento_vuelta: number, tipo_descuento_ida: string, tipo_descuento_vuelta: string}> = [];
  pasajero_asientos_ida: Array<{asiento: string, precio: any, piso: number}> = [];
  pasajero_asientos_vuelta: Array<{asiento: string, precio: any, piso: number}> = [];
  precio_pasajeros_asientos_ida: number = 0;
  cant_pasajeros_asientos_ida: number = 0;
  list_pasajeros_asientos_ida: string = "";
  cant_pasajeros_asientos_vuelta: number = 0;
  precio_pasajeros_asientos_vuelta: number = 0;
  list_pasajeros_asientos_vuelta: string = "";
  precio_total_pasajeros_asientos: number = 0;
  num_asientos_ida: string = "";
  num_asientos_vuelta: string = "";

  tipos_documentos: any;

  datos_infante_detalle: any = [];
  lista_infante_detalle: any = [];
  errorDatosInfante: number = 0;
  listaArrayAdultosSeleccion: any = [];
  listaDocumentApoderados: any = [];

  tiempoPagoPasarelaWeb: number = 0;
  myIp: string = "";
  code_pais: string = "51";

  nameCupon: string = "";
  cuponActivo: number = 0;

  tituloMensajeAlerta: string = "";
  textoMensajeAlerta: string = "";

  ida_vuelta: number = 0;

  validarcampos: boolean = true;
  ventaIdaVuelta: any = [];
  arrayCliente: any = [];
  ArrayFinal: any = [];
  subArrayFinal: any = [];

  idAgencia: number = 0;
  idUsuarioSispas: number = 0;
  usuarioSispas: string = "";
  idHardwareSispas: number = 0;
  canalVenta: number = 0;
  fechaLiquidacion: string = "";

  promocionesVentas: any = [];
  promocionesVentasRuc: any = [];
  promocionVentasActiva: any = [];
  flagPromocionVentas: number = 0;
  promocionVentasId: number = 0;

  promocionActiva: number = 0;

  precio_pasajeros_asientos_ida_original: number = 0;
  precio_pasajeros_asientos_vuelta_original: number = 0;
  precio_total_pasajeros_asientos_original: number = 0;

  namePromocionVenta: string = "";
  porcentajeDescuentoPromocionVenta: any = 0;
  porcentajeRestantePromocionVenta: any = 0;
  tipoDescuentoPromocionVenta: string = "";

  max_length_ruc: number = 0;

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
    this.max_length_ruc = this.taskService.MAX_LENGTH_RUC;
  }

  ngAfterViewInit(){
    if(this.sharedService.getDatosPasajeros() == undefined){
      this.router.navigate(['operaciones/ventas-reserva/itinerario']);
    }else{
      $(".loader").fadeIn("slow");

      this.DatosPasajeros = this.sharedService.getDatosPasajeros();
      //console.log(this.DatosPasajeros);
    
      this.taskService.getTipoDocumento().subscribe(response => {
        this.tipos_documentos = response;
      });

      this.nombre_ciudad_origen = this.textCapitalize(this.DatosPasajeros['nombre_ciudad_origen']);
      this.nombre_ciudad_destino = this.textCapitalize(this.DatosPasajeros['nombre_ciudad_destino']);
      
      this.ida_vuelta = this.DatosPasajeros['ida_vuelta'];
      this.num_asientos_ida = this.DatosPasajeros['numAsientosIda'];
      this.num_asientos_vuelta = this.DatosPasajeros['numAsientosVuelta'];

      this.idItinerarioIda = this.DatosPasajeros['idItinerarioIda'];
      this.idRutaIda = this.DatosPasajeros['idRutaIda'];
      this.idServicioIda = this.DatosPasajeros['idServicioIda'];
      this.servicioIda = this.DatosPasajeros['servicioIda'];
      this.idAgenciaEmbarqueIda = this.DatosPasajeros['idAgenciaEmbarqueIda'];
      this.agenciaEmbarqueIda = this.DatosPasajeros['agenciaEmbarqueIda'];
      this.fechaEmbarqueIda = this.DatosPasajeros['fechaEmbarqueIda'];
      this.nombreFechaIda = this.funcionesService.convert_nom_fecha(this.DatosPasajeros['fechaEmbarqueIda']);
      this.horaEmbarqueIda = this.DatosPasajeros['horaEmbarqueIda'];
      this.idAgenciaDesembarqueIda = this.DatosPasajeros['idAgenciaDesembarqueIda'];
      this.direccionDesembarqueIda = this.DatosPasajeros['direccionDesembarqueIda'];
      this.fechaDesembarqueIda = this.DatosPasajeros['fechaDesembarqueIda'];
      this.horaDesembarqueIda = this.DatosPasajeros['horaDesembarqueIda'];

      if(this.DatosPasajeros['idItinerarioVuelta'] == ""){ this.idItinerarioVuelta = 0; }else{ this.idItinerarioVuelta = this.DatosPasajeros['idItinerarioVuelta']};
      if(this.DatosPasajeros['idRutaVuelta'] == ""){ this.idRutaVuelta = 0; }else{ this.idRutaVuelta = this.DatosPasajeros['idRutaVuelta']};
      if(this.DatosPasajeros['idServicioVuelta'] == ""){ this.idServicioVuelta = 0; }else{ this.idServicioVuelta = this.DatosPasajeros['idServicioVuelta']};
      this.servicioVuelta = this.DatosPasajeros['servicioVuelta'];
      this.idAgenciaEmbarqueVuelta = this.DatosPasajeros['idAgenciaEmbarqueVuelta'];
      this.agenciaEmbarqueVuelta = this.DatosPasajeros['agenciaEmbarqueVuelta'];
      if(this.DatosPasajeros['fechaEmbarqueVuelta'] == ""){ this.fechaEmbarqueVuelta = "0"; }else{ this.fechaEmbarqueVuelta = this.DatosPasajeros['fechaEmbarqueVuelta']};
      this.nombreFechaVuelta = this.funcionesService.convert_nom_fecha(this.DatosPasajeros['fechaEmbarqueVuelta']);
      this.horaEmbarqueVuelta = this.DatosPasajeros['horaEmbarqueVuelta'];
      this.idAgenciaDesembarqueVuelta = this.DatosPasajeros['idAgenciaDesembarqueVuelta'];
      this.direccionDesembarqueVuelta = this.DatosPasajeros['direccionDesembarqueVuelta'];
      this.fechaDesembarqueVuelta = this.DatosPasajeros['fechaDesembarqueVuelta'];
      this.horaDesembarqueVuelta = this.DatosPasajeros['horaDesembarqueVuelta'];

      if(this.ida_vuelta == 1){
        this.num_paso = 3;
        this.paso_final = 3;
      }else{
        this.num_paso = 5;
        this.paso_final = 5;
      }

      let StorageLiquidacion = JSON.parse(localStorage.getItem('StorageLiquidacion') || '{}');
      let StorageUsuarioHardware = JSON.parse(localStorage.getItem('StorageUsuarioHardware') || '{}');
      let StorageRol = JSON.parse(localStorage.getItem('StorageRol') || '{}');

      if(JSON.stringify(StorageLiquidacion)!="{}"){
        //console.log(StorageLiquidacion);
        this.idAgencia = StorageLiquidacion['agencia_id'];
        this.idUsuarioSispas = StorageLiquidacion['usuario_id'];
        this.usuarioSispas = StorageLiquidacion['c_nomusu'];
        this.canalVenta = StorageUsuarioHardware['canalVenta']['id'];
        this.fechaLiquidacion = this.funcionesService.convert_format_fecha_barra(StorageLiquidacion['d_fecliq']);
        this.idHardwareSispas = StorageUsuarioHardware['usuhard_id'];
      }

      this.taskService.getMyIp().subscribe(responseIp => {
        this.myIp = responseIp['ip'];
      });

      // TODO: MUESTRAS LA LISTA DE PROMOCIONES PARA VENTAS SI TIENEN EL ROL DE CALL CENTER Y CALL CENTER EMI.
      /*var rol_call_center = [18, 29];
      if(!rol_call_center.includes(Number(StorageRol['rol_id']))){
        $('#div_lista_promociones_ventas').css('display', 'none');
      }*/

      // TODO: CARGANDO LISTA DE PROMOCIONES
      //console.log(this.canalVenta);
      //this.taskService.getPromocionesVentasReservas(this.canalVenta).subscribe(responsePromocionesVentasReservas => {
      //  this.promocionesVentas = responsePromocionesVentasReservas;
      //});

      // TODO: CARGANDO LISTA DE PROMOCIONES TARJETAS
      //console.log(this.idItinerarioIda + "|" + this.idRutaIda + "|" + this.fechaEmbarqueIda);
      //console.log(this.idItinerarioVuelta + "|" + this.idRutaVuelta + "|" + this.fechaEmbarqueVuelta);
      
      this.promocionesVentas = [];
      this.taskService.getPromocionesSispas(this.idItinerarioIda, this.idRutaIda, this.idServicioIda, this.fechaEmbarqueIda, this.idItinerarioVuelta, this.idRutaVuelta, this.idServicioVuelta, this.fechaEmbarqueVuelta).subscribe(responsePromocionesSispas => {
        //console.log(responsePromocionesSispas);
        //this.promocionesVentas = responsePromocionesSispas;

        this.promocionesVentas = Array.from(
          new Map(responsePromocionesSispas.map(p => [p.promocion_id, p])).values()
        );

        //console.log(unicos);
      });

      /*************************** PASAJEROS ***************************/
      if(this.num_asientos_ida.includes(",") || this.num_asientos_ida!=""){
        var part_asi = this.num_asientos_ida.split(",");
        if(part_asi.length != 0){
          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = part_asi[a].toString().split("-");

            var array = {asiento: part_asi2[0], precio: this.DatosPasajeros['precioAsientosIda'][a], piso: Number(part_asi2[1])};
            this.pasajero_asientos_ida.push(array);
          }
        }
      }

      if(this.num_asientos_vuelta.includes(",") || this.num_asientos_vuelta!=""){
        var part_asi = this.num_asientos_vuelta.split(",");
        if(part_asi.length != 0){
          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = part_asi[a].toString().split("-");

            var array = {asiento: part_asi2[0], precio: this.DatosPasajeros['precioAsientosVuelta'][a], piso: Number(part_asi2[1])};
            this.pasajero_asientos_vuelta.push(array);
          }
        }
      }

      if((this.num_asientos_ida.includes(",") || this.num_asientos_ida!="") && (this.num_asientos_vuelta.includes(",") || this.num_asientos_vuelta!="")){
        var part_asi_ida = this.num_asientos_ida.split(",");
        var part_asi_vuelta = this.num_asientos_vuelta.split(",");
        if(part_asi_ida.length != 0){
          for(var a=0; a<part_asi_ida.length; a++){
            var part_asi_ida2 = part_asi_ida[a].toString().split("-");
            var part_asi_vuelta2 = part_asi_vuelta[a].toString().split("-");

            var array_ida_vuelta = {asiento_ida: part_asi_ida2[0], asiento_vuelta: part_asi_vuelta2[0], precio_ida: this.DatosPasajeros['precioAsientosIda'][a], precio_vuelta: this.DatosPasajeros['precioAsientosVuelta'][a], piso_ida: Number(part_asi_ida2[1]), piso_vuelta: Number(part_asi_vuelta2[1]), porcentaje_descuento_ida: 0, porcentaje_descuento_vuelta: 0, tipo_descuento_ida: '', tipo_descuento_vuelta: ''};
            this.pasajero_asientos.push(array_ida_vuelta);
          }
        }
      }

      if((this.num_asientos_ida.includes(",") || this.num_asientos_ida!="") && this.num_asientos_vuelta==""){
        var part_asi_ida = this.num_asientos_ida.split(",");
        if(part_asi_ida.length != 0){
          for(var a=0; a<part_asi_ida.length; a++){
            var part_asi_ida2 = part_asi_ida[a].toString().split("-");

            var array_ida_vuelta = {asiento_ida: part_asi_ida2[0], asiento_vuelta: '', precio_ida: this.DatosPasajeros['precioAsientosIda'][a], precio_vuelta: this.DatosPasajeros['precioAsientosVuelta'][a], piso_ida: Number(part_asi_ida2[1]), piso_vuelta: 0, porcentaje_descuento_ida: 0, porcentaje_descuento_vuelta: 0, tipo_descuento_ida: '', tipo_descuento_vuelta: ''};
            this.pasajero_asientos.push(array_ida_vuelta);
          }
        }
      }

      for(var a=0; a<this.pasajero_asientos_ida.length; a++){
        this.pasajero_asientos_ida[a].asiento;
        if(a==0){ this.list_pasajeros_asientos_ida = this.pasajero_asientos_ida[a].asiento;
        }else{ this.list_pasajeros_asientos_ida = this.list_pasajeros_asientos_ida + "," + this.pasajero_asientos_ida[a].asiento;
        }
        this.precio_pasajeros_asientos_ida = Number(this.pasajero_asientos_ida[a].precio) + this.precio_pasajeros_asientos_ida;
        this.cant_pasajeros_asientos_ida++;
      }

      for(var a=0; a<this.pasajero_asientos_vuelta.length; a++){
        this.pasajero_asientos_vuelta[a].asiento;
        if(a==0){ this.list_pasajeros_asientos_vuelta = this.pasajero_asientos_vuelta[a].asiento;
        }else{ this.list_pasajeros_asientos_vuelta = this.list_pasajeros_asientos_vuelta + "," + this.pasajero_asientos_vuelta[a].asiento;
        }
        this.precio_pasajeros_asientos_vuelta = Number(this.pasajero_asientos_vuelta[a].precio) + this.precio_pasajeros_asientos_vuelta;
        this.cant_pasajeros_asientos_vuelta++;
      }

      this.precio_total_pasajeros_asientos = this.precio_pasajeros_asientos_ida + this.precio_pasajeros_asientos_vuelta;
      /*************************** PASAJEROS ***************************/

      this.precio_pasajeros_asientos_ida_original = this.precio_pasajeros_asientos_ida;
      this.precio_pasajeros_asientos_vuelta_original = this.precio_pasajeros_asientos_vuelta;
      this.precio_total_pasajeros_asientos_original = this.precio_total_pasajeros_asientos;

      /*************************************************************************************************************/
      setTimeout(() => {
        if(this.sharedService.getRegresarDatosPasajeros() != undefined){
          var RegresarDatosPasajeros = this.sharedService.getRegresarDatosPasajeros()
          
          //console.log(RegresarDatosPasajeros);
          //console.log(this.pasajero_asientos);

          for(var ab=0; ab<this.pasajero_asientos.length; ab++){
            var id_add = this.pasajero_asientos[ab]['asiento_ida']+"_"+this.pasajero_asientos[ab]['asiento_vuelta'];

            for(var cd=0; cd<RegresarDatosPasajeros['ventaPasajeros'].length; cd++){
              var add_id = "";

              if(this.ida_vuelta == 1){
                add_id = RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['nroAsiento']+"_";
              }else if(this.ida_vuelta == 2){
                add_id = RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['nroAsiento']+"_"+RegresarDatosPasajeros['ventaPasajeros'][ab]['ventaVuelta']['nroAsiento'];
              }

              if(id_add == add_id){
                var pasajero = RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['pasajero'];
                console.log(pasajero);
                if(RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['idParentesco'] != 4 && RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['tipoPasajero'] != 3){
                  $('#selectTipDoc_'+id_add).val(pasajero['idTipoDocumento']);
                  $('#txtdocumento_'+id_add).val(pasajero['numDocumento']);
                  $('#txtidpasajero_'+id_add).val(pasajero['idpasajero']);
                  $('#txtflagws_'+id_add).val(pasajero['flagWS']);
                  $('#txtnombres_'+id_add).val(pasajero['nombre']);
                  $('#txtapellidos_'+id_add).val(pasajero['apePaterno'] + " " + pasajero['apeMaterno']);
                  $('#fecha_nacimiento_'+id_add).val(this.funcionesService.convert_format_fecha_guion(pasajero['fechanacimiento']));        //anio - mes dia
                  if(pasajero['genero'] == 1){
                    $("#inlineRadio_"+id_add+"_1").prop('checked', true);
                    $("#inlineRadio_"+id_add+"_2").prop('checked', false);
                  }else if(pasajero['genero'] == 2){
                    $("#inlineRadio_"+id_add+"_1").prop('checked', false);
                    $("#inlineRadio_"+id_add+"_2").prop('checked', true);
                  }

                  this.aceptar_fecha_nacimiento(id_add);

                  $('#flexSwitchCheckInfante_'+add_id).prop("checked", false);
                  $('#datos_detalle_infante_'+add_id).css('display', 'none');
                }

                if(RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['idParentesco'] == 4 && RegresarDatosPasajeros['ventaPasajeros'][cd]['ventaIda']['tipoPasajero'] == 3){
                  var datos_infante_detalle = {
                    "id": add_id,
                    "selectTipDocInfante": Number(pasajero['idTipoDocumento']),
                    "selectTipVinculo": $("#selectTipVinculo").val(),
                    "txtdocumentoInfante": pasajero['numDocumento'],
                    "txtnombresInfante": pasajero['nombre'],
                    "txtapellidosInfante": pasajero['apePaterno'] + " " + pasajero['apeMaterno'],
                    "fecha_nacimiento_infante": pasajero['fechanacimiento'],
                    "idpasajeroInfante": pasajero['idpasajero'],
                    "generoInfante": pasajero['genero'],
                    "flagwsInfante": String(pasajero['flagWS'])
                  };
              
                  this.lista_infante_detalle.push(datos_infante_detalle);

                  $('#flexSwitchCheckInfante_'+add_id).prop("checked", true);
                  $('#datos_detalle_infante_'+add_id).css('display', 'block');

                  $('#btn_agregar_infante_'+add_id).css('display', 'none');
                  $('#btn_verdatos_infante_'+add_id).css('display', 'inline');
                  $('#btn_editar_infante_'+add_id).css('display', 'inline');
                  $('#btn_eliminar_infante_'+add_id).css('display', 'inline');

                  $('#dni_datos_infante_'+add_id).val(pasajero['numDocumento']);
                }
              }
            }
          }

          $('#emailDatosContacto').val(RegresarDatosPasajeros['ventaPasajeros'][0]['ventaIda']['emailContacto']);
          $('#numeroDatosContacto').val(RegresarDatosPasajeros['ventaPasajeros'][0]['ventaIda']['telefonoOpcional']);

          if(RegresarDatosPasajeros['cliente'] != null){
            $('#chkSolicitaFactura').prop("checked", true);
            $('#detalle_factura').css('display', 'block');

            $('#idclienteSolicitaFactura').val(RegresarDatosPasajeros['cliente']['idcliente']);
            $('#flagSolicitaFactura').val(RegresarDatosPasajeros['cliente']['flag']);
            $('#rucSolicitaFactura').val(RegresarDatosPasajeros['cliente']['nroDoc']);
            $('#razonSolicitaFactura').val(RegresarDatosPasajeros['cliente']['razonSocial']);
            $('#direccionSolicitaFactura').val(RegresarDatosPasajeros['cliente']['direccion']);

            this.buscarPromocionesRuc(RegresarDatosPasajeros['cliente']['idcliente']);
          }

          $(".loader").fadeOut("slow");
        }else{
          $(".loader").fadeOut("slow");
        }
      }, 100);
      /*************************************************************************************************************/
    }
  }

  validarCampos(sector: number){
    if(isPlatformBrowser(this.platformId)){
      /************************************ VALIDAR CAMPOS VACIOS ************************************/
      if(sector == 1){
        for(var a=0; a<this.pasajero_asientos.length; a++){
          var camp_txtdocumento = "txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtnombres = "txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtapellidos = "txtapellidos_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtedad = "edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var camp_txtfechanacimiento = "fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var rd_radio_1 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_1";
          var rd_radio_2 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_2";
          var chk_vincular_infante = "flexSwitchCheckInfante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var input_vincular_infante = "dni_datos_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var btn_vincular_infante = "btn_agregar_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var chk_vincular_apoderado = "flexSwitchCheckInfante2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var input_vincular_apoderado = "";
          if(this.pasajero_asientos.length == 1){
            input_vincular_apoderado = "TipDocApoderado1_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          }else{
            input_vincular_apoderado = "TipDocApoderado2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          }

          if($('#'+camp_txtdocumento).val() == ""){
            $('#'+camp_txtdocumento).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtdocumento).removeClass("empty_datos");
          }

          if($('#'+camp_txtnombres).val() == ""){
            $('#'+camp_txtnombres).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtnombres).removeClass("empty_datos");
          }

          if($('#'+camp_txtapellidos).val() == ""){
            $('#'+camp_txtapellidos).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtapellidos).removeClass("empty_datos");
          }

          if($('#'+camp_txtfechanacimiento).val() == "" || $('#'+camp_txtfechanacimiento).val() == "NaN"){
            $('#'+camp_txtfechanacimiento).addClass("empty_datos");
            return false;
          }else{
            $('#'+camp_txtfechanacimiento).removeClass("empty_datos");
          }

          if($('#'+rd_radio_1).is(":checked") == false && $('#'+rd_radio_2).is(":checked") == false){
            $('#'+rd_radio_1).addClass("empty_datos");
            $('#'+rd_radio_2).addClass("empty_datos");
            return false;
          }else{
            $('#'+rd_radio_1).removeClass("empty_datos");
            $('#'+rd_radio_2).removeClass("empty_datos");
          }
          
          if($('#'+chk_vincular_infante).is(":checked") == true){
            if($('#'+input_vincular_infante).val() == ""){
              $('#'+btn_vincular_infante).addClass("empty_datos");
              return false;
            }
          }else{
            $('#'+btn_vincular_infante).removeClass("empty_datos");
          }

          if($('#'+chk_vincular_apoderado).is(":checked") == true){
            if($('#'+input_vincular_apoderado).val() == ""){
              $('#'+input_vincular_apoderado).addClass("empty_datos");
              return false;
            }
          }else{
            $('#'+input_vincular_apoderado).removeClass("empty_datos");
          }
        }

        if($('#emailDatosContacto').val() == "" || this.funcionesService.validarEmail($('#emailDatosContacto').val()) == false){
          $('#emailDatosContacto').addClass("empty_datos");
          return false;
        }else{
          $('#emailDatosContacto').removeClass("empty_datos");
        }

        if(String($('#numeroDatosContacto').val()) == ""){
          $('#numeroDatosContacto').addClass("empty_datos");
          return false;
        }else{
          $('#numeroDatosContacto').removeClass("empty_datos");
        }
      }
      /************************************ VALIDAR CAMPOS VACIOS ************************************/

      if(sector == 2){
        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() == "" && $('#direccionSolicitaFactura').val() == ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() == "" && $('#direccionSolicitaFactura').val() != ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        if($('#rucSolicitaFactura').val() != "" && $('#razonSolicitaFactura').val() != "" && $('#direccionSolicitaFactura').val() == ""){
          $('#rucSolicitaFactura').addClass("empty_datos");
          return false;
        }else{
          $('#rucSolicitaFactura').removeClass("empty_datos");
        }

        if($('#chktermcond_1').is(":checked") == false){
          $('#chktermcond_1').addClass("empty_datos");
          return false;
        }else{
          $('#chktermcond_1').removeClass("empty_datos");
        }
      }
    }
    return true;
  }

  ConfirmarCompra(){
    var val1 = this.validarCampos(1);
    var val2 = this.validarCampos(2);
    
    if(val1 == true && val2 == true){
      $(".loader").fadeIn("slow");
      $('#div_seleccion_itinerario').css('display', 'none');
      $('#div_estructura_bus_ida').css('display', 'none');
      $('#div_datos_pasajeros').css('display', 'none');

      //console.log(this.crear_array_final());

      this.sharedService.enviarConfirmacionPasajes(this.crear_array_final());
      this.router.navigate(['operaciones/ventas-reserva/confirmacion-pasajes']);
    }else{
      this.funcionesService.notificacion_mensaje("Warning", "Debe completar todos los datos para poder continuar.");
    }
  }

  crear_array_final(){
    if(isPlatformBrowser(this.platformId)){
      this.validarcampos = this.validarCampos(2);
      if(this.validarcampos == true){
        /*************************************************** ARRAY FINAL ***************************************************/
        this.ventaIdaVuelta = [];
        this.arrayCliente = [];
        this.subArrayFinal = [];
        this.ArrayFinal = [];

        for(var a=0; a<this.pasajero_asientos.length; a++){
          var id_variable_pasajero = this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
          var part_apell = String($("#txtapellidos_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()).split(" ");

          var tarifaIda = 0;
          var descuentoIda = 0;
          var impPagadoIda = 0;
          var tarifaVuelta = 0;
          var descuentoVuelta = 0;
          var impPagadoVuelta = 0;
          var namePromocionIda = "";
          var descuentoPromocionIda = "";
          var namePromocionVuelta = "";
          var descuentoPromocionVuelta = "";
          var promocionIdIda = 0;
          var promocionIdVuelta = 0;

          if(this.flagPromocionVentas == 1){
            if(this.pasajero_asientos[a]['porcentaje_descuento_ida'] != 0){
              if(this.pasajero_asientos[a]['tipo_descuento_ida'] == "P"){
                tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
                impPagadoIda = Number(Number(Number(this.pasajero_asientos[a]['precio_ida'])*this.porcentajeRestantePromocionVenta/100).toFixed(2));
                descuentoIda = Number(Number(tarifaIda - impPagadoIda).toFixed(2));
                namePromocionIda = this.namePromocionVenta;
                descuentoPromocionIda = this.porcentajeDescuentoPromocionVenta+" %";
                promocionIdIda = this.promocionVentasId;
              }else if(this.pasajero_asientos[a]['tipo_descuento_ida'] == "S"){
                tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
                descuentoIda = this.pasajero_asientos[a]['porcentaje_descuento_ida'];
                impPagadoIda = tarifaIda - descuentoIda;
                namePromocionIda = this.namePromocionVenta;
                descuentoPromocionIda = "S/. "+this.porcentajeDescuentoPromocionVenta;
                promocionIdIda = this.promocionVentasId;
              }
            }else{
              tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
              descuentoIda = 0;
              impPagadoIda = Number(this.pasajero_asientos[a]['precio_ida']);
            }
            
            if(this.ida_vuelta == 2){
              if(this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] != 0){
                if(this.pasajero_asientos[a]['tipo_descuento_vuelta'] == "P"){
                  tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
                  impPagadoVuelta = Number(Number(Number(this.pasajero_asientos[a]['precio_vuelta'])*this.porcentajeRestantePromocionVenta/100).toFixed(2));
                  descuentoVuelta = Number(Number(tarifaVuelta - impPagadoVuelta).toFixed(2));
                  namePromocionVuelta = this.namePromocionVenta;
                  descuentoPromocionVuelta = this.porcentajeDescuentoPromocionVenta+" %";
                  promocionIdVuelta = this.promocionVentasId;
                }else if(this.pasajero_asientos[a]['tipo_descuento_vuelta'] == "S"){
                  tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
                  descuentoVuelta = this.pasajero_asientos[a]['porcentaje_descuento_vuelta'];
                  impPagadoVuelta = tarifaVuelta - descuentoVuelta;
                  namePromocionVuelta = this.namePromocionVenta;
                  descuentoPromocionVuelta = "S/. "+this.porcentajeDescuentoPromocionVenta;
                  promocionIdVuelta = this.promocionVentasId;
                }
              }else{
                tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
                descuentoVuelta = 0;
                impPagadoVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
              }
            }
          }else{
            tarifaIda = Number(this.pasajero_asientos[a]['precio_ida']);
            descuentoIda = 0;
            impPagadoIda = Number(this.pasajero_asientos[a]['precio_ida']);
            tarifaVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
            descuentoVuelta = 0;
            impPagadoVuelta = Number(this.pasajero_asientos[a]['precio_vuelta']);
          }
          
          //TODO: *********************************************** RELACION PADRES E HIJOS ***********************************************/
          var dniApoderado = "";
          var nombretipoPasajero = $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
          var tipoPasajero = 0;
          var idParentesco = 0;

          if(nombretipoPasajero == "Adulto"){
            dniApoderado = "";
            tipoPasajero = 1;
            idParentesco = 1;

          }else if(nombretipoPasajero == "Menor"){
            var chk_vincular_apoderado = "flexSwitchCheckInfante2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta;
            if($('#'+chk_vincular_apoderado).is(":checked") == true){
              if(this.pasajero_asientos.length == 1){
                dniApoderado = $("#TipDocApoderado1_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
              }else{
                dniApoderado = $("#TipDocApoderado2_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
              }

              tipoPasajero = 2;
              if(dniApoderado != ""){
                idParentesco = 5;
              }
            }else{
              dniApoderado = "";
              tipoPasajero = 2;
              idParentesco = 7;
            }
          }else if(nombretipoPasajero == "Apoderado"){
            dniApoderado = "";
            tipoPasajero = 1;
            idParentesco = 2;
          }
          //TODO: *********************************************** RELACION PADRES E HIJOS ***********************************************/
          var genero = 0;
          var rd_radio_1 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_1";
          var rd_radio_2 = "inlineRadio_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta+"_2";
          
          if($('#'+rd_radio_1).is(":checked") == true && $('#'+rd_radio_2).is(":checked") == false){
            genero = 1;
          }else if($('#'+rd_radio_1).is(":checked") == false && $('#'+rd_radio_2).is(":checked") == true){
            genero = 2;
          }

          if(this.ida_vuelta == 1){
            this.ventaIdaVuelta = {
              "ventaIda" : {
                "idItinerario": this.idItinerarioIda,
                "idRuta": this.idRutaIda,
                "pasajero": {
                  "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "apePaterno": part_apell[0],
                  "apeMaterno": part_apell[1],
                  "fechanacimiento": this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "telefono": String($("#numeroDatosContacto").val()),
                  "email": $("#emailDatosContacto").val(),
                  "genero": genero,
                  "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
                },
                "idServicio": this.idServicioIda,
                "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                "idAgenciaPartida": this.idAgenciaEmbarqueIda,
                "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueIda),
                "horaPartida": this.horaEmbarqueIda,
                "idAgenciaLlegada": this.idAgenciaDesembarqueIda,
                "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueIda),
                "horaLlegada": this.horaDesembarqueIda,
                "tarifa": tarifaIda,
                "descuento": descuentoIda,
                "impPagado": impPagadoIda,
                "namePromocion": namePromocionIda,
                "descuentoPromocion": descuentoPromocionIda,
                "emailContacto": $("#emailDatosContacto").val(),
                "telefonoOpcional": String($("#numeroDatosContacto").val()),
                "infoAdicional": 0, 
                "idParentesco": idParentesco,
                "tipoPasajero": tipoPasajero,
                "dniApoderado": dniApoderado,
                "promocionIdSispas": promocionIdIda
              },
              "ventaVuelta" : null
            };
          }else{
            this.ventaIdaVuelta = {
              "ventaIda" : {
                "idItinerario": this.idItinerarioIda,
                "idRuta": this.idRutaIda,
                "pasajero": {
                  "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "apePaterno": part_apell[0],
                  "apeMaterno": part_apell[1],
                  "fechanacimiento": this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "telefono": String($("#numeroDatosContacto").val()),
                  "email": $("#emailDatosContacto").val(),
                  "genero": genero,
                  "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
                },
                "idServicio": this.idServicioIda,
                "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                "idAgenciaPartida": this.idAgenciaEmbarqueIda,
                "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueIda),
                "horaPartida": this.horaEmbarqueIda,
                "idAgenciaLlegada": this.idAgenciaDesembarqueIda,
                "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueIda),
                "horaLlegada": this.horaDesembarqueIda,
                "tarifa": tarifaIda,
                "descuento": descuentoIda,
                "impPagado": impPagadoIda,
                "namePromocion": namePromocionIda,
                "descuentoPromocion": descuentoPromocionIda,
                "emailContacto": $("#emailDatosContacto").val(),
                "telefonoOpcional": String($("#numeroDatosContacto").val()),
                "infoAdicional": 0, 
                "idParentesco": idParentesco,
                "tipoPasajero": tipoPasajero,
                "dniApoderado": dniApoderado,
                "promocionIdSispas": promocionIdIda
              },
              "ventaVuelta" : {
                "idItinerario": this.idItinerarioVuelta,
                "idRuta": this.idRutaVuelta,
                "pasajero": {
                  "idpasajero": Number($("#txtidpasajero_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "idTipoDocumento": Number($("#selectTipDoc_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "numDocumento": $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "nombre": $("#txtnombres_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val(),
                  "apePaterno": part_apell[0],
                  "apeMaterno": part_apell[1],
                  "fechanacimiento": this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val()),
                  "telefono": String($("#numeroDatosContacto").val()),
                  "email": $("#emailDatosContacto").val(),
                  "genero": genero,
                  "flagWS": Number($("#txtflagws_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val())
                },
                "idServicio": this.idServicioVuelta,
                "nroAsiento": Number(this.pasajero_asientos[a]['asiento_vuelta']),
                "nroPiso": this.pasajero_asientos[a]['piso_vuelta'],
                "idAgenciaPartida": this.idAgenciaEmbarqueVuelta,
                "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueVuelta),
                "horaPartida": this.horaEmbarqueVuelta,
                "idAgenciaLlegada": this.idAgenciaDesembarqueVuelta,
                "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueVuelta),
                "horaLlegada": this.horaDesembarqueVuelta,
                "tarifa": tarifaVuelta,
                "descuento": descuentoVuelta,
                "impPagado": impPagadoVuelta,
                "namePromocion": namePromocionVuelta,
                "descuentoPromocion": descuentoPromocionVuelta,
                "emailContacto": $("#emailDatosContacto").val(),
                "telefonoOpcional": String($("#numeroDatosContacto").val()),
                "infoAdicional": 0, 
                "idParentesco": idParentesco,
                "tipoPasajero": tipoPasajero,
                "dniApoderado": dniApoderado,
                "promocionIdSispas": promocionIdVuelta
              }
            };
          }

          this.subArrayFinal.push(this.ventaIdaVuelta);

          /********************************************** AGREGAR INFANTE **********************************************/
          for(var c=0; c<this.lista_infante_detalle.length; c++){
            if(this.lista_infante_detalle[c]['id'] == id_variable_pasajero){
              var part_apell_infante = String(this.lista_infante_detalle[c]['txtapellidosInfante']).split(" ");
              var dniApoderadoInfante = $("#txtdocumento_"+this.lista_infante_detalle[c]['id']).val();
              //var vinculoApoderado = this.lista_infante_detalle[c]['selectTipVinculo'];
              var idpasajeroInfante = this.lista_infante_detalle[c]['idpasajeroInfante'];
              var flagwsInfante = this.lista_infante_detalle[c]['flagwsInfante'];
              var generoInfante = this.lista_infante_detalle[c]['generoInfante'];

              idParentesco = 4;
              tipoPasajero = 3;

              if(this.ida_vuelta == 1){
                this.ventaIdaVuelta = {
                  "ventaIda" : {
                    "idItinerario": this.idItinerarioIda,
                    "idRuta": this.idRutaIda,
                    "pasajero": {
                      "idpasajero": idpasajeroInfante,
                      "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                      "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                      "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                      "apePaterno": part_apell_infante[0],
                      "apeMaterno": part_apell_infante[1],
                      "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                      "telefono": String($("#numeroDatosContacto").val()),
                      "email": $("#emailDatosContacto").val(),
                      "genero": generoInfante,
                      "flagWS": Number(flagwsInfante)
                    },
                    "idServicio": this.idServicioIda,
                    "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                    "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                    "idAgenciaPartida": this.idAgenciaEmbarqueIda,
                    "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueIda),
                    "horaPartida": this.horaEmbarqueIda,
                    "idAgenciaLlegada": this.idAgenciaDesembarqueIda,
                    "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueIda),
                    "horaLlegada": this.horaDesembarqueIda,
                    "tarifa": 0.0,
                    "descuento": 0.0,
                    "impPagado": 0.0,
                    "namePromocion": "",
                    "descuentoPromocion": "",
                    "emailContacto": $("#emailDatosContacto").val(),
                    "telefonoOpcional": String($("#numeroDatosContacto").val()),
                    "infoAdicional": 0,
                    "idParentesco": idParentesco,
                    "tipoPasajero": tipoPasajero,
                    "dniApoderado": dniApoderadoInfante,
                    "promocionIdSispas": promocionIdIda
                  },
                  "ventaVuelta" : null
                };
              }else{
                this.ventaIdaVuelta = {
                  "ventaIda" : {
                    "idItinerario": this.idItinerarioIda,
                    "idRuta": this.idRutaIda,
                    "pasajero": {
                      "idpasajero": idpasajeroInfante,
                      "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                      "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                      "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                      "apePaterno": part_apell_infante[0],
                      "apeMaterno": part_apell_infante[1],
                      "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                      "telefono": String($("#numeroDatosContacto").val()),
                      "email": $("#emailDatosContacto").val(),
                      "genero": generoInfante,
                      "flagWS": Number(flagwsInfante)
                    },
                    "idServicio": this.idServicioIda,
                    "nroAsiento": Number(this.pasajero_asientos[a]['asiento_ida']),
                    "nroPiso": this.pasajero_asientos[a]['piso_ida'],
                    "idAgenciaPartida": this.idAgenciaEmbarqueIda,
                    "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueIda),
                    "horaPartida": this.horaEmbarqueIda,
                    "idAgenciaLlegada": this.idAgenciaDesembarqueIda,
                    "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueIda),
                    "horaLlegada": this.horaDesembarqueIda,
                    "tarifa": 0.0,
                    "descuento": 0.0,
                    "impPagado": 0.0,
                    "namePromocion": "",
                    "descuentoPromocion": "",
                    "emailContacto": $("#emailDatosContacto").val(),
                    "telefonoOpcional": String($("#numeroDatosContacto").val()),
                    "infoAdicional": 0,
                    "idParentesco": idParentesco,
                    "tipoPasajero": tipoPasajero,
                    "dniApoderado": dniApoderadoInfante,
                    "promocionIdSispas": promocionIdIda
                  },
                  "ventaVuelta" : {
                    "idItinerario": this.idItinerarioVuelta,
                    "idRuta": this.idRutaVuelta,
                    "pasajero": {
                      "idpasajero": idpasajeroInfante,
                      "idTipoDocumento": Number(this.lista_infante_detalle[c]['selectTipDocInfante']),
                      "numDocumento": this.lista_infante_detalle[c]['txtdocumentoInfante'],
                      "nombre": this.lista_infante_detalle[c]['txtnombresInfante'],
                      "apePaterno": part_apell_infante[0],
                      "apeMaterno": part_apell_infante[1],
                      "fechanacimiento": this.lista_infante_detalle[c]['fecha_nacimiento_infante'],
                      "telefono": String($("#numeroDatosContacto").val()),
                      "email": $("#emailDatosContacto").val(),
                      "genero": generoInfante,
                      "flagWS": Number(flagwsInfante)
                    },
                    "idServicio": this.idServicioVuelta,
                    "nroAsiento": Number(this.pasajero_asientos[a]['asiento_vuelta']),
                    "nroPiso": this.pasajero_asientos[a]['piso_vuelta'],
                    "idAgenciaPartida": this.idAgenciaEmbarqueVuelta,
                    "fechaPartida": this.funcionesService.convert_format_fecha_barra(this.fechaEmbarqueVuelta),
                    "horaPartida": this.horaEmbarqueVuelta,
                    "idAgenciaLlegada": this.idAgenciaDesembarqueVuelta,
                    "fechaLlegada": this.funcionesService.convert_format_fecha_barra(this.fechaDesembarqueVuelta),
                    "horaLlegada": this.horaDesembarqueVuelta,
                    "tarifa": 0.0,
                    "descuento": 0.0,
                    "impPagado": 0.0,
                    "namePromocion": "",
                    "descuentoPromocion": "",
                    "emailContacto": $("#emailDatosContacto").val(),
                    "telefonoOpcional": String($("#numeroDatosContacto").val()),
                    "infoAdicional": 0,
                    "idParentesco": idParentesco,
                    "tipoPasajero": tipoPasajero,
                    "dniApoderado": dniApoderadoInfante,
                    "promocionIdSispas": promocionIdVuelta
                  }
                };
              }
    
              this.subArrayFinal.push(this.ventaIdaVuelta);
            }
          }
          /********************************************** AGREGAR INFANTE **********************************************/
        }

        if($("#razonSolicitaFactura").val() != ""){
          this.arrayCliente = {
            "idcliente": Number($("#idclienteSolicitaFactura").val()),
            "nroDoc": $("#rucSolicitaFactura").val(),
            "razonSocial": $("#razonSolicitaFactura").val(),
            "direccion": $("#direccionSolicitaFactura").val(),
            "flag": Number($("#flagSolicitaFactura").val())
          };
        }else{
          this.arrayCliente = null;
        }

        this.ArrayFinal = {
          "ventaPasajeros": this.subArrayFinal,
          "tiempoPasarelaPago": this.tiempoPagoPasarelaWeb,
          "ipLocal": this.myIp,
          "cliente": this.arrayCliente,
          "idTipForPago": 4,
          "montoTotal": this.precio_total_pasajeros_asientos,
          "codePaisPhone": "+"+this.code_pais,
          "idAgencia": this.idAgencia,
          "idUsuarioSispas": this.idUsuarioSispas,
          "usuarioSispas": this.usuarioSispas,
          "idHardwareSispas": this.idHardwareSispas,
          "canalVenta": this.canalVenta,
          "fechaLiquidacion": this.fechaLiquidacion,
          "descripcionVenta": "",
          "observaciones": ""
        };

        return this.ArrayFinal;
        /*************************************************** ARRAY FINAL ***************************************************/
      }
    }
  }

  /*quitar_promocionesVentas(dat: any){
    if(this.promocionVentasActiva == dat){
      this.promocionVentasActiva = [];
      $('#btn_promocionesventas_'+dat['promocion_id']+' font').toggleClass("active");
      $('#icon_cerrar_promocionesventas_'+dat['promocion_id']).css('display', 'none');
      $('#icon_aplicar_promocionesventas2_'+dat['promocion_id']).css('display', 'inline');
      $('#icon_cerrar_promocionesventas2_'+dat['promocion_id']).css('display', 'none');
      this.quitar_descuento();
    }
  }*/

  aplicar_quitar_promocionesVentas(dat: any){
    //console.log(dat);
    if(this.cuponActivo == 0){
      if(this.promocionVentasActiva.length == 0){
        this.promocionVentasActiva = dat;
        $('#icon_cerrar_promocionesventas_'+dat['promocion_id']).css('display', 'inline');
        $('#icon_aplicar_promocionesventas2_'+dat['promocion_id']).css('display', 'none');
        $('#icon_cerrar_promocionesventas2_'+dat['promocion_id']).css('display', 'inline');
        this.aplicar_descuento(dat);
      }else if(this.promocionVentasActiva == dat){
        this.promocionVentasActiva = [];
        $('#btn_promocionesventas_'+dat['promocion_id']+' font').toggleClass("active");
        $('#icon_cerrar_promocionesventas_'+dat['promocion_id']).css('display', 'none');
        $('#icon_aplicar_promocionesventas2_'+dat['promocion_id']).css('display', 'inline');
        $('#icon_cerrar_promocionesventas2_'+dat['promocion_id']).css('display', 'none');
        this.quitar_descuento();
      }else{
        for(var a=0; a<this.promocionesVentas.length; a++){
          $('#icon_aplicar_promocionesventas2_'+this.promocionesVentas[a]['promocion_id']).css('display', 'inline');
          $('#icon_cerrar_promocionesventas2_'+this.promocionesVentas[a]['promocion_id']).css('display', 'none');
        }

        for(var b=0; b<this.promocionesVentasRuc.length; b++){
          $('#icon_aplicar_promocionesventas2_'+this.promocionesVentasRuc[b]['promocion_id']).css('display', 'inline');
          $('#icon_cerrar_promocionesventas2_'+this.promocionesVentasRuc[b]['promocion_id']).css('display', 'none');
        }

        this.quitar_descuento();
        this.promocionVentasActiva = dat;
        $('#icon_cerrar_promocionesventas_'+dat['promocion_id']).css('display', 'inline');
        $('#icon_aplicar_promocionesventas2_'+dat['promocion_id']).css('display', 'none');
        $('#icon_cerrar_promocionesventas2_'+dat['promocion_id']).css('display', 'inline');
        this.aplicar_descuento(dat);
      }
    }else{
      this.funcionesService.notificacion_mensaje("Warning", "Ya tiene una promoción activa.");
    }
  }

  aplicar_descuento(dat: any){
    this.promocionActiva = 1;
    this.flagPromocionVentas = 1;
    this.promocionVentasId = dat['promocion_id'];
    
    if(this.ida_vuelta == 1){
      // TODO: IDA
      this.porcentajeRestantePromocionVenta = 100 - Number(dat['n_valdes']);

      for(var a=0; a<this.pasajero_asientos.length; a++){
        this.namePromocionVenta = dat['c_denominacion'];
        this.porcentajeDescuentoPromocionVenta = dat['n_valdes'];
        this.pasajero_asientos[a]['porcentaje_descuento_ida'] = dat['n_valdes'];
        this.pasajero_asientos[a]['tipo_descuento_ida'] = dat['c_tipdes'];
        this.tipoDescuentoPromocionVenta = dat['c_tipdes'];
        
        if(dat['c_tipdes'] == 'P'){
          this.precio_pasajeros_asientos_ida -= Number(Number(Number(this.pasajero_asientos[a]['precio_ida'])*dat['n_valdes']/100).toFixed(2));
        }else if(dat['c_tipdes'] == 'S'){
          this.precio_pasajeros_asientos_ida -= dat['n_valdes'];
        }
      }
    }else{
      // TODO: IDA Y VUELTA
      this.porcentajeRestantePromocionVenta = 100 - Number(dat['n_valdes']);

      for(var a=0; a<this.pasajero_asientos.length; a++){
        this.namePromocionVenta = dat['c_denominacion'];
        this.porcentajeDescuentoPromocionVenta = dat['n_valdes'];
        this.pasajero_asientos[a]['porcentaje_descuento_ida'] = dat['n_valdes'];
        this.pasajero_asientos[a]['tipo_descuento_ida'] = dat['c_tipdes'];
        this.tipoDescuentoPromocionVenta = dat['c_tipdes'];
        
        if(dat['c_tipdes'] == 'P'){
          this.precio_pasajeros_asientos_ida -= Number(Number(Number(this.pasajero_asientos[a]['precio_ida'])*dat['n_valdes']/100).toFixed(2));
        }else if(dat['c_tipdes'] == 'S'){
          this.precio_pasajeros_asientos_ida -= dat['n_valdes'];
        }
      }

      for(var a=0; a<this.pasajero_asientos.length; a++){
        this.namePromocionVenta = dat['c_denominacion'];
        this.porcentajeDescuentoPromocionVenta = dat['n_valdes'];
        this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] = dat['n_valdes'];
        this.pasajero_asientos[a]['tipo_descuento_vuelta'] = dat['c_tipdes'];
        this.tipoDescuentoPromocionVenta = dat['c_tipdes'];
        
        if(dat['c_tipdes'] == 'P'){
          this.precio_pasajeros_asientos_vuelta -= Number(Number(Number(this.pasajero_asientos[a]['precio_vuelta'])*dat['n_valdes']/100).toFixed(2));
        }else if(dat['c_tipdes'] == 'S'){
          this.precio_pasajeros_asientos_vuelta -= dat['n_valdes'];
        }
      }
    }

    this.precio_total_pasajeros_asientos = this.precio_pasajeros_asientos_ida + this.precio_pasajeros_asientos_vuelta;
  }

  quitar_descuento(){
    this.promocionActiva = 0;
    this.flagPromocionVentas = 0;

    this.precio_pasajeros_asientos_ida = this.precio_pasajeros_asientos_ida_original;
    this.precio_pasajeros_asientos_vuelta = this.precio_pasajeros_asientos_vuelta_original;
    this.precio_total_pasajeros_asientos = this.precio_total_pasajeros_asientos_original;

    for(var a=0; a<this.pasajero_asientos.length; a++){
      this.pasajero_asientos[a]['porcentaje_descuento_ida'] = 0;
      this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] = 0;
      this.pasajero_asientos[a]['tipo_descuento_ida'] = "";
      this.pasajero_asientos[a]['tipo_descuento_vuelta'] = "";
    }
  }

  quitar_descuento_unitario(id: string, porcentaje_descuento: number, ida_vuelta: string){
    for(var a=0; a<this.pasajero_asientos.length; a++){
      if(ida_vuelta == "ida"){
        if(this.pasajero_asientos[a]['asiento_ida']+"_"+this.pasajero_asientos[a]['asiento_vuelta'] == id){

          if(this.pasajero_asientos[a]['tipo_descuento_ida'] == "P"){
            this.precio_pasajeros_asientos_ida += Number(Number(Number(this.pasajero_asientos[a]['precio_ida'])*porcentaje_descuento/100).toFixed(2));
          }else if(this.pasajero_asientos[a]['tipo_descuento_ida'] == "S"){
            this.precio_pasajeros_asientos_ida += porcentaje_descuento;
          }
          
          this.pasajero_asientos[a]['porcentaje_descuento_ida'] = 0;
          this.pasajero_asientos[a]['tipo_descuento_ida'] = "";
        }
      }
      
      if(ida_vuelta == "vuelta"){
        if(this.pasajero_asientos[a]['asiento_ida']+"_"+this.pasajero_asientos[a]['asiento_vuelta'] == id){

          if(this.pasajero_asientos[a]['tipo_descuento_vuelta'] == "P"){
            this.precio_pasajeros_asientos_vuelta += Number(Number(Number(this.pasajero_asientos[a]['precio_vuelta'])*porcentaje_descuento/100).toFixed(2));
          }else if(this.pasajero_asientos[a]['tipo_descuento_vuelta'] == "S"){
            this.precio_pasajeros_asientos_vuelta += porcentaje_descuento;
          }

          this.pasajero_asientos[a]['porcentaje_descuento_vuelta'] = 0;
          this.pasajero_asientos[a]['tipo_descuento_vuelta'] = "";
        }
      }
    }

    this.precio_total_pasajeros_asientos = this.precio_pasajeros_asientos_ida + this.precio_pasajeros_asientos_vuelta;

    if(this.precio_total_pasajeros_asientos == this.precio_total_pasajeros_asientos_original){
      this.promocionActiva = 0;
      this.flagPromocionVentas = 0;
      this.porcentajeDescuentoPromocionVenta = "";

      this.promocionVentasActiva = [];
      $('#btn_promocionesventas_'+this.promocionVentasId+' font').toggleClass("active");
      $('#icon_cerrar_promocionesventas_'+this.promocionVentasId).css('display', 'none');
      $('#icon_aplicar_promocionesventas2_'+this.promocionVentasId).css('display', 'inline');
      $('#icon_cerrar_promocionesventas2_'+this.promocionVentasId).css('display', 'none');

      this.promocionVentasId = 0;
    }
  }

  searchNameDocumento(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      if(String(text_documento).length > 7){
        var part_text = String(evt.target.id).split("_");
        var id_tipo_doc = $("#selectTipDoc_"+part_text[1]+"_"+part_text[2]).val();

        var txtidpasajero = "txtidpasajero_"+part_text[1]+"_"+part_text[2];
        var txtflagws = "txtflagws_"+part_text[1]+"_"+part_text[2];
        var id_text_nombres = "txtnombres_"+part_text[1]+"_"+part_text[2];
        var id_text_apellidos = "txtapellidos_"+part_text[1]+"_"+part_text[2];
        var id_fecha_nacimiento = "fecha_nacimiento_"+part_text[1]+"_"+part_text[2];

        $('#'+txtidpasajero).val(String(''));
        $('#'+txtflagws).val(String(''));
        $('#'+id_text_nombres).val(String(''));
        $('#'+id_text_apellidos).val(String(''));
        $('#'+id_fecha_nacimiento).val(String(''));

        if(!String(text_documento).includes(" ")){
          $(".loader").fadeIn("slow");
          this.taskService.getNameDocumento(Number(id_tipo_doc), String(text_documento)).subscribe(response => {
            //console.log(response);
            if(response != null){
              $('#'+txtidpasajero).val(String(response['idpasajero']));
              $('#'+txtflagws).val(String(response['flagWS']));
              $('#'+id_text_nombres).val(String(response['nombre']));
              $('#'+id_text_apellidos).val(String(response['apePaterno'])+" "+String(response['apeMaterno']));
              var fecha = "";
              if(String(response['fechanacimiento']).includes("/")){
                var partFecha = String(response['fechanacimiento']).split("/");
                fecha = partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
              }
              
              $('#'+id_fecha_nacimiento).val(String(fecha));
              this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);

              if(response['genero'] == 1){    /* MUJER */
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1").prop('checked', true);
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2").prop('checked', false);
              }else if(response['genero'] == 2){    /* HOMBRE */
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1").prop('checked', false);
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2").prop('checked', true);
              }

              $("#"+id_text_nombres).prop("readonly", false);
              $("#"+id_text_apellidos).prop("readonly", false);

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", false);
                $("#"+id_text_apellidos).prop("readonly", false);
                $('#'+id_fecha_nacimiento).val("");
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1").prop('checked', false);
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2").prop('checked', false);
              }
            }else{
              $('#'+txtidpasajero).val(String(''));
              $('#'+txtflagws).val(String(''));
              $('#'+id_text_nombres).val(String(''));
              $('#'+id_text_apellidos).val(String(''));
              $('#'+id_fecha_nacimiento).val(String(''));

              $("#"+id_text_nombres).prop("readonly", false);
              $("#"+id_text_apellidos).prop("readonly", false);

              if(id_tipo_doc == 1){
                var valoresAceptados = /^[0-9]+$/;
                if (String(text_documento).match(valoresAceptados)){
                  $("#"+id_text_nombres).prop("readonly", false);
                  $("#"+id_text_apellidos).prop("readonly", false);
                } else {
                  $("#"+id_text_nombres).prop("readonly", false);
                  $("#"+id_text_apellidos).prop("readonly", false);
                }
              }

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", false);
                $("#"+id_text_apellidos).prop("readonly", false);
                $('#'+id_fecha_nacimiento).val("");
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1").prop('checked', false);
                $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2").prop('checked', false);
              }
            }

            $(".loader").fadeOut("slow");
          });
        }else{
          this.funcionesService.mostrar_modal("modal_mensaje_sin_espacios");

          $('#'+txtidpasajero).val(String(''));
          $('#'+txtflagws).val(String(''));
          $('#'+id_text_nombres).val(String(''));
          $('#'+id_text_apellidos).val(String(''));

          $("#"+id_text_nombres).prop("readonly", true);
          $("#"+id_text_apellidos).prop("readonly", true);
          $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_1").prop('checked', false);
          $("#inlineRadio_"+part_text[1]+"_"+part_text[2]+"_2").prop('checked', false);
        }
      }else{
        if(text_documento == ""){
          var part_text = String(evt.target.id).split("_");
          this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);
        }
      }
    }
  }

  aceptar_fecha_nacimiento(asiento_ida_vuelta: string){
    var fechaNacimiento = $("#fecha_nacimiento_"+asiento_ida_vuelta).val();
    
    /****************************************************************************/
    var hoy = new Date();
    var cumpleanos = new Date(String(fechaNacimiento));
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if(m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())){
      edad--;
    }

    //$("#edad_"+asiento_ida_vuelta).val(edad);
    //console.log("edad: "+edad);

    $('#flexSwitchCheckInfante_'+asiento_ida_vuelta).prop('checked', false);
    $('#flexSwitchCheckInfante2_'+asiento_ida_vuelta).prop('checked', false);
    $('#datos_detalle_infante_'+asiento_ida_vuelta).css('display', 'none');
    $('#dni_apoderado2_'+asiento_ida_vuelta).css('display', 'none');

    if(edad>=5 && edad<18){
      $('#relacion_edad_'+asiento_ida_vuelta).val("Menor");

      //$('#dni_apoderado_'+asiento_ida_vuelta).css('display', 'inline');
      $('#pregunta1_detalle_infante_'+asiento_ida_vuelta).css('display', 'none');
      $('#pregunta2_detalle_infante_'+asiento_ida_vuelta).css('display', 'none');
      $('#pregunta1_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'inline');
      $('#pregunta2_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'inline');

      //POPUP ALERT MENOR
      //this.mostrar_modal("modal_alert_menor");

      if(this.pasajero_asientos.length == 1){
        $('#TipDocApoderado1_'+asiento_ida_vuelta).css('display', 'inline');
      }else{
        $('#TipDocApoderado2_'+asiento_ida_vuelta).css('display', 'inline');
      }
    }else{
      $('#relacion_edad_'+asiento_ida_vuelta).val("Adulto");

      $('#dni_apoderado2_'+asiento_ida_vuelta).css('display', 'none');
      $('#pregunta1_detalle_infante_'+asiento_ida_vuelta).css('display', 'inline');
      $('#pregunta2_detalle_infante_'+asiento_ida_vuelta).css('display', 'inline');
      $('#pregunta1_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'none');
      $('#pregunta2_detalle_adolescente_'+asiento_ida_vuelta).css('display', 'none');
    }
    /****************************************************************************/

    this.arrayAdultosSeleccion();

    this.funcionesService.ocultar_modal("modal_fecha_nacimiento");
  }

  ConsultarCupon(){}

  EliminarCuponAplicado(){}

  change_detalle_factura(evt){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#detalle_factura').css('display', 'block');
        $('#rucSolicitaFactura').val('');
        $('#razonSolicitaFactura').val('');
        $('#direccionSolicitaFactura').val('');

        if($('#flexSwitchCheckDefault').is(":checked") == true && this.cuponActivo == 1){
          this.EliminarCuponAplicado();
          this.funcionesService.notificacion_mensaje("Warning", "No se puede aplicar el Cupón en una factura.");
        }
      }else{
        $('#detalle_factura').css('display', 'none');
      }
    }
  }

  handleKeyDownRuc(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Permitir Ctrl+V
    if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
      return;
    }

    // Solo permitir números y letra 'a'
    if (!/[0-9a]/i.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Limitar longitud total
    const currentLength = input.value.length;
    const selectionLength = input.selectionEnd! - input.selectionStart!;

    if (currentLength - selectionLength >= this.max_length_ruc) {
      event.preventDefault();
      return;
    }
  }

  handlePasteRuc(event: ClipboardEvent) {
    event.preventDefault();

    const input = event.target as HTMLInputElement;
    const clipboardData = event.clipboardData?.getData('text') || '';

    // Elimina espacios y caracteres inválidos
    let cleanText = clipboardData.replace(/\s+/g, '').replace(/[^0-9a]/gi, '');

    // Calcular posición de selección actual
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    // Valor actual + texto limpio pegado
    const currentValue = input.value;
    const remaining = this.max_length_ruc - (currentValue.length - (end - start));

    // Limitar a los caracteres que caben
    cleanText = cleanText.substring(0, remaining);

    // Insertar el valor limpio
    const newValue =
      currentValue.substring(0, start) +
      cleanText +
      currentValue.substring(end);

    input.value = newValue;

    // Disparar evento input para Angular
    input.dispatchEvent(new Event('input'));
  }

  eliminarDatosRuc(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_ruc = $('#'+evt.target.id).val();

      if(String(text_ruc).length < 11){
        $("#razonSolicitaFactura").val("");
        $("#direccionSolicitaFactura").val("");
        $("#razonSolicitaFactura").prop("readonly", false);
        $("#direccionSolicitaFactura").prop("readonly", false);

        this.promocionesVentasRuc = [];
        for(var a=0; a<this.promocionesVentas.length; a++){
          $('#icon_aplicar_promocionesventas2_'+this.promocionesVentas[a]['promocion_id']).css('display', 'inline');
          $('#icon_cerrar_promocionesventas2_'+this.promocionesVentas[a]['promocion_id']).css('display', 'none');
        }

        for(var b=0; b<this.promocionesVentasRuc.length; b++){
          $('#icon_aplicar_promocionesventas2_'+this.promocionesVentasRuc[b]['promocion_id']).css('display', 'inline');
          $('#icon_cerrar_promocionesventas2_'+this.promocionesVentasRuc[b]['promocion_id']).css('display', 'none');
        }

        this.quitar_descuento();
      }
    }
  }

  searchDatosRuc(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_ruc = $('#'+evt.target.id).val();
      
      if(this.cuponActivo == 1){
        this.EliminarCuponAplicado();
        this.notificacion_mensajes_alerta("Advertencia", "No se puede aplicar el Cupón en una factura.");
      }

      if(String(text_ruc).length > 10){
        $(".loader").fadeIn("slow");
        this.taskService.getDatosRuc(Number(text_ruc)).subscribe(response => {
          if(response != null){
            $("#idclienteSolicitaFactura").val(response['idcliente']);
            $("#flagSolicitaFactura").val(response['flag']);
            $("#razonSolicitaFactura").val(response['razonSocial']);
            $("#direccionSolicitaFactura").val(response['direccion']);

            $("#razonSolicitaFactura").prop("readonly", false);
            $("#direccionSolicitaFactura").prop("readonly", false);

            this.buscarPromocionesRuc(Number(response['idcliente']));
          }else{
            if(this.funcionesService.validarRUC(text_ruc) == true){
              $("#idclienteSolicitaFactura").val("");
              $("#flagSolicitaFactura").val("");
              $("#razonSolicitaFactura").val("");
              $("#direccionSolicitaFactura").val("");

              $("#razonSolicitaFactura").prop("readonly", false);
              $("#direccionSolicitaFactura").prop("readonly", false);
            }else{
              $("#idclienteSolicitaFactura").val("");
              $("#flagSolicitaFactura").val("");
              $("#razonSolicitaFactura").val("");
              $("#direccionSolicitaFactura").val("");

              $("#razonSolicitaFactura").prop("readonly", false);
              $("#direccionSolicitaFactura").prop("readonly", false);
            }
          }
          $(".loader").fadeOut("slow");
        });
      }else{
        $("#razonSolicitaFactura").val("");
        $("#direccionSolicitaFactura").val("");
        $("#razonSolicitaFactura").prop("readonly", false);
        $("#direccionSolicitaFactura").prop("readonly", false);
      }
    }
  }

  buscarPromocionesRuc(idClienteRuc: number){
    //console.log("idClienteRuc: "+idClienteRuc);
    this.promocionesVentasRuc = [];
    this.taskService.getPromocionesVentasReservasRuc(idClienteRuc).subscribe(responsePromocionesVentasReservasRuc => {
      //console.log(responsePromocionesVentasReservasRuc);
      if(responsePromocionesVentasReservasRuc.length > 0){
        for(var a=0; a<responsePromocionesVentasReservasRuc.length; a++){
          var data = {
            "idaVuelta": "IDA",
            "promocion_id": responsePromocionesVentasReservasRuc[a]['id'],
            "c_denominacion": responsePromocionesVentasReservasRuc[a]['denominacion'],
            "c_tarcre": responsePromocionesVentasReservasRuc[a]['tarjetaCredito'],
            "n_valdes": responsePromocionesVentasReservasRuc[a]['valorDescuento'],
            "stock": 99,
            "c_tipdes": responsePromocionesVentasReservasRuc[a]['tipoDescuento']
          };

          this.promocionesVentasRuc.push(data);

          if(this.idItinerarioVuelta != 0){
            var data = {
              "idaVuelta": "VUELTA",
              "promocion_id": responsePromocionesVentasReservasRuc[a]['id'],
              "c_denominacion": responsePromocionesVentasReservasRuc[a]['denominacion'],
              "c_tarcre": responsePromocionesVentasReservasRuc[a]['tarjetaCredito'],
              "n_valdes": responsePromocionesVentasReservasRuc[a]['valorDescuento'],
              "stock": 99,
              "c_tipdes": responsePromocionesVentasReservasRuc[a]['tipoDescuento']
            };

            this.promocionesVentasRuc.push(data);
          }
        }
      }
    });
  }

  deleteBlankDataRuc(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";

      if(String(text_documento).includes(" ")){
        texto_reemplazar = String(text_documento).replace(" ", "");
        $('#'+evt.target.id).val(texto_reemplazar);
      }

      if(String(text_documento).includes("a")){
        texto_reemplazar = String(text_documento).replace("a", "");
        $('#'+evt.target.id).val(texto_reemplazar);
      }
    }
  }

  notificacion_mensajes_alerta(titulo: string, mensaje: string){
    this.tituloMensajeAlerta = titulo;
    this.textoMensajeAlerta = mensaje;

    this.funcionesService.mostrar_modal("modal_mensajealerta");
  }

  arrayAdultosSeleccion(){
    this.listaArrayAdultosSeleccion = [];

    for(var a=0; a<this.pasajero_asientos.length; a++){
      var id = this.pasajero_asientos[a]['asiento_ida']+"_"+this.pasajero_asientos[a]['asiento_vuelta'];

      var relacion_edad = $('#relacion_edad_'+id).val();
      var dni_adulto = $('#txtdocumento_'+id).val();

      if((relacion_edad == "Adulto" || relacion_edad == "Apoderado") && dni_adulto != ""){
        this.listaArrayAdultosSeleccion.push(dni_adulto);
      }
    }
  }

  searchDocumentoApoderado(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();

      for(var a=0; a<this.pasajero_asientos.length; a++){
        var camp_txtdocumento = $("#txtdocumento_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val();
        
        if(camp_txtdocumento == text_documento){
          if($("#dni_datos_infante_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val() == ""){
            $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Apoderado");
          }
        }else if(text_documento != camp_txtdocumento && $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val() == "Apoderado"){
          $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Adulto");
        }else if(camp_txtdocumento == ""){
          $("#relacion_edad_"+this.pasajero_asientos[a].asiento_ida+"_"+this.pasajero_asientos[a].asiento_vuelta).val("Adulto");
        }
      }
    }
  }

  abrirModalDatosInfante(id: string){
    $("#idapoderadoInfante").val(id);
    $("#txtdocumentoInfante").val("");
    $("#txtnombresInfante").val("");
    $("#txtapellidosInfante").val("");
    $("#fecha_nacimiento_infante").val(this.date_actual);
    this.funcionesService.mostrar_modal('modalAgregarInfante');
  }

  editarDatosInfante(id: string){
    this.funcionesService.mostrar_modal('modalAgregarInfante');

    for(var a=0; a<this.lista_infante_detalle.length; a++){
      if(this.lista_infante_detalle[a]['id'] == id){
        $("#selectTipDocInfante").val(this.lista_infante_detalle[a]['selectTipDocInfante']);
        $("#idapoderadoInfante").val(this.lista_infante_detalle[a]['id']);
        $("#txtdocumentoInfante").val(this.lista_infante_detalle[a]['txtdocumentoInfante']);
        $("#txtnombresInfante").val(this.lista_infante_detalle[a]['txtnombresInfante']);
        $("#txtapellidosInfante").val(this.lista_infante_detalle[a]['txtapellidosInfante']);
        $("#fecha_nacimiento_infante").val(this.funcionesService.convert_format_fecha_guion(this.lista_infante_detalle[a]['fecha_nacimiento_infante']));
      }
    }
  }

  eliminarDatosInfante(id: string){
    $('#btn_agregar_infante_'+id).css('display', 'inline');
    $('#btn_verdatos_infante_'+id).css('display', 'none');
    $('#btn_editar_infante_'+id).css('display', 'none');
    $('#btn_eliminar_infante_'+id).css('display', 'none');
    $("font#fontPalabraApoderado2").html("DNI Apoderado:");

    this.lista_infante_detalle.splice(this.lista_infante_detalle.findIndex(v => v.id === id), 1);

    $("#dni_datos_infante_"+id).val("");
  }

  onCountryChange(evt){
    this.code_pais = evt.dialCode;
  }

  change_detalle_cupon(evt){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#detalle_cupon').css('display', 'block');
      }else{
        $('#detalle_cupon').css('display', 'none');
      }
    }
  }

  reemplazar_caracteres(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = String($('#numeroDatosContacto').val()).replace(/[^a-zA-Z0-9 ]/g,'');
      $('#numeroDatosContacto').val(Number(texto));

      
      if($('#numeroDatosContacto').val() == "0"){
        $('#numeroDatosContacto').val('');
      }
    }
  }

  limit_num_input(event: any){
    if(isPlatformBrowser(this.platformId)){
      //console.log(String($('#numeroDatosContacto').val()));
      if(String($('#numeroDatosContacto').val()).includes('/\+/g')){
        console.log("entro");
        var texto = String($('#numeroDatosContacto').val()).replace('/\+/g','');
        $('#numeroDatosContacto').val(Number(texto));
      }

      if(event.target.value.length == 15){
        return false;
      }else{
        return true;
      }
    }
    return true;
  }

  limit_num_ruc(event: any){
    if(isPlatformBrowser(this.platformId)){
      if(event.target.value.length == 11){
        return false;
      }else{
        return true;
      }
    }
    return true;
  }

  change_detalle_infante(evt, id: string){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#datos_detalle_infante_'+id).css('display', 'block');
      }else{
        $('#datos_detalle_infante_'+id).css('display', 'none');
      }
    }
  }

  change_detalle_infante_apoderado(evt, id: string){
    if(isPlatformBrowser(this.platformId)){
      if(evt.target.checked == true){
        $('#dni_apoderado2_'+id).css('display', 'block');
      }else{
        $('#dni_apoderado2_'+id).css('display', 'none');
      }
    }
  }

  changeSelect(evt){
    if(isPlatformBrowser(this.platformId)){
      var part_text = String(evt.target.id).split("_");

      $("#txtdocumento_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtnombres_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtapellidos_"+part_text[1]+"_"+part_text[2]).val("");
      $("#edad_"+part_text[1]+"_"+part_text[2]).val("");

      var select_document = $('#selectTipDoc_'+part_text[1]+"_"+part_text[2]).val();

      /**
      * @param CARNET_EXTRANJERIA 8
      * @param CEDULA_INDENTIDAD 7
      * @param DNI 1
      * @param PASAPORTE 6 
      */

      if(select_document == 8){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }else if(select_document == 7){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }else if(select_document == 1){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'number';
      }else if(select_document == 6){
        $('#txtdocumento_'+part_text[1]+"_"+part_text[2]).get(0).type = 'text';
      }
    }
  }

  changeSelectInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var part_text = String(evt.target.id).split("_");

      $("#txtdocumentoInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtnombresInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#txtapellidosInfante_"+part_text[1]+"_"+part_text[2]).val("");
      $("#edadInfante_"+part_text[1]+"_"+part_text[2]).val("");
    }
  }

  deleteBlankDataDocumento(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";
      var part_text = String(evt.target.id).split("_");
      var id_tipo_doc = $("#selectTipDoc_"+part_text[1]+"_"+part_text[2]).val();

      if(id_tipo_doc == 1){
        if(String(text_documento).includes(" ")){
          texto_reemplazar = String(text_documento).replace(" ", "");
          $('#'+evt.target.id).val(texto_reemplazar);
        }
      }
    }
  }

  deleteBlankDataDocumentoInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      var texto_reemplazar = "";
      var part_text = String(evt.target.id).split("_");
      var id_tipo_doc = $("#selectTipDocInfante_"+part_text[1]+"_"+part_text[2]).val();

      if(id_tipo_doc == 1){
        if(String(text_documento).includes(" ")){
          texto_reemplazar = String(text_documento).replace(" ", "");
          $('#'+evt.target.id).val(texto_reemplazar);
        }
      }
    }
  }

  maxLengthDocumento(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = event.target.value;
      var part_id = event.target.id.split("_");
      var val_tip_document = Number($("#selectTipDoc_"+part_id[1]+"_"+part_id[2]+" option:selected" ).val());

      if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).includes(" ")){
        return false;
      }

      if(val_tip_document == 1){                  //DNI
        if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).trim().length > 8){
          $("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val("");
        }

        if(texto.trim().length > 7){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 8){            //CARNET DE EXTRANJERIA
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 7){            //CEDULA DE IDENTIDAD
        if(String($("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val()).trim().length > 10){
          $("#txtdocumento_"+part_id[1]+"_"+part_id[2]).val("");
        }

        if(texto.trim().length > 9){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 6){            //PASAPORTE
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }
    }

    return false;
  }

  maxLengthDocumentoInfante(event: any){
    if(isPlatformBrowser(this.platformId)){
      var texto = event.target.value;
      var val_tip_document = Number($("#selectTipDocInfante option:selected" ).val());
  
      if(String($("#txtdocumentoInfante").val()).includes(" ")){
        return false;
      }
  
      if(val_tip_document == 1){                  //DNI
        if(String($("#txtdocumentoInfante").val()).trim().length > 8){
          $("#txtdocumentoInfante").val("");
        }
  
        if(texto.trim().length > 7){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 8){            //CARNET DE EXTRANJERIA
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 7){            //CEDULA DE IDENTIDAD
        if(String($("#txtdocumentoInfante").val()).trim().length > 10){
          $("#txtdocumentoInfante").val("");
        }
  
        if(texto.trim().length > 9){
          return false;
        }else{
          return true;
        }
      }else if(val_tip_document == 6){            //PASAPORTE
        if(texto.trim().length > 11){
          return false;
        }else{
          return true;
        }
      }
    }
  
    return false;
  }

  searchNameDocumentoInfante(evt){
    if(isPlatformBrowser(this.platformId)){
      var text_documento = $('#'+evt.target.id).val();
      if(String(text_documento).length > 7){
        //var part_text = String(evt.target.id).split("_");
        var id_tipo_doc = $("#selectTipDocInfante").val();

        var txtidpasajero = "idpasajeroInfante";
        var txtflagws = "flagwsInfante";
        var id_text_nombres = "txtnombresInfante";
        var id_text_apellidos = "txtapellidosInfante";
        var id_fecha_nacimiento = "fecha_nacimiento_infante";

        $('#'+txtidpasajero).val(String(''));
        $('#'+txtflagws).val(String(''));
        $('#'+id_text_nombres).val(String(''));
        $('#'+id_text_apellidos).val(String(''));
        $('#'+id_fecha_nacimiento).val(String(''));

        if(!String(text_documento).includes(" ")){
          $(".loader").fadeIn("slow");
          this.taskService.getNameDocumento(Number(id_tipo_doc), String(text_documento)).subscribe(response => {
            //console.log(response);

            if(response != null){
              $('#'+txtidpasajero).val(String(response['idpasajero']));
              $('#'+txtflagws).val(String(response['flagWS']));
              $('#'+id_text_nombres).val(String(response['nombre']));
              $('#'+id_text_apellidos).val(String(response['apePaterno'])+" "+String(response['apeMaterno']));
              var fecha = "";
              if(String(response['fechanacimiento']).includes("/")){
                var partFecha = String(response['fechanacimiento']).split("/");
                fecha = partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
              }
              
              $('#'+id_fecha_nacimiento).val(String(fecha));
              //this.aceptar_fecha_nacimiento(part_text[1]+"_"+part_text[2]);

              //? Quitar el bloqueo de cambiar nombre de infante
              //$("#"+id_text_nombres).prop("readonly", true);
              //$("#"+id_text_apellidos).prop("readonly", true);

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);
                $('#'+id_fecha_nacimiento).val("");
              }
            }else{
              $('#'+txtidpasajero).val(String(''));
              $('#'+txtflagws).val(String(''));
              $('#'+id_text_nombres).val(String(''));
              $('#'+id_text_apellidos).val(String(''));
              $('#'+id_fecha_nacimiento).val(String(''));

              $("#"+id_text_nombres).prop("readonly", false);
              $("#"+id_text_apellidos).prop("readonly", false);

              if(id_tipo_doc == 1){
                var valoresAceptados = /^[0-9]+$/;
                if (String(text_documento).match(valoresAceptados)){
                  $("#"+id_text_nombres).prop("readonly", false);
                  $("#"+id_text_apellidos).prop("readonly", false);
                } else {
                  $("#"+id_text_nombres).prop("readonly", true);
                  $("#"+id_text_apellidos).prop("readonly", true);
                }
              }

              if(id_tipo_doc == 1 && String(text_documento).length>8){
                $('#'+evt.target.id).val("");
                $('#'+txtidpasajero).val("");
                $('#'+txtflagws).val("");
                $('#'+id_text_nombres).val("");
                $('#'+id_text_apellidos).val("");
                $("#"+id_text_nombres).prop("readonly", true);
                $("#"+id_text_apellidos).prop("readonly", true);
                $('#'+id_fecha_nacimiento).val("");
              }
            }

            $(".loader").fadeOut("slow");
          });
        }else{
          this.funcionesService.mostrar_modal("modal_mensaje_sin_espacios");

          $('#'+txtidpasajero).val(String(''));
          $('#'+txtflagws).val(String(''));
          $('#'+id_text_nombres).val(String(''));
          $('#'+id_text_apellidos).val(String(''));

          $("#"+id_text_nombres).prop("readonly", true);
          $("#"+id_text_apellidos).prop("readonly", true);
        }
      }
    }
  }

  verificar_edad_infante(){
    var fechaNacimiento = $("#fecha_nacimiento_infante").val();
    
    /****************************************************************************/
    var hoy = new Date();
    var cumpleanos = new Date(String(fechaNacimiento));
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if(m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())){
      edad--;
    }

    if(edad>=0 && edad<6){
      this.errorDatosInfante = 0;
    }else{
      this.errorDatosInfante = 1;
      this.funcionesService.notificacion_mensaje("Error", "La edad colocada no corresponde a un infante.");
    }
    /****************************************************************************/
  }

  guardarDatosInfante(){
    var id = $("#idapoderadoInfante").val();
    this.verificar_edad_infante();

    if(this.errorDatosInfante == 0){
      var val = 0;
      if($("#txtdocumentoInfante").val() == ""){
        val = 1;
      }
      if($("#txtnombresInfante").val() == ""){
        val = 1;
      }
      if($("#txtapellidosInfante").val() == ""){
        val = 1;
      }
      if(this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_infante").val()) == ""){
        val = 1;
      }

      if(val == 0){
        $('#dni_datos_infante_'+id).val($("#txtdocumentoInfante").val());
        var generoInfante = 0;
        var rd_radio_1 = "inlineRadio_infante_1";
        var rd_radio_2 = "inlineRadio_infante_2";
        
        if($('#'+rd_radio_1).is(":checked") == true && $('#'+rd_radio_2).is(":checked") == false){
          generoInfante = 1;
        }else if($('#'+rd_radio_1).is(":checked") == false && $('#'+rd_radio_2).is(":checked") == true){
          generoInfante = 2;
        }

        this.funcionesService.ocultar_modal('modalAgregarInfante');

        $('#btn_agregar_infante_'+id).css('display', 'none');
        $('#btn_verdatos_infante_'+id).css('display', 'inline');
        $('#btn_editar_infante_'+id).css('display', 'inline');
        $('#btn_eliminar_infante_'+id).css('display', 'inline');

        this.datos_infante_detalle = {
          "id": id,
          "selectTipDocInfante": Number($("#selectTipDocInfante").val()),
          "selectTipVinculo": $("#selectTipVinculo").val(),
          "txtdocumentoInfante": $("#txtdocumentoInfante").val(),
          "txtnombresInfante": $("#txtnombresInfante").val(),
          "txtapellidosInfante": $("#txtapellidosInfante").val(),
          "fecha_nacimiento_infante": this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_infante").val()),
          "idpasajeroInfante": $("#idpasajeroInfante").val(),
          "generoInfante": generoInfante,
          "flagwsInfante": $("#flagwsInfante").val()
        };

        if(this.lista_infante_detalle == false){
          this.lista_infante_detalle.push(this.datos_infante_detalle);
        }else{
          for(var ab=0; ab<this.lista_infante_detalle.length; ab++){
            if(this.lista_infante_detalle[ab]['id'] == id){
              this.lista_infante_detalle[ab]['selectTipDocInfante'] = Number($("#selectTipDocInfante").val());
              this.lista_infante_detalle[ab]['selectTipVinculo'] = $("#selectTipVinculo").val();
              this.lista_infante_detalle[ab]['txtdocumentoInfante'] = $("#txtdocumentoInfante").val();
              this.lista_infante_detalle[ab]['txtnombresInfante'] = $("#txtnombresInfante").val();
              this.lista_infante_detalle[ab]['txtapellidosInfante'] = $("#txtapellidosInfante").val();
              this.lista_infante_detalle[ab]['fecha_nacimiento_infante'] = this.funcionesService.convert_format_fecha_barra($("#fecha_nacimiento_infante").val());
              this.lista_infante_detalle[ab]['idpasajeroInfante'] = $("#idpasajeroInfante").val();
              this.lista_infante_detalle[ab]['generoInfante'] = generoInfante;
              this.lista_infante_detalle[ab]['flagwsInfante'] = $("#flagwsInfante").val();
            }
          }
        }

        $("#idapoderadoInfante").val("");
        $("#txtdocumentoInfante").val("");
        $("#txtnombresInfante").val("");
        $("#txtapellidosInfante").val("");
        $("#fecha_nacimiento_infante").val("");
        $("#idpasajeroInfante").val("");
        $("#inlineRadio_infante_1").prop('checked', false);
        $("#inlineRadio_infante_2").prop('checked', false);
        $("#flagwsInfante").val("");
        
        if($("#selectTipVinculo").val() == "Padre"){
          $("font#fontPalabraApoderado2").html("DNI Padre:");
        }else if($("#selectTipVinculo").val() == "Apoderado"){
          $("font#fontPalabraApoderado2").html("DNI Apoderado:");
        }
      }else{
        this.funcionesService.notificacion_mensaje("Error", "No puede haber campos vacíos.");
      }
    }else if(this.errorDatosInfante == 1){
      this.funcionesService.notificacion_mensaje("Error", "No puede continuar, necesita solucionar lo advertido.");
    }
  }

  textCapitalize(str: string){
    const capitalize = str.slice(0, 1).toUpperCase() + (true ? str.slice(1).toLowerCase() : str.slice(1));

    return capitalize;
  }

  btn_atras(){
    if(this.ida_vuelta == 1){
      this.sharedService.enviarRegresarDatosAsientosIda(this.DatosPasajeros);
      this.router.navigate(['operaciones/ventas-reserva/asientos']);
    }else{
      this.sharedService.enviarRegresarDatosAsientosVuelta(this.DatosPasajeros);
      this.router.navigate(['operaciones/ventas-reserva/asientos-retorno']);
    }
  }
}