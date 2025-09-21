import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-asientos-retorno',
  templateUrl: './asientos-retorno.component.html',
  styleUrls: ['./asientos-retorno.component.css']
})
export class AsientosRetornoComponent implements OnInit {

  public innerWidth: any;

  num_paso: number = 4;
  paso_final: number = 5;
  porcen_bar: number = 80;
  detalle_paso: string = "Vuelta";
  detalle_paso2: string = "Selección";
  sub_titulo: string = "Selecciona tus asientos.";

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  DatosItinerario: any;

  servicioIda: string = "";
  nombreFechaIda: string = "";
  horaEmbarqueIda: string = "";
  agenciaEmbarqueIda: string = "";
  servicioVuelta: string = "";
  nombreFechaVuelta: string = "";
  horaEmbarqueVuelta: string = "";
  agenciaEmbarqueVuelta: string = "";

  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";

  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;

  idServicioVuelta: number = 0;
  idItinerarioVuelta: number = 0;
  idRutaVuelta: number = 0;
  fechaEmbarqueVuelta: string = "";
  fechaDesembarqueVuelta: string = "";
  horaDesembarqueVuelta: string = "";
  agenciaDesembarqueVuelta: string = "";
  direccionEmbarqueVuelta: string = "";
  direccionDesembarqueVuelta: string = "";
  idAgenciaEmbarqueVuelta: number = 0;
  idAgenciaDesembarqueVuelta: number = 0;
  array_pisos_final: any[] = [];
  estructura_bus_vuelta: any = [];
  titulo_detalle_piso_1: string = "";
  titulo_detalle_piso_2: string = "";
  num_asientos: string = "";
  num_asientos_vuelta: string = "";
  num_asientos_vuelta_p1: string = "";
  num_asientos_vuelta_p2: string = "";
  precio_asientos_vuelta: Array<string> = [];
  asientos_seleccionados: Array<string> = [];
  cont_asientos: number = 0;

  precio_vuelta_total: number = 0;
  precio_descuento_vuelta: number = 0;

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

