import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-formulario-reten',
  templateUrl: './formulario-reten.component.html',
  styleUrls: ['./formulario-reten.component.css']
})
export class FormularioRetenComponent implements OnInit {

  ArrayMostrarModal: any = [];

  date!: Date;
  date_actual: string = "";
  anio: string = "";

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";

  date_fecha_inicio_modal: string = "";

  ListReporteFormularioReten: any = [];

  ltPilotos: any = [];

  constructor(private router:Router, private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
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
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.taskService.getPilotos().subscribe(responsegetPilotos => {
      this.ltPilotos = responsegetPilotos;
    });
  }

  buscarReporteFormularioReten(){

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