import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-asientos',
  templateUrl: './asientos.component.html',
  styleUrls: ['./asientos.component.css']
})
export class AsientosComponent implements OnInit {

  public innerWidth: any;

  num_paso: number = 2;
  paso_final: number = 3;
  porcen_bar: number = 80;
  detalle_paso: string = "Ida";
  detalle_paso2: string = "Selección";
  sub_titulo: string = "Selecciona tus asientos.";

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  DatosItinerario: any;

  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";

  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;

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
  array_pisos_final: any[] = [];
  estructura_bus_ida: any = [];
  titulo_detalle_piso_1: string = "";
  titulo_detalle_piso_2: string = "";
  num_asientos: string = "";
  num_asientos_ida: string = "";
  num_asientos_ida_p1: string = "";
  num_asientos_ida_p2: string = "";
  precio_asientos_ida: Array<string> = [];
  asientos_seleccionados: Array<string> = [];
  cont_asientos: number = 0;

  precio_ida_total: number = 0;
  precio_descuento_ida: number = 0;

  nombreFechaVuelta: string = "";
  horaEmbarqueVuelta: string = "";
  agenciaEmbarqueVuelta: string = "";

  ida_vuelta: number = 0;
  tiempoBloqueoAsiento: number = 0;
  cant_max_asientos: number = 0;

  idUsuario: number = 0;
  idHardware: number = 0;

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
    let StorageUsuario = JSON.parse(localStorage.getItem('StorageUsuario') || '{}');
    let StorageUsuarioHardware = JSON.parse(localStorage.getItem('StorageUsuarioHardware') || '{}');

    if(JSON.stringify(StorageUsuario)!="{}" && JSON.stringify(StorageUsuarioHardware)!="{}"){
      this.idUsuario = StorageUsuario['usuario_id'];
      this.idHardware = StorageUsuarioHardware['usuhard_id'];
    }

    if(this.sharedService.getDatosAsientosIda() == undefined){
      this.router.navigate(['operaciones/ventas-reserva/itinerario']);
    }else{
      $(".loader").fadeIn("slow");

      this.DatosItinerario = this.sharedService.getDatosAsientosIda();
      //console.log(this.DatosItinerario);

      this.nombre_ciudad_origen = this.textCapitalize(this.DatosItinerario['nombre_ciudad_origen']);
      this.nombre_ciudad_destino = this.textCapitalize(this.DatosItinerario['nombre_ciudad_destino']);
      this.idServicioIda = this.DatosItinerario['idServicioIda'];
      this.servicioIda = this.DatosItinerario['servicioIda'];
      this.fechaEmbarqueIda = this.DatosItinerario['fechaEmbarqueIda'];
      this.horaEmbarqueIda = this.DatosItinerario['horaEmbarqueIda'];
      this.nombreFechaIda = this.funcionesService.convert_nom_fecha(this.DatosItinerario['fechaEmbarqueIda']);
      this.agenciaEmbarqueIda = this.DatosItinerario['agenciaEmbarqueIda'];
      this.ida_vuelta = this.DatosItinerario['ida_vuelta'];
      this.codLocalidadIda = this.DatosItinerario['codLocalidadIda'];
      this.codLocalidadDestino = this.DatosItinerario['codLocalidadDestino'];

      this.cant_max_asientos = this.taskService.LIMITE_CANTIDAD_ASIENTOS;

      if(this.sharedService.getRegresarDatosAsientosIda() != undefined){
        var DatosAsientosIda = this.sharedService.getRegresarDatosAsientosIda();
        //console.log(DatosAsientosIda);

        /********************** DESBLOQUEAR ASIENTOS **********************/
        if(DatosAsientosIda['numAsientosIda'].includes(",")){
          var part_asi = DatosAsientosIda['numAsientosIda'].split(",");

          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = String(part_asi[a]).split("-");
            let list_asientos: any = [];
            let list_pisos: any = [];

            list_asientos.push(Number(part_asi2[0]));
            list_pisos.push(Number(part_asi2[1])); 
          
            var part_fecha = DatosAsientosIda['fechaEmbarqueIda'].split("-");
            var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
    
            this.taskService.deleteLiberarAsiento(Number(DatosAsientosIda['idRutaIda']), Number(DatosAsientosIda['idItinerarioIda']), fecha_partida, list_asientos, DatosAsientosIda['horaEmbarqueIda'], list_pisos, 5, Number(DatosAsientosIda['precioAsientosIda'][a]), this.idUsuario, this.idHardware).subscribe(response => {
              if(response['result'] == true){console.log("Se desbloqueó el asiento.");}else{console.log("No se desbloqueó el asiento.");}
            });
          }
        }else if(DatosAsientosIda['numAsientosIda']!="" && !DatosAsientosIda['numAsientosIda'].includes(",")){
          var part_asi = DatosAsientosIda['numAsientosIda'].split("-");
          var part_fecha = DatosAsientosIda['fechaEmbarqueIda'].split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

          let list_asientos: any = [];
          let list_pisos: any = [];

          list_asientos.push(Number(part_asi[0]));
          list_pisos.push(Number(part_asi[1]));
    
          this.taskService.deleteLiberarAsiento(Number(DatosAsientosIda['idRutaIda']), Number(DatosAsientosIda['idItinerarioIda']), fecha_partida, list_asientos, DatosAsientosIda['horaEmbarqueIda'], list_pisos, 5, Number(DatosAsientosIda['precioAsientosIda']), this.idUsuario, this.idHardware).subscribe(response => {
            if(response['result'] == true){console.log("Se desbloqueó el asiento.");}else{console.log("No se desbloqueó el asiento.");}
          });
        }
        /********************** DESBLOQUEAR ASIENTOS **********************/

        this.sharedService.enviarRegresarDatosAsientosIda(undefined);
      }