    if(this.sharedService.getDatosAsientosVuelta() == undefined){
      this.router.navigate(['operaciones/ventas-reserva/itinerario']);
    }else{
      $(".loader").fadeIn("slow");

      this.DatosItinerario = this.sharedService.getDatosAsientosVuelta();
      //console.log(this.DatosItinerario);

      this.servicioIda = this.DatosItinerario['servicioIda'];
      this.servicioVuelta = this.DatosItinerario['servicioVuelta'];
      this.nombre_ciudad_origen = this.DatosItinerario['nombre_ciudad_origen'];
      this.nombre_ciudad_destino = this.DatosItinerario['nombre_ciudad_destino'];
      this.nombreFechaIda = this.funcionesService.convert_nom_fecha(this.DatosItinerario['fechaEmbarqueIda']);
      this.horaEmbarqueIda = this.DatosItinerario['horaEmbarqueIda'];
      this.agenciaEmbarqueIda = this.DatosItinerario['agenciaEmbarqueIda'];
      this.nombreFechaVuelta = this.funcionesService.convert_nom_fecha(this.DatosItinerario['date_retorno']);
      this.horaEmbarqueVuelta = this.DatosItinerario['horaEmbarqueVuelta'];
      this.agenciaEmbarqueVuelta = this.DatosItinerario['agenciaEmbarqueVuelta'];

      this.ida_vuelta = this.DatosItinerario['ida_vuelta'];

      this.idServicioVuelta = this.DatosItinerario['idServicioVuelta'];
      this.fechaEmbarqueVuelta = this.DatosItinerario['fechaEmbarqueVuelta'];
      this.codLocalidadIda = this.DatosItinerario['codLocalidadIda'];
      this.codLocalidadDestino = this.DatosItinerario['codLocalidadDestino'];

      this.cant_max_asientos = this.taskService.LIMITE_CANTIDAD_ASIENTOS;

      if(this.sharedService.getRegresarDatosAsientosVuelta() != undefined){
        var DatosAsientosVuelta = this.sharedService.getRegresarDatosAsientosVuelta();
        //console.log(DatosAsientosIda);

        /********************** DESBLOQUEAR ASIENTOS **********************/
        if(DatosAsientosVuelta['numAsientosVuelta'].includes(",")){
          var part_asi = DatosAsientosVuelta['numAsientosVuelta'].split(",");

          for(var a=0; a<part_asi.length; a++){
            var part_asi2 = String(part_asi[a]).split("-");
            let list_asientos: any = [];
            let list_pisos: any = [];

            list_asientos.push(Number(part_asi2[0]));
            list_pisos.push(Number(part_asi2[1])); 
          
            var part_fecha = DatosAsientosVuelta['fechaEmbarqueIda'].split("-");
            var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
    
            this.taskService.deleteLiberarAsiento(Number(DatosAsientosVuelta['idRutaVuelta']), Number(DatosAsientosVuelta['idItinerarioVuelta']), fecha_partida, list_asientos, DatosAsientosVuelta['horaEmbarqueVuelta'], list_pisos, 5, Number(DatosAsientosVuelta['precioAsientosVuelta'][a]), this.idUsuario, this.idHardware).subscribe(response => {
              if(response['result'] == true){console.log("Se desbloqueó el asiento.");}else{console.log("No se desbloqueó el asiento.");}
            });
          }
        }else if(DatosAsientosVuelta['numAsientosVuelta']!="" && !DatosAsientosVuelta['numAsientosVuelta'].includes(",")){
          var part_asi = DatosAsientosVuelta['numAsientosVuelta'].split("-");
          var part_fecha = DatosAsientosVuelta['fechaEmbarqueIda'].split("-");
          var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

          let list_asientos: any = [];
          let list_pisos: any = [];

          list_asientos.push(Number(part_asi[0]));
          list_pisos.push(Number(part_asi[1]));
    
          this.taskService.deleteLiberarAsiento(Number(DatosAsientosVuelta['idRutaVuelta']), Number(DatosAsientosVuelta['idItinerarioVuelta']), fecha_partida, list_asientos, DatosAsientosVuelta['horaEmbarqueVuelta'], list_pisos, 5, Number(DatosAsientosVuelta['precioAsientosVuelta']), this.idUsuario, this.idHardware).subscribe(response => {
            if(response['result'] == true){console.log("Se desbloqueó el asiento.");}else{console.log("No se desbloqueó el asiento.");}
          });
        }
        /********************** DESBLOQUEAR ASIENTOS **********************/

        this.sharedService.enviarRegresarDatosAsientosVuelta(undefined);
      }

      setTimeout(() => {
        this.getDatosEstructuraBusVuelta(this.DatosItinerario);

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
          this.funcionesService.mostrar_modal("modal_limitmax");
        }
      }

      this.calcular_pasajeros();

      var resultado_text = this.calcular_asientos_iguales();

      if(resultado_text == "si"){
        $('#btn_desktop_confirm_asient').css('display', 'inline-block');
      }else{
        $('#btn_desktop_confirm_asient').css('display', 'none');
      }

      /*if(this.innerWidth<800){
        $('#precio_total_mobile_normal').css('display', 'inline');
        $('#precio_total_mobile_promocion').css('display', 'none');
      }else{
        $('#precio_total_desktop_normal').css('display', 'inline');
        $('#precio_total_desktop_promocion').css('display', 'none');
      }*/
    }
  }

  calcular_asientos_iguales(){
    if(isPlatformBrowser(this.platformId)){
      var cont_asientos_ida = 0;

      if(this.DatosItinerario['numAsientosIda'] != "" && this.DatosItinerario['numAsientosIda'].includes(",")){
        var part_asi_idap_1 = this.DatosItinerario['numAsientosIda'].split(",");
        for(var a=0; a<part_asi_idap_1.length; a++){
          cont_asientos_ida++;
        }
      }else if(this.DatosItinerario['numAsientosIda'] != "" && !this.DatosItinerario['numAsientosIda'].includes(",")){
        cont_asientos_ida = 1;
      }else{
        cont_asientos_ida = 0;
      }

      var cont_asientos_vuelta = 0;
      if(this.num_asientos_vuelta != "" && this.num_asientos_vuelta.includes(",")){
        var part_asi_vueltap_1 = this.num_asientos_vuelta.split(",");
        for(var a=0; a<part_asi_vueltap_1.length; a++){
          cont_asientos_vuelta++;
        }
      }else if(this.num_asientos_vuelta != "" && !this.num_asientos_vuelta.includes(",")){
        cont_asientos_vuelta = 1;
      }else{
        cont_asientos_vuelta = 0;
      }

      if(cont_asientos_ida == cont_asientos_vuelta){
        return "si";
      }else{
        return "no";
      }
    }
    return "no";
  }

  calcular_pasajeros(){
    if(isPlatformBrowser(this.platformId)){
      this.num_asientos = "";
      this.precio_vuelta_total = 0;
      this.num_asientos_vuelta_p1 = "";
      this.num_asientos_vuelta_p2 = "";
      this.num_asientos_vuelta = "";
      this.precio_asientos_vuelta = [];

      for(var a=0; a<this.asientos_seleccionados.length; a++){
        
        var part_asi = this.asientos_seleccionados[a].split("_");

        if(part_asi[0] == "0"){
          if(this.num_asientos_vuelta_p1 == ""){
            this.num_asientos_vuelta_p1 = part_asi[1];
          }else{
            this.num_asientos_vuelta_p1 = this.num_asientos_vuelta_p1+","+part_asi[1];
          }
        }

        if(part_asi[0] == "1"){
          if(this.num_asientos_vuelta_p2 == ""){
            this.num_asientos_vuelta_p2 = part_asi[1];
          }else{
            this.num_asientos_vuelta_p2 = this.num_asientos_vuelta_p2+","+part_asi[1];
          }
        }

        if(this.num_asientos_vuelta == ""){
          this.num_asientos_vuelta = part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_vuelta.push(part_asi[2]);
        }else{
          this.num_asientos_vuelta = this.num_asientos_vuelta+","+part_asi[1]+"-"+part_asi[0];
          this.precio_asientos_vuelta.push(part_asi[2]);
        }

        if(part_asi[0] != ""){
          if(this.num_asientos == ""){
            this.num_asientos = part_asi[1];
          }else{
            this.num_asientos = this.num_asientos+","+part_asi[1];
          }
        }
        
        this.precio_vuelta_total = this.precio_vuelta_total + parseFloat(part_asi[2]);
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
      "fechaEmbarqueVuelta": this.DatosItinerario['fechaEmbarqueVuelta'],
      "fechaDesembarqueVuelta": this.DatosItinerario['fechaDesembarqueVuelta'],
      "horaEmbarqueVuelta": this.DatosItinerario['horaEmbarqueVuelta'],
      "horaDesembarqueVuelta": this.DatosItinerario['horaDesembarqueVuelta'],
      "agenciaEmbarqueVuelta": this.DatosItinerario['agenciaEmbarqueVuelta'],
      "agenciaDesembarqueVuelta": this.DatosItinerario['agenciaDesembarqueVuelta'],
      "direccionEmbarqueVuelta": this.DatosItinerario['direccionEmbarqueVuelta'],
      "direccionDesembarqueVuelta": this.DatosItinerario['direccionDesembarqueVuelta'],
      "idAgenciaEmbarqueVuelta": this.DatosItinerario['idAgenciaEmbarqueVuelta'],
      "idAgenciaDesembarqueVuelta": this.DatosItinerario['idAgenciaDesembarqueVuelta'],
      "idServicioVuelta": this.DatosItinerario['idServicioVuelta'],
      "servicioVuelta": this.DatosItinerario['servicioVuelta'],
      "idItinerarioVuelta": this.DatosItinerario['idItinerarioVuelta'],
      "idRutaVuelta": this.DatosItinerario['idRutaVuelta'],
      "numAsientosIda": this.DatosItinerario['numAsientosIda'],
      "numAsientosIdaP1": this.DatosItinerario['numAsientosIdaP1'],
      "numAsientosIdaP2": this.DatosItinerario['numAsientosIdaP2'],
      "estructuraBusIda": this.DatosItinerario['estructuraBusIda'],
      "numAsientosVuelta": this.num_asientos_vuelta,
      "numAsientosVueltaP1": this.num_asientos_vuelta_p1,
      "numAsientosVueltaP2": this.num_asientos_vuelta_p2,
      "estructuraBusVuelta": this.estructura_bus_vuelta,
      "listaIdaDisponibles": this.DatosItinerario['listaIdaDisponibles'],
      "listaVueltaDisponibles": this.DatosItinerario['listaVueltaDisponibles'],
      "ida_vuelta": this.DatosItinerario['ida_vuelta'],
      "precioAsientosIda": this.DatosItinerario['precioAsientosIda'],
      "precioAsientosVuelta": this.precio_asientos_vuelta,
      "precioTotalIda": this.DatosItinerario['precioTotalIda'],
      "precioTotalVuelta": this.precio_vuelta_total,
      "precioTotal": this.DatosItinerario['precioTotalIda'] + this.precio_vuelta_total,
      "date_salida": this.DatosItinerario['date_salida'],
      "date_retorno": this.DatosItinerario['date_retorno']
    };

    //console.log(dat);

    if(dat.numAsientosVuelta.includes(",")){
      var part_asi = dat.numAsientosVuelta.split(",");
      let list_asientos: any = [];
      let list_pisos: any = [];

      for(var a=0; a<part_asi.length; a++){
        var part_asi2 = String(part_asi[a]).split("-");
        
        list_asientos.push(Number(part_asi2[0]));
        list_pisos.push(Number(part_asi2[1]));
      }
      
      var part_fecha = dat.fechaEmbarqueVuelta.split("-");
      var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

      this.taskService.postBloquearAsiento(Number(dat.idRutaVuelta), Number(dat.idItinerarioVuelta), fecha_partida, list_asientos, dat.horaEmbarqueVuelta, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosVuelta[a]), this.idUsuario, this.idHardware).subscribe(response => {
        if(response['result'] == true){
          this.sharedService.enviarDatosPasajeros(dat);
          this.router.navigate(['operaciones/ventas-reserva/datos-pasajeros']);
        }else{
          this.getDatosEstructuraBusVuelta(this.DatosItinerario);
          this.cont_asientos = 0;
          this.asientos_seleccionados = [];
          this.calcular_pasajeros();
          this.funcionesService.mostrar_modal("modal_asientos_ocupados");

          this.funcionesService.notificacion_mensaje("Error", "Los asientos están ocupados, elija otros asientos.");
        }
      });
    }else if(dat.numAsientosVuelta!="" && !dat.numAsientosVuelta.includes(",")){
      var part_asi = dat.numAsientosVuelta.split("-");
      var part_fecha = dat.fechaEmbarqueVuelta.split("-");
      var fecha_partida = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];

      let list_asientos: any = [];
      let list_pisos: any = [];

      list_asientos.push(Number(part_asi[0]));
      list_pisos.push(Number(part_asi[1])); 

      this.taskService.postBloquearAsiento(Number(dat.idRutaVuelta), Number(dat.idItinerarioVuelta), fecha_partida, list_asientos, dat.horaEmbarqueVuelta, list_pisos, this.tiempoBloqueoAsiento, Number(dat.precioAsientosVuelta), this.idUsuario, this.idHardware).subscribe(response => {
        if(response['result'] == true){
          this.sharedService.enviarDatosPasajeros(dat);
          this.router.navigate(['operaciones/ventas-reserva/datos-pasajeros']);
        }else{
          this.getDatosEstructuraBusVuelta(this.DatosItinerario);
          this.cont_asientos = 0;
          this.asientos_seleccionados = [];
          this.calcular_pasajeros();
          this.funcionesService.mostrar_modal("modal_asientos_ocupados");

          this.funcionesService.notificacion_mensaje("Error", "El asiento está ocupado, elija otros asiento.");
        }
      });
    }
  }

  getDatosEstructuraBusVuelta(getDatosItinerarioVuelta: any){
    this.taskService.getEstructuraBus(getDatosItinerarioVuelta['idItinerarioVuelta'], getDatosItinerarioVuelta['idRutaVuelta']).subscribe(responseEstructuraBus => {
      this.estructura_bus_vuelta = responseEstructuraBus;
      this.array_pisos_final = this.funcionesService.ordenarEstructuraBus(responseEstructuraBus);
    });
  }

  btn_atras(){
    this.sharedService.enviarDatosItinerarioVuelta(this.DatosItinerario);
    this.router.navigate(['operaciones/ventas-reserva/itinerario-retorno']);
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
