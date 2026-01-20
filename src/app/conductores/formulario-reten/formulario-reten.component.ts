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

  guardarRegistroPiloto(){
    var data = {
      'fecha_partida': this.funcionesService.convertir_barra_fecha_hora($('#fecha_partida').val()),
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

    //console.log(data);

    this.taskService.insertFormularioReten(data).subscribe(responseinsertFormularioReten => {
      if(responseinsertFormularioReten['result'] == true){
        console.log("todo bien");

        this.cerrarModal('modal_create_editar_conductor');
        this.mostrarDataReporte();
      }else{
        console.log("todo mal");
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