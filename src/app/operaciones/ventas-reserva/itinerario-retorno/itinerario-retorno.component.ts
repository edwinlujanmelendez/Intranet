import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-itinerario-retorno',
  templateUrl: './itinerario-retorno.component.html',
  styleUrls: ['./itinerario-retorno.component.css']
})
export class ItinerarioRetornoComponent implements OnInit {

  public innerWidth: any;

  num_paso: number = 3;
  paso_final: number = 5;
  porcen_bar: number = 75;
  detalle_paso: string = "Vuelta";
  detalle_paso2: string = "Itinerario";
  sub_titulo: string = "Selecciona el servicio y horario.";

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  DatosItinerario: any;

  listadoItinerariosVuelta: any = [];

  servicioIda: string = "";
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  nombreFechaIda: string = "";
  horaEmbarqueIda: string = "";
  agenciaEmbarqueIda: string = "";
  nombreFechaVuelta: string = "";
  
  ida_vuelta: number = 0;

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
    $(".loader").fadeIn("slow");

    if(this.sharedService.getDatosItinerarioVuelta() == undefined){
      this.router.navigate(['operaciones/ventas-reserva/itinerario']);
    }else{
      $(".loader").fadeOut("slow");

      this.DatosItinerario = this.sharedService.getDatosItinerarioVuelta();
      //console.log(this.DatosItinerario);

      this.listadoItinerariosVuelta = this.DatosItinerario['listaVueltaDisponibles'];

      this.servicioIda = this.DatosItinerario['servicioIda'];
      this.nombre_ciudad_origen = this.DatosItinerario['nombre_ciudad_origen'];
      this.nombre_ciudad_destino = this.DatosItinerario['nombre_ciudad_destino'];
      this.nombreFechaIda = this.funcionesService.convert_nom_fecha(this.DatosItinerario['fechaEmbarqueIda']);
      this.horaEmbarqueIda = this.DatosItinerario['horaEmbarqueIda'];
      this.agenciaEmbarqueIda = this.DatosItinerario['agenciaEmbarqueIda'];
      this.nombreFechaVuelta = this.funcionesService.convert_nom_fecha(this.DatosItinerario['date_retorno']);
      this.ida_vuelta = this.DatosItinerario['ida_vuelta'];
    }
  }

  seleccionar_itinerario_vuelta(datos: any){
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
      "fechaEmbarqueVuelta": datos['fechaEmbarque'],
      "fechaDesembarqueVuelta": datos['fechaDesembarque'],
      "horaEmbarqueVuelta": datos['horaEmbarque'],
      "horaDesembarqueVuelta": datos['horaDesembarque'],
      "agenciaEmbarqueVuelta": datos['ageEmbarque'],
      "agenciaDesembarqueVuelta": datos['ageDesembarque'],
      "direccionEmbarqueVuelta": datos['direccionEmbarque'],
      "direccionDesembarqueVuelta": datos['direccionDesembarque'],
      "idAgenciaEmbarqueVuelta": datos['idAgeEmbarque'],
      "idAgenciaDesembarqueVuelta": datos['idAgeDesembarque'],
      "idServicioVuelta": datos['idServicio'],
      "servicioVuelta": datos['servicio'],
      "idItinerarioVuelta": datos['iditinerario'],
      "idRutaVuelta": datos['idruta'],
      "numAsientosIda": this.DatosItinerario['numAsientosIda'],
      "numAsientosIdaP1": this.DatosItinerario['numAsientosIdaP1'],
      "numAsientosIdaP2": this.DatosItinerario['numAsientosIdaP2'],
      "estructuraBusIda": this.DatosItinerario['estructuraBusIda'],
      "numAsientosVuelta": "",
      "numAsientosVueltaP1": "",
      "numAsientosVueltaP2": "",
      "estructuraBusVuelta": [],
      "listaIdaDisponibles": this.DatosItinerario['listaIdaDisponibles'],
      "listaVueltaDisponibles": this.DatosItinerario['listaVueltaDisponibles'],
      "ida_vuelta": this.DatosItinerario['ida_vuelta'],
      "precioAsientosIda": this.DatosItinerario['precioAsientosIda'],
      "precioAsientosVuelta": [],
      "precioTotalIda": this.DatosItinerario['precioTotalIda'],
      "precioTotalVuelta": 0,
      "precioTotal": this.DatosItinerario['precioTotal'],
      "date_salida": this.DatosItinerario['date_salida'],
      "date_retorno": this.DatosItinerario['date_retorno']
    };

    this.sharedService.enviarDatosAsientosVuelta(dat);
    this.router.navigate(['operaciones/ventas-reserva/asientos-retorno']);
  }

  btn_atras(){
    this.sharedService.enviarRegresarDatosAsientosIda(this.DatosItinerario);
    this.router.navigate(['operaciones/ventas-reserva/asientos']);
  }

  verificar_punto(precioMinimo: any){
    var precio_minimo = String(precioMinimo);
    if(precio_minimo.includes('.')){
      return 1;
    }else{
      return 2;
    }
  }
}
