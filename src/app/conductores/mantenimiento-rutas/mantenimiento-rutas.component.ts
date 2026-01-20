import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';

declare var $:any;

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.component.html',
  styleUrls: ['./mantenimiento-rutas.component.css']
})
export class MantenimientoRutasComponent implements OnInit {

  date_actual: string = "";

  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;

  ltLocalidadOrigen: any;
  ltLocalidadDestino: any;

  ListReporteMantenimientoRutas: any = [];

  constructor(private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
    this.date_actual = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.taskService.getLocalidad().subscribe(responseLocalidad => {
      this.ltLocalidadOrigen = responseLocalidad;
      this.ltLocalidadDestino = responseLocalidad;
    });

    this.mostrarDataReporte();
  }

  mostrarDataReporte(){
    $(".loader").fadeIn("slow");

    this.ListReporteMantenimientoRutas = [];

    $("#tabla_reportes").DataTable().destroy();

    this.taskService.getReporteMantenimientoRuta(this.codLocalidadIda, this.codLocalidadDestino).subscribe(responsegetReporteMantenimientoRuta => {
      //console.log(responsegetReporteMantenimientoRuta);
      this.ListReporteMantenimientoRutas = responsegetReporteMantenimientoRuta;

      setTimeout(() => {
        $('#tabla_reportes').DataTable({
          pageLength: 10,
          deferRender: true,
          scrollY: 400,
          scrollCollapse: true,
          scroller: true,
          searching: true
        });
        $(".loader").fadeOut("slow");
      }, 200);
    });
  }

  onChangeOrigen(){
    this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(response => {
      this.ltLocalidadDestino = response;
    });
  }

  cargarActualizarReporte(){

  }

  tableToExcel(){
    $(".loader").fadeIn("slow");

    const header = ['ID RUTA', 'ORIGEN', 'DESTINO', 'KILOMETROS', 'HORAS DE VIAJE', 'PRECIO BASE', 'PRECIO ECONOMICO', 'PRECIO EJECUTIVO', 'PRECIO PRESIDENCIAL', 'PRECIO PREMIER'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteMantenimientoRutas.length; i++) {
      body.push([
        `${this.ListReporteMantenimientoRutas[i]['ruta_id']}`,
        `${this.ListReporteMantenimientoRutas[i]['c_origen']}`,
        `${this.ListReporteMantenimientoRutas[i]['c_destino']}`,
        `${this.ListReporteMantenimientoRutas[i]['n_kilometros']}`,
        `${this.ListReporteMantenimientoRutas[i]['n_horvia']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_base']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_economico']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_ejecutivo']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_presidencial']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_premier']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteMantenimientoRutas');
    $(".loader").fadeOut("slow");
  }
}