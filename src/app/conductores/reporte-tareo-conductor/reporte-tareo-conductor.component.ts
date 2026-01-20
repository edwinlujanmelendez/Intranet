import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';

declare var $:any;

@Component({
  selector: 'app-reporte-tareo-conductor',
  templateUrl: './reporte-tareo-conductor.component.html',
  styleUrls: ['./reporte-tareo-conductor.component.css']
})
export class ReporteTareoConductorComponent implements OnInit {

  date_actual: string = "";

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";
  conductor: number = 0;

  ListReporteTareoConductor: any = [];
  ltPilotos: any = [];

  constructor(private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
    this.date_actual = this.funcionesService.getFechaHoyGuion();

    this.date_fecha_inicio = this.funcionesService.getFechaSemanaAtrasGuion();
    this.date_fecha_fin = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.taskService.getPilotos().subscribe(responsegetPilotos => {
      this.ltPilotos = responsegetPilotos;
    });

    this.mostrarDataReporte();    
  }

  mostrarDataReporte(){
    $(".loader").fadeIn("slow");

    this.ListReporteTareoConductor = [];

    $("#tabla_reportes").DataTable().destroy();

    this.taskService.getReporteTareoConductor(this.date_fecha_inicio, this.date_fecha_fin, this.conductor).subscribe(getReporteTareoConductor => {
      //console.log(getReporteTareoConductor);
      this.ListReporteTareoConductor = getReporteTareoConductor;

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

  tableToExcel(){
    $(".loader").fadeIn("slow");

    const header = ['FECHA PARTIDA', 'CONDUCTOR', 'TIPO CONDUCTOR', 'TURNO', 'UNIDAD', 'PLACA', 'SERVICIO', 'STATUS', 'ORIGEN', 'DESTINO', 'KILOMETRAJE', 'PRECIO RUTA'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteTareoConductor.length; i++) {
      body.push([
        `${this.ListReporteTareoConductor[i]['ruta_id']}`,
        `${this.ListReporteTareoConductor[i]['c_origen']}`,
        `${this.ListReporteTareoConductor[i]['c_destino']}`,
        `${this.ListReporteTareoConductor[i]['n_kilometros']}`,
        `${this.ListReporteTareoConductor[i]['n_horvia']}`,
        `${this.ListReporteTareoConductor[i]['precio_base']}`,
        `${this.ListReporteTareoConductor[i]['precio_economico']}`,
        `${this.ListReporteTareoConductor[i]['precio_ejecutivo']}`,
        `${this.ListReporteTareoConductor[i]['precio_presidencial']}`,
        `${this.ListReporteTareoConductor[i]['precio_premier']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteTareoConductor');
    $(".loader").fadeOut("slow");
  }
}