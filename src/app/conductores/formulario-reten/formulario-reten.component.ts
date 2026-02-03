import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';

declare var $:any;

@Component({
  selector: 'app-formulario-reten',
  templateUrl: './formulario-reten.component.html',
  styleUrls: ['./formulario-reten.component.css']
})
export class FormularioRetenComponent implements OnInit {

  ArrayMostrarModal: any = [];

  date_actual: string = "";

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";

  date_fecha_inicio_modal: string = "";
  date_fecha_fin_modal: string = "";

  ListReporteFormularioReten: any = [];

  ltPilotos: any = [];
  ltAgencias: any = [];

  idRegistroEliminar: number = 0;

  constructor(private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
    this.date_actual = this.funcionesService.getFechaHoyGuion();

    this.date_fecha_inicio = this.funcionesService.getFechaSemanaAtrasGuion();
    this.date_fecha_fin = this.funcionesService.getFechaHoyGuion();

    this.date_fecha_inicio_modal = this.funcionesService.getFechaHoyGuion();
    this.date_fecha_fin_modal = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.taskService.getPilotos().subscribe(responsegetPilotos => {
      this.ltPilotos = responsegetPilotos;
    });

    this.taskService.getAgencias(0).subscribe(responsegetAgencias => {
      this.ltAgencias = responsegetAgencias;
    });

    this.mostrarDataReporte();
  }

  mostrarDataReporte(){
    $(".loader").fadeIn("slow");

    this.ListReporteFormularioReten = [];

    $("#tabla_reportes").DataTable().destroy();

    this.taskService.getReporteFormularioReten(this.date_fecha_inicio, this.date_fecha_fin).subscribe(responsegetReporteFormularioReten => {
      //console.log(responsegetReporteFormularioReten);
      this.ListReporteFormularioReten = responsegetReporteFormularioReten;

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

  buscarUnidad(evt){
    var text_unidad = $('#'+evt.target.id).val();

    if(text_unidad != ""){
      this.taskService.getDatosBus(text_unidad).subscribe(responsegetDatosBus => {
        //console.log(responsegetDatosBus);
        if(responsegetDatosBus != null){
          $("#placa").val(responsegetDatosBus['c_numplaca']);
          $("#servicio").val(responsegetDatosBus['c_nomcor']);
        }else{
          $("#placa").val("");
          $("#servicio").val("");
        }
      });
    }else{
      $("#placa").val("");
      $("#servicio").val("");
    }
  }

  agregarFormularioReten(){
    this.abrirModal('modal_create_editar_conductor');
  }

  tableToExcel(){
    $(".loader").fadeIn("slow");

    const header = ['FECHA PARTIDA', 'NOMBRE CONDUCTOR', 'TIPO', 'UNIDAD', 'PLACA', 'SERVICIO', 'TIPO', 'CIUDAD', 'OBSERVACIONES'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteFormularioReten.length; i++) {
      body.push([
        `${this.funcionesService.convert_format_fecha_barra(this.ListReporteFormularioReten[i]['fecha_partida'])}`,
        `${this.ListReporteFormularioReten[i]['nombre_conductor']}`,
        `${this.ListReporteFormularioReten[i]['tipo']}`,
        `${this.ListReporteFormularioReten[i]['unidad']}`,
        `${this.ListReporteFormularioReten[i]['placa']}`,
        `${this.ListReporteFormularioReten[i]['servicio']}`,
        `${this.ListReporteFormularioReten[i]['tipo']}`,
        `${this.ListReporteFormularioReten[i]['nombre_agencia']}`,
        `${this.clean(this.ListReporteFormularioReten[i]['observaciones'])}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteMantenimientoRutas');
    $(".loader").fadeOut("slow");
  }

  clean(v: any){
    if (v === null || v === undefined) return '';
    const s = String(v).trim();
    return (s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') ? '' : s;
  };
  
  getDiffDays(start: Date, end: Date): number {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  }

  guardarRegistroPiloto(){
    const fechaInicio = this.date_fecha_inicio_modal; // ejm: 2026-01-21
    const fechaFin    = this.date_fecha_fin_modal;    // ejm: 2026-01-27

    const start = new Date(fechaInicio + "T00:00:00");
    const end   = new Date(fechaFin + "T00:00:00");

    const total = this.getDiffDays(start, end) + 1; // o total = rango.length si lo manejas así
    let terminados = 0;
    let todoBien = true;

    for(let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)){
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      const fechaPartida = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD

      var data = {
        'formularioreten_id': $("#formularioreten_id").val(),
        'fecha_partida': this.funcionesService.convertir_barra_fecha_hora(fechaPartida),
        'id_conductor': $('#conductor').val(),
        'nombre_conductor': "",
        'agencia_id': $('#agencia').val(),
        'nombre_agencia': "",
        'tipo_conductor': $('#tipo_conductor').val(),
        'unidad': $('#unidad').val(),
        'placa': $('#placa').val(),
        'servicio': $('#servicio').val(),
        'tipo': $('#tipo').val(),
        'observaciones': $('#texto_observaciones').val()
      }

      this.taskService.insertUpdateFormularioReten(data).subscribe(responseinsertUpdateFormularioReten => {
        if (responseinsertUpdateFormularioReten['result'] == true) {
          //console.log("todo bien");
        } else {
          //console.log("todo mal");
          todoBien = false;
        }

        terminados++;

        // recién cuando termina el último
        if (terminados === total) {
          if (todoBien) {
            this.cerrarModal('modal_create_editar_conductor');
            this.mostrarDataReporte();
          } else {
            console.log("Hubo errores en algunos inserts, no se cerrará el modal.");
          }
        }
      }, error => {
        //console.log("todo mal");
        todoBien = false;
        terminados++;

        if (terminados === total) {
          console.log("Hubo errores en algunos inserts, no se cerrará el modal.");
        }
      });
    }
  }

  editarConductor(dat: any){
    this.abrirModal('modal_create_editar_conductor');
    
    setTimeout(() => {
      $("#formularioreten_id").val(dat['formularioreten_id']);
      this.date_fecha_inicio_modal = (dat['fecha_partida']).replace(" 00:00:00", "");
      this.date_fecha_fin_modal = (dat['fecha_partida']).replace(" 00:00:00", "");
      $("#conductor").val(Number(dat['id_conductor']));
      $("#tipo_conductor").val(dat['tipo_conductor']);
      $("#agencia").val(Number(dat['agencia_id']));
      $("#unidad").val(dat['unidad']);
      $("#placa").val(dat['placa']);
      $("#servicio").val(dat['servicio']);
      $("#tipo").val(dat['tipo']);
      $("#texto_observaciones").val(dat['observaciones']);
    }, 10);
  }

  preguntarEliminarConductor(dat: any){
    this.idRegistroEliminar = Number(dat['formularioreten_id']);
    this.abrirModal("modal_confirmar_eliminar");
  }

  eliminarConductor(){
    this.taskService.eliminarRegistroFormularioReten(this.idRegistroEliminar).subscribe(responseeliminarRegistroFormularioReten => {
        if (responseeliminarRegistroFormularioReten['result'] == true) {
          this.funcionesService.notificacion_mensaje("Success", "Se eliminó el registro satisfactoriamente.");
          this.mostrarDataReporte();
          this.cerrarModal("modal_confirmar_eliminar");
        } else {
          this.funcionesService.notificacion_mensaje("Error", "No se pudo eliminar el registro, intente de nuevo.");
        }
      });
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