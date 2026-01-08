import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { SharedService } from '../../../shared.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.css']
})
export class ItinerarioComponent implements OnInit {

  public innerWidth: any;

  num_paso: number = 1;
  paso_final: number = 3;
  porcen_bar: number = 25;
  detalle_paso: string = "Ida";
  detalle_paso2: string = "Itinerario";
  sub_titulo: string = "Selecciona el servicio y horario.";

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  ltLocalidadOrigen: any;
  ltLocalidadDestino: any;
  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;
  listadoItinerariosIda: any = [];
  listadoItinerariosVuelta: any = [];
  nombre_ciudad_origen: string = "";
  nombre_ciudad_destino: string = "";
  nombreFechaIda: string = "";
  nombreFechaVuelta: string = "";

  ida_vuelta: number = 1;

  date_salida: string = "";
  date_retorno: string = "";
  tamanio_div: string = "";

  //token: string = "";

  constructor(private router:Router, private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService){
    this.date_actual = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit(){
    $(".loader").fadeIn("slow");

    /*this.taskService.getToken().subscribe(responseToken => {
      //console.log(responseToken);
      this.token = responseToken['jwt'];
    });*/

    setTimeout(() => {
      this.taskService.getLocalidad().subscribe(responseLocalidad => {
        //console.log(responseLocalidad);

        //this.codLocalidadIda = responseLocalidad[0].id;
        //this.codLocalidadDestino = responseLocalidad[0].id;

        this.ltLocalidadOrigen = responseLocalidad;
        this.ltLocalidadDestino = responseLocalidad;
      });

      if(this.sharedService.getRegresarDatosItinerarioIda() != undefined){
        var DataItinerarioIda = this.sharedService.getRegresarDatosItinerarioIda();
        //console.log(DataItinerarioIda);
        
        this.codLocalidadIda = Number(DataItinerarioIda['codLocalidadIda']);
        this.codLocalidadDestino = Number(DataItinerarioIda['codLocalidadDestino']);
        this.date_salida = DataItinerarioIda['fechaEmbarqueIda'];
        this.listadoItinerariosIda = DataItinerarioIda['listaIdaDisponibles'];
        this.nombre_ciudad_origen = DataItinerarioIda['nombre_ciudad_origen'];
        this.nombre_ciudad_destino = DataItinerarioIda['nombre_ciudad_destino'];

        if(DataItinerarioIda['ida_vuelta'] == 2){
          this.ida_vuelta = DataItinerarioIda['ida_vuelta'];
          this.date_retorno = DataItinerarioIda['date_retorno'];
          this.listadoItinerariosVuelta = DataItinerarioIda['listaVueltaDisponibles'];
        }
      }

      // TODO: VERIFICAR LIQUIDACIÓN
      let StorageUsuario = JSON.parse(localStorage.getItem('StorageUsuario') || '{}');
      let StorageUsuarioHardware = JSON.parse(localStorage.getItem('StorageUsuarioHardware') || '{}');
      this.taskService.getVerificarCajaAbierta(StorageUsuario['usuario_id'], StorageUsuarioHardware['agencia_id']).subscribe(responseVerificarCajaAbierta=> {
        if(responseVerificarCajaAbierta != null){                 // TODO: BIEN!!
          if(responseVerificarCajaAbierta['d_fecliq'] == this.date_actual){
            $('#div_vista_itinerario').css('display', 'inline-block');
            $('#div_vista_no_liquidacion').css('display', 'none');

            // TODO: ACTUALIZAR EL JSON DE LA LIQUIDACION ABIERTA
            localStorage.setItem("StorageLiquidacion", JSON.stringify(responseVerificarCajaAbierta));
          }else{
            $('#div_vista_itinerario').css('display', 'none');
            $('#div_vista_liquidacion_ayer').css('display', 'inline-block');
          }
        }else{          
          $('#div_vista_itinerario').css('display', 'none');
          $('#div_vista_no_liquidacion').css('display', 'inline-block');
          localStorage.setItem("StorageLiquidacion", JSON.stringify({}));
        }
      });

      $(".loader").fadeOut("slow");
    }, 250);
  }

  onChangeOrigen(){
    this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(response => {
      this.ltLocalidadDestino = response;
    });
  }

  buscar_itinerarios(){
    this.listadoItinerariosIda = [];
    this.listadoItinerariosVuelta = [];

    if(this.date_retorno == ""){this.ida_vuelta = 1;}else{this.ida_vuelta = 2;}

    $(".loader").fadeIn("slow");
    var ida_vuelta_iguales = this.verificarMismoDiaPorRuta(this.codLocalidadIda, this.codLocalidadDestino);

    let find1 = this.ltLocalidadOrigen.find(x => x.id == this.codLocalidadIda);
    this.nombre_ciudad_origen = String(find1?.denominacion);

    let find2 = this.ltLocalidadDestino.find(x => x.id == this.codLocalidadDestino);
    this.nombre_ciudad_destino = String(find2?.denominacion);

    this.nombreFechaIda = this.funcionesService.convert_nom_fecha(this.date_salida);

    this.taskService.getItinerario(this.codLocalidadIda, this.codLocalidadDestino, this.date_salida, this.date_retorno, ida_vuelta_iguales, 120).subscribe(responseItinerario => {
      //console.log(responseItinerario);

      if(responseItinerario['listaIdaDisponibles'].length != 0){
        this.listadoItinerariosIda = responseItinerario['listaIdaDisponibles'];

        this.listadoItinerariosIda = this.listadoItinerariosIda.map(dat => ({...dat,
          c_desc_escalas: this.generarDescripcionEscalasIda(dat.c_desc_escalas)
        }));

        if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] != null){
          this.listadoItinerariosVuelta = responseItinerario['listaVueltaDisponibles'];

          this.listadoItinerariosVuelta = this.listadoItinerariosVuelta.map(dat => ({...dat,
            c_desc_escalas: this.generarDescripcionEscalasVuelta(dat.c_desc_escalas)
          }));
        }else if(this.ida_vuelta == 2 && responseItinerario['listaVueltaDisponibles'] == null){
          this.ida_vuelta = 1;
          //this.funcionesService.mostrar_modal("modal_not_tickets_vuelta");
        }
      }else{
        //this.funcionesService.mostrar_modal("modal_not_tickets_ida");
      }

      $(".loader").fadeOut("slow");
    }, error => {
      this.funcionesService.notificacion_mensaje("Warning", "Error al buscar viajes.");
    }, () => {
      $(".loader").fadeOut("slow");

      /*if(this.ida_vuelta == 2){
        this.nombreFechaVuelta = this.funcionesService.convert_nom_fecha(this.date_retorno);
      }*/
    });
  }

  contarEscalas(cadena: string): number {
    if (!cadena) return 0;
    return cadena.split('-').length;
  }

  generarDescripcionEscalasIda(descripcionEscalas: string){
    var nombre_origen = "";
    if(this.nombre_ciudad_origen.includes("Lima")){ nombre_origen = "LIMA"; }else{ nombre_origen = this.nombre_ciudad_origen; }

    var nombre_destino = "";
    if(this.nombre_ciudad_destino.includes("Lima")){ nombre_destino = "LIMA"; }else{ nombre_destino = this.nombre_ciudad_destino; }

    return this.obtenerTramosIntermedios(descripcionEscalas, nombre_origen, nombre_destino);
  }

  generarDescripcionEscalasVuelta(descripcionEscalas: string){
    var nombre_origen = "";
    if(this.nombre_ciudad_origen.includes("Lima")){ nombre_origen = "LIMA"; }else{ nombre_origen = this.nombre_ciudad_origen; }

    var nombre_destino = "";
    if(this.nombre_ciudad_destino.includes("Lima")){ nombre_destino = "LIMA"; }else{ nombre_destino = this.nombre_ciudad_destino; }

    return this.obtenerTramosIntermedios(descripcionEscalas, nombre_destino, nombre_origen);
  }

  obtenerTramosIntermedios(escalas: string | null, origen: string, destino: string): string {
    try {
      // Si escalas es null, vacío o solo espacios
      if (!escalas || escalas.trim() === '') {
        return '';
      }

      // Convertimos las escalas en lista, separadas por "-"
      const lista = escalas
        .split(/\s*-\s*/)
        .map(e => e.trim().toUpperCase())
        .filter(e => e.length > 0);

      const indexOrigen = lista.indexOf(origen.toUpperCase());
      const indexDestino = lista.indexOf(destino.toUpperCase());

      // Si el destino no se encuentra, tomamos todo
      const fin = indexDestino === -1 ? lista.length : indexDestino;

      // Si el origen no está, asumimos que empieza desde el primer tramo
      const inicio = indexOrigen === -1 ? -1 : indexOrigen;

      // Obtenemos los tramos intermedios
      const tramos = lista.slice(inicio + 1, fin);

      if (tramos.length === 0) {
        return '';
      }

      return tramos.join('-');

    } catch (e) {
      console.error(e);
      return '';
    }
  }

  seleccionar_itinerario_ida(datos: any){
    var dat = {
      "nombre_ciudad_origen": this.nombre_ciudad_origen,
      "nombre_ciudad_destino": this.nombre_ciudad_destino,
      "fechaEmbarqueIda": datos['fechaEmbarque'],
      "fechaDesembarqueIda": datos['fechaDesembarque'],
      "horaEmbarqueIda": datos['horaEmbarque'],
      "horaDesembarqueIda": datos['horaDesembarque'],
      "agenciaEmbarqueIda": datos['ageEmbarque'],
      "agenciaDesembarqueIda": datos['ageDesembarque'],
      "direccionEmbarqueIda": datos['direccionEmbarque'],
      "direccionDesembarqueIda": datos['direccionDesembarque'],
      "idAgenciaEmbarqueIda": datos['idAgeEmbarque'],
      "idAgenciaDesembarqueIda": datos['idAgeDesembarque'],
      "idServicioIda": datos['idServicio'],
      "servicioIda": datos['servicio'],
      "idItinerarioIda": datos['iditinerario'],
      "idRutaIda": datos['idruta'],
      "listaIdaDisponibles": this.listadoItinerariosIda,
      "listaVueltaDisponibles": this.listadoItinerariosVuelta,
      "ida_vuelta": this.ida_vuelta,
      "codLocalidadIda": this.codLocalidadIda,
      "codLocalidadDestino": this.codLocalidadDestino,
      "date_salida": this.date_salida,
      "date_retorno": this.date_retorno,
      "descripcionEscalasIda": datos['c_desc_escalas'],
      "descripcionEscalasVuelta": ""
    };

    this.sharedService.enviarDatosAsientosIda(dat);
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

  verificarMismoDiaPorRuta(codCiudadOrigen: any, codCiudadDestino: any){
    // TODO: Lima-Huacho, Huacho-Lima, Lima-Barranca, Barranca-Lima, Lima-Paramonga, Paramonga-Lima
    /**
     * Lima: 72
     * Huacho: 59
     * Barranca: 13
     * Paramonga: 73 
     */

    var x = 0;

    if(codCiudadOrigen == 72 && codCiudadDestino == 59){
      x = 1;
    }else if(codCiudadOrigen == 59 && codCiudadDestino == 72){
      x = 1;
    }else if(codCiudadOrigen == 72 && codCiudadDestino == 13){
      x = 1;
    }else if(codCiudadOrigen == 13 && codCiudadDestino == 72){
      x = 1;
    }else if(codCiudadOrigen == 72 && codCiudadDestino == 73){
      x = 1;
    }else if(codCiudadOrigen == 73 && codCiudadDestino == 72){
      x = 1;
    }else{
      x = 0;
    }

    return x;
  }
}
