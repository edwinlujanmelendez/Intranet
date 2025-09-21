import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { TaskService } from '../../../services/task.service';
import { FuncionesService } from '../../../funciones/funciones.service';
//import * as XLSX from 'xlsx';

declare var $:any;

@Component({
  selector: 'app-seguimiento-frotcom',
  templateUrl: './seguimiento-frotcom.component.html',
  styleUrls: ['./seguimiento-frotcom.component.css']
})
export class SeguimientoFrotcomComponent implements OnInit {

  date!: Date;
  date_actual: string = "";
  maxFechaInicio: string = "";
  minFechaFin: string = "";
  maxFechaFin: string = "";

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";

  ltLocalidadOrigen: any;
  ltLocalidadDestino: any;
  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;

  ListReporteSeguimientoFrotcom: any = [];

  constructor(private tokenService: TokenService, private taskService: TaskService, public funcionesService: FuncionesService){
  }

  ngOnInit(): void {
    this.tokenService.verificarToken();

    this.setToday();
    this.date_fecha_inicio = this.date_actual;
    this.date_fecha_fin = this.date_actual;

    this.maxFechaInicio = this.date_actual;
    this.maxFechaFin = this.date_actual;
  }

  ngAfterViewInit(){
    this.taskService.getLocalidad().subscribe(responseLocalidad => {
      this.ltLocalidadOrigen = responseLocalidad;
    });

    $("#tabla_reportes").DataTable();
  }

  formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  setToday() {
    const today = new Date();
    this.date_actual = this.formatDate(today);
  }

  // 📌 Evento cuando cambia la fecha de inicio
  onFechaInicioChange() {
    if (this.date_fecha_inicio) {
      const inicio = new Date(this.date_fecha_inicio);

      // fecha fin mínima = inicio
      this.minFechaFin = this.formatDate(inicio);

      // fecha fin máxima = inicio + 15 días (o hoy si es menor)
      const maxFin = new Date(inicio);
      maxFin.setDate(inicio.getDate() + 15);
      this.maxFechaFin = maxFin > new Date(this.date_actual) ? this.date_actual : this.formatDate(maxFin);

      // si la fecha fin está fuera del rango, la ajusto
      if (this.date_fecha_fin < this.minFechaFin || this.date_fecha_fin > this.maxFechaFin) {
        this.date_fecha_fin = this.minFechaFin;
      }
    }
  }

  // 📌 Evento cuando cambia la fecha de fin
  onFechaFinChange() {
    if (this.date_fecha_fin) {
      const fin = new Date(this.date_fecha_fin);

      // fecha inicio máxima = fin
      this.maxFechaInicio = this.formatDate(fin);

      // fecha inicio mínima = fin - 15 días
      const minInicio = new Date(fin);
      minInicio.setDate(fin.getDate() - 15);
      this.date_fecha_inicio = this.date_fecha_inicio || this.formatDate(minInicio);

      // si la fecha inicio está fuera del rango, la ajusto
      if (this.date_fecha_inicio > this.maxFechaInicio || this.date_fecha_inicio < this.formatDate(minInicio)) {
        this.date_fecha_inicio = this.formatDate(minInicio);
      }
    }
  }

  onChangeOrigen(){
    if(this.codLocalidadIda == 0){
      this.taskService.getLocalidad().subscribe(responseLocalidad => {
        this.ltLocalidadDestino = responseLocalidad;
      });
    }else{
      this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(response => {
        this.ltLocalidadDestino = response;
      });
    }
  }

  buscarReporte(){
    this.ListReporteSeguimientoFrotcom = [];

    if(this.date_fecha_inicio != "" && this.date_fecha_fin != ""){
      $(".loader").fadeIn("slow");
      $("#tabla_reportes").DataTable().destroy();

      this.taskService.getSeguimientoFrotcom(this.codLocalidadIda, this.codLocalidadDestino, this.date_fecha_inicio, this.date_fecha_fin).subscribe(responseSeguimientoFrotcom => {
        //console.log(responseSeguimientoFrotcom);
        this.ListReporteSeguimientoFrotcom = responseSeguimientoFrotcom;

        setTimeout(() => {
          $("#tabla_reportes").DataTable({pageLength: 10,
            //filter: true,
            deferRender: true,
            scrollY: 400,
            scrollCollapse: true,
            scroller: true,
            "searching": true
          });
        }, 100);

        $(".loader").fadeOut("slow");
      });
    }
  }

  tableToExcel(): void {
    $(".loader").fadeIn("slow");

    const header = ['ITINERARIO', 'ORIGEN', 'DESTINO', 'EMBARQUE 1', 'HORARIO SALIDA', 'EMBARQUE 2', 'HORARIO SALIDA', 
                    'ESCALA COMERCIAL 1', 'HORARIO SALIDA', 'ESCALA COMERCIAL 2', 'HORARIO SALIDA', 'ESCALA COMERCIAL 3', 'HORARIO SALIDA', 'ESCALA COMERCIAL 4', 'HORARIO SALIDA', 'ESCALA COMERCIAL 5', 'HORARIO SALIDA', 
                    'DESEMBARQUE 1', 'HORA LLEGADA', 'DESEMBARQUE 2', 'HORA LLEGADA', 'DESEMBARQUE 3', 'HORA LLEGADA', 'DESEMBARQUE 4', 'HORA LLEGADA', 'DESEMBARQUE 5', 'HORA LLEGADA'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteSeguimientoFrotcom.length; i++) {
      body.push([
        `${this.ListReporteSeguimientoFrotcom[i]['itinerario_id']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['origen']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['destino']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['embarque_1_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['embarque_1_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['embarque_2_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['embarque_2_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_1_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_1_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_2_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_2_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_3_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_3_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_4_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_4_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_5_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['escala_comercial_5_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_1_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_1_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_2_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_2_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_3_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_3_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_4_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_4_hora']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_5_nombre']}`,
        `${this.ListReporteSeguimientoFrotcom[i]['desembarque_5_hora']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteSeguimientoFrotcom');
    $(".loader").fadeOut("slow");
  }
}