      setTimeout(() => {
        this.getDatosEstructuraBusIda(this.DatosItinerario);

        this.taskService.getParametrosAsientos().subscribe(responseParamAsientos => {
          this.tiempoBloqueoAsiento = responseParamAsientos[0].tiempoBloqueoAsiento;
        });

        $(".loader").fadeOut("slow");
      }, 500);

      if(this.ida_vuelta == 2){
        this.nombreFechaVuelta =  this.funcionesService.convert_nom_fecha(this.DatosItinerario['date_retorno']);
      }
    }
  }

  confirmacion_asientos(){
    var dat = {
      "nombre_ciudad_origen": this.nombre_ciudad_origen,
      "nombre_ciudad_destino": this.nombre_ciudad_destino,
      "fechaEmbarqueIda": this.DatosItinerario['fechaEmbarqueIda'],
      "fechaDesembarqueIda": this.DatosItinerario['fechaDesembarqueIda'],
      "horaEmbarqueIda": this.DatosItinerario['horaEmbarqueIda'],
      "horaDesembarqueIda": this.DatosItinerario['horaDesembarqueIda'],
      "agenciaEmbarqueIda": this.DatosItinerario['agenciaEmbarqueIda'],
      "agenciaDesembarqueIda": this.DatosItinerario['agenciaDesembarqueIda'],
      "direccionEmbarqueIda": this.DatosItinerario['direccionEmbarqueIda'],
      "direccionDesembarqueIda": this.DatosItinerario['direccionDesembarqueIda'],
      "idAgenciaEmbarqueIda": this.DatosItinerario['idAgenciaEmbarqueIda'],
      "idAgenciaDesembarqueIda": this.DatosItinerario['idAgenciaDesembarqueIda'],
      "idServicioIda": this.DatosItinerario['idServicioIda'],
      "servicioIda": this.DatosItinerario['servicioIda'],
      "idItinerarioIda": this.DatosItinerario['idItinerarioIda'],
      "idRutaIda": this.DatosItinerario['idRutaIda'],
      "fechaEmbarqueVuelta": "",
      "fechaDesembarqueVuelta": "",
      "horaEmbarqueVuelta": "",
      "horaDesembarqueVuelta": "",
      "agenciaEmbarqueVuelta": "",
      "agenciaDesembarqueVuelta": "",
      "direccionEmbarqueVuelta": "",
      "direccionDesembarqueVuelta": "",
      "idAgenciaEmbarqueVuelta": "",
      "idAgenciaDesembarqueVuelta": "",
      "idServicioVuelta": "",
      "servicioVuelta": "",
      "idItinerarioVuelta": "",
      "idRutaVuelta": "",
      "numAsientosIda": this.num_asientos_ida,
      "numAsientosIdaP1": this.num_asientos_ida_p1,
      "numAsientosIdaP2": this.num_asientos_ida_p2,
      "estructuraBusIda": this.estructura_bus_ida,
      "numAsientosVuelta": "",
      "numAsientosVueltaP1": "",
      "numAsientosVueltaP2": "",
      "estructuraBusVuelta": [],
      "listaIdaDisponibles": this.DatosItinerario['listaIdaDisponibles'],
      "listaVueltaDisponibles": this.DatosItinerario['listaVueltaDisponibles'],
      "ida_vuelta": this.DatosItinerario['ida_vuelta'],
      "precioAsientosIda": this.precio_asientos_ida,
      "precioAsientosVuelta": [],
      "precioTotalIda": this.precio_ida_total,
      "precioTotalVuelta": 0,
      "precioTotal": this.precio_ida_total,
      "date_salida": this.DatosItinerario['date_salida'],
      "date_retorno": this.DatosItinerario['date_retorno']
    };

    if(this.ida_vuelta == 1){
      if(dat.numAsientosIda.includes(",")){
        var part_asi = dat.numAsientosIda.split(",");
        let list_asientos: any = [];
        let list_pisos: any = [];

        for(var a=0; a<part_asi.length; a++){
          var part_asi2 = String(part_asi[a]).split("-");
          
          list_asientos.push(Number(part_asi2[0]));
          list_pisos.push(Number(part_asi2[1]));
        }
        
        var part_fecha = dat.fechaEmbarqueIda.split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda[a]), this.idUsuario, this.idHardware).subscribe(response => {
          if(response['result'] == true){
            //dat[0].promocionIda = 0;
            //dat[0].promocionVuelta = 0;
            this.sharedService.enviarDatosPasajeros(dat);
            this.router.navigate(['operaciones/ventas-reserva/datos-pasajeros']);
          }else{
            this.getDatosEstructuraBusIda(this.DatosItinerario);
            this.cont_asientos = 0;
            this.asientos_seleccionados = [];
            this.calcular_pasajeros();
            //this.funcionesService.mostrar_modal("modal_asientos_ocupados");

            this.funcionesService.notificacion_mensaje("Error", "Los asientos están ocupados, elija otros asientos.");
          }
        });
      }else if(dat.numAsientosIda!="" && !dat.numAsientosIda.includes(",")){
        var part_asi = dat.numAsientosIda.split("-");
        var part_fecha = dat.fechaEmbarqueIda.split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        let list_asientos: any = [];
        let list_pisos: any = [];

        list_asientos.push(Number(part_asi[0]));
        list_pisos.push(Number(part_asi[1])); 

        this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda), this.idUsuario, this.idHardware).subscribe(response => {
          if(response['result'] == true){
            //dat[0].promocionIda = 0;
            //dat[0].promocionVuelta = 0;
            this.sharedService.enviarDatosPasajeros(dat);
            this.router.navigate(['operaciones/ventas-reserva/datos-pasajeros']);
          }else{
            this.getDatosEstructuraBusIda(this.DatosItinerario);
            this.cont_asientos = 0;
            this.asientos_seleccionados = [];
            this.calcular_pasajeros();
            //this.funcionesService.mostrar_modal("modal_asientos_ocupados");

            this.funcionesService.notificacion_mensaje("Error", "El asiento está ocupado, elija otros asiento.");
          }
        });
      }
    }else{
      if(dat.numAsientosIda.includes(",")){
        var part_asi = dat.numAsientosIda.split(",");
        let list_asientos: any = [];
        let list_pisos: any = [];

        for(var a=0; a<part_asi.length; a++){
          var part_asi2 = String(part_asi[a]).split("-");
          
          list_asientos.push(Number(part_asi2[0]));
          list_pisos.push(Number(part_asi2[1]));
        }
        
        var part_fecha = dat.fechaEmbarqueIda.split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda[a]), this.idUsuario, this.idHardware).subscribe(response => {
          if(response['result'] == true){
            this.sharedService.enviarDatosItinerarioVuelta(dat);
            this.router.navigate(['operaciones/ventas-reserva/itinerario-retorno']);
          }else{
            this.getDatosEstructuraBusIda(this.DatosItinerario);
            this.cont_asientos = 0;
            this.asientos_seleccionados = [];
            this.calcular_pasajeros();
            //this.funcionesService.mostrar_modal("modal_asientos_ocupados");

            this.funcionesService.notificacion_mensaje("Error", "Los asientos están ocupados, elija otros asientos.");
          }
        });
      }else if(dat.numAsientosIda!="" && !dat.numAsientosIda.includes(",")){
        var part_asi = dat.numAsientosIda.split("-");
        var part_fecha = dat.fechaEmbarqueIda.split("-");
        var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

        let list_asientos: any = [];
        let list_pisos: any = [];

        list_asientos.push(Number(part_asi[0]));
        list_pisos.push(Number(part_asi[1])); 

        this.taskService.postBloquearAsiento(Number(dat.idRutaIda), Number(dat.idItinerarioIda), fecha_partida, list_asientos, dat.horaEmbarqueIda, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosIda), this.idUsuario, this.idHardware).subscribe(response => {
          if(response['result'] == true){
            this.sharedService.enviarDatosItinerarioVuelta(dat);
            this.router.navigate(['operaciones/ventas-reserva/itinerario-retorno']);
          }else{
            this.getDatosEstructuraBusIda(this.DatosItinerario);
            this.cont_asientos = 0;
            this.asientos_seleccionados = [];
            this.calcular_pasajeros();
            //this.funcionesService.mostrar_modal("modal_asientos_ocupados");

            this.funcionesService.notificacion_mensaje("Error", "El asiento está ocupado, elija otros asiento.");
          }
        });
      }
    }
  }

  seleccionar_asiento(piso: number, asiento: number, precio: number){
    if(isPlatformBrowser(this.platformId)){
      var desc = 2;
      if(this.asientos_seleccionados.includes(piso+"_"+asiento+"_"+precio)){
        if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado')){
          $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento casilla_asiento_seleccionado');
        }
        if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_imbatible') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado_imbatible')){
          $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento_imbatible casilla_asiento_seleccionado_imbatible');
        }
        if($("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_ecominterno') || $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_seleccionado_ecominterno')){
          $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).toggleClass('casilla_asiento_ecominterno casilla_asiento_seleccionado_ecominterno');
        }
        
        this.removeItemAsientos(this.asientos_seleccionados, piso+"_"+asiento+"_"+precio);
        desc = 0;
      }else{
        if(this.cont_asientos < this.cant_max_asientos){
          if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento')){
            $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento casilla_asiento_seleccionado');
          }
          if($("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_seleccionado_imbatible') || $("#"+piso+"_"+asiento+"_"+precio).hasClass('casilla_asiento_imbatible')){
            $("#"+piso+"_"+asiento+"_"+precio).toggleClass('casilla_asiento_imbatible casilla_asiento_seleccionado_imbatible');
          }
          
          if($("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_seleccionado_ecominterno') || $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).hasClass('casilla_asiento_ecominterno')){
            $("#"+piso+"_"+asiento+"_"+this.quitar_punto(precio)).toggleClass('casilla_asiento_ecominterno casilla_asiento_seleccionado_ecominterno');
          }
          
          this.asientos_seleccionados.push(piso+"_"+asiento+"_"+precio);
          this.cont_asientos++;
          desc = 1;
        }else{
          //this.funcionesService.mostrar_modal("modal_limitmax");
        }
      }

      this.calcular_pasajeros();

      if(this.innerWidth<800){
        $('#precio_total_mobile_normal').css('display', 'inline');
        $('#precio_total_mobile_promocion').css('display', 'none');
      }else{
        $('#precio_total_desktop_normal').css('display', 'inline');
        $('#precio_total_desktop_promocion').css('display', 'none');
      }

      if(this.asientos_seleccionados.length > 0){
        $('#btn_desktop_confirm_asient').css('display', 'inline-block');
      }else{
        $('#btn_desktop_confirm_asient').css('display', 'none');
      }
    }
  }

  getDatosEstructuraBusIda(getDatosItinerarioIda: any){
    this.taskService.getEstructuraBus(getDatosItinerarioIda['idItinerarioIda'], getDatosItinerarioIda['idRutaIda']).subscribe(responseEstructuraBus => {
      this.estructura_bus_ida = responseEstructuraBus;
      this.array_pisos_final = this.funcionesService.ordenarEstructuraBus(responseEstructuraBus);
    });
  }

  btn_atras(){
    this.sharedService.enviarRegresarDatosItinerarioIda(this.DatosItinerario);
    this.router.navigate(['operaciones/ventas-reserva/itinerario']);
  }

  calcular_pasajeros(){
    if(isPlatformBrowser(this.platformId)){
      this.num_asientos = "";
      this.precio_ida_total = 0;
      this.num_asientos_ida_p1 = "";
      this.num_asientos_ida_p2 = "";
      this.num_asientos_ida = "";
      this.precio_asientos_ida = [];

      for(var a=0; a<this.asientos_seleccionados.length; a++){
        
        var part_asi = this.asientos_seleccionados[a].split("_");

        if(part_asi[0] == "0"){
          if(this.num_asientos_ida_p1 == ""){
            this.num_asientos_ida_p1 = part_asi[1];
          }else{
            this.num_asientos_ida_p1 = this.num_asientos_ida_p1+","+part_asi[1];
          }
        }

        if(part_asi[0] == "1"){
          if(this.num_asientos_ida_p2 == ""){
            this.num_asientos_ida_p2 = part_asi[1];
          }else{
            this.num_asientos_ida_p2 = this.num_asientos_ida_p2+","+part_asi[1];
          }
        }

        if(this.num_asientos_ida == ""){
          this.num_asientos_ida = part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_ida.push(part_asi[2]);
        }else{
          this.num_asientos_ida = this.num_asientos_ida+","+part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_ida.push(part_asi[2]);
        }

        if(part_asi[0] != ""){
          if(this.num_asientos == ""){
            this.num_asientos = part_asi[1];
          }else{
            this.num_asientos = this.num_asientos+","+part_asi[1];
          }
        }
        
        this.precio_ida_total = this.precio_ida_total + parseFloat(part_asi[2]);
      }
    }
  }

  removeItemAsientos(arr : any, item : any ) {
    if(isPlatformBrowser(this.platformId)){
      var i = arr.indexOf(item);
      arr.splice( i, 1 );
      this.cont_asientos--;
    }
  }

  textCapitalize(str: string){
    const capitalize = str.slice(0, 1).toUpperCase() + (true ? str.slice(1).toLowerCase() : str.slice(1));

    return capitalize;
  }

  quitar_punto(tarifaAsiento: any){
    var tarifa_asiento = "";
    if(String(tarifaAsiento).includes('.')){
      tarifa_asiento = String(tarifaAsiento).replace('.', '');
    }else{
      tarifa_asiento = String(tarifaAsiento);
    }
    
    return tarifa_asiento;
  }
}