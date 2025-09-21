import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {

  public innerWidth: any;

  date!: Date;
  date_actual: string = "";
  anio: string = "";
  hora_hoy: string = "";

  lstDatosListaPromocionesCupones: any = [];
  lstRespaldoDatosListaPromocionesCupones: any = [];

  nameModal: string = "";
  ltRutas: any;
  ltGrupoCupones: any;

  codigosEconomico: string = "29, 37, 30, 32, 2, 3, 39";
  codigosEjecutivoVip: string = "36, 31, 35, 1, 15, 22, 25, 44, 45, 50, 51";
  codigosPresidencial: string = "34, 27, 21, 52";
  codigosPremier: string = "24, 53";

  //token: string = "";

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
    $('.js-example-basic-multiple').select2({
      dropdownParent: $('#modal_create_editar_cupon .modal-body')
    });

    $('.select2-container').css('width', '100%');

    $('.select2-container--default').css('font-size', '13px');
    $('.select2-selection--multiple').css('font-size', '13px');
    $('.select2-selection__choice').css('font-size', '13px');

    /*this.taskService.getToken().subscribe(responseToken => {
      //console.log(responseToken);
      this.token = responseToken['jwt'];
    });*/

    setTimeout(() => {
      this.cargarListaPromocionesCupones();

      this.cargarRutas();
    }, 100);
  }

  cargarListaPromocionesCupones(){
    this.lstDatosListaPromocionesCupones = [];
    this.lstRespaldoDatosListaPromocionesCupones = [];

    this.taskService.getPromocionesCupones().subscribe(responsePromocionesCupones => {
      //console.log(responsePromocionesCupones);
      this.lstDatosListaPromocionesCupones = responsePromocionesCupones;
      this.lstRespaldoDatosListaPromocionesCupones = responsePromocionesCupones;

      setTimeout(() => {
        $("#tabla_promociones").DataTable({pageLength: 25,
          filter: true,
          deferRender: true,
          scrollY: 400,
          scrollCollapse: true,
          scroller: true,
          "searching": true
        });
      }, 100);
    });
  }

  cargarRutas(){
    this.taskService.getRutas().subscribe(responseRutas => {
      //console.log(responseRutas);
      this.ltRutas = responseRutas;
    });

    this.taskService.getGrupoCupones().subscribe(responseGrupoCupones => {
      //console.log(responseGrupoCupones);
      this.ltGrupoCupones = responseGrupoCupones;
    });
  }

  nuevoCupon(){
    this.nameModal = "Nuevo Cupón";

    // ? LIMPIAR MODAL *********************
    $('#code_promocion').val(0);
    $('#estado_promocion').val(0);
    $('#nombre_promocion').val(''); $('#nombre_promocion').removeClass("empty_datos");

    $('#fecha_cupon_inicio').val(''); $('#fecha_cupon_inicio').removeClass("empty_datos");
    $('#fecha_cupon_fin').val(''); $('#fecha_cupon_fin').removeClass("empty_datos");
    $('#fecha_compra_inicio').val(''); $('#fecha_compra_inicio').removeClass("empty_datos");
    $('#fecha_compra_fin').val(''); $('#fecha_compra_fin').removeClass("empty_datos");

    $('#chkEconomico').prop('checked', false); $('#chkEconomico').removeClass("empty_datos");
    $('#chkEjecutivo').prop('checked', false); $('#chkEjecutivo').removeClass("empty_datos");
    $('#chkPresidencial').prop('checked', false); $('#chkPresidencial').removeClass("empty_datos");
    $('#chkPremier').prop('checked', false); $('#chkPremier').removeClass("empty_datos");

    $('#porcentaje_descuento').val(''); $('#porcentaje_descuento').removeClass("empty_datos");
    $('#stock_pasajeros').val(''); $('#stock_pasajeros').removeClass("empty_datos");

    $('#select_grupo_cupones').val(0); $('#select_grupo_cupones').removeClass("empty_datos");
    $('#stock_grupo_cupones').val('');

    $('#select_sistemas').val(0); $('#select_sistemas').removeClass("empty_datos");

    $('#rutas_prohibidas').val(null).trigger('change'); $('#rutas_prohibidas').removeClass("empty_datos");
    $('#rutas_aceptadas').val(null).trigger('change'); $('#rutas_aceptadas').removeClass("empty_datos");

    $('#modal_create_editar_cupon').modal('show'); 
  }

  editarPromocionCupon(DatosListaPromocionesCupones: any){
    $('#code_promocion').val(DatosListaPromocionesCupones['cupones_id']);
    $('#estado_promocion').val(DatosListaPromocionesCupones['estado']);
    $('#nombre_promocion').val(DatosListaPromocionesCupones['nombre']);

    $('#fecha_cupon_inicio').val(this.funcionesService.convert_format_fecha_guion(DatosListaPromocionesCupones['fecha_inicio']));
    $('#fecha_cupon_fin').val(this.funcionesService.convert_format_fecha_guion(DatosListaPromocionesCupones['fecha_fin']));
    $('#fecha_compra_inicio').val(this.funcionesService.convert_format_fecha_guion(DatosListaPromocionesCupones['compra_inicio']));
    $('#fecha_compra_fin').val(this.funcionesService.convert_format_fecha_guion(DatosListaPromocionesCupones['compra_fin']));

    this.seleccionarServiciosPromocionModal(DatosListaPromocionesCupones['servicios']);

    $('#porcentaje_descuento').val(DatosListaPromocionesCupones['porcentaje_desc']);
    $('#stock_pasajeros').val(DatosListaPromocionesCupones['usos_restantes']);

    $('#select_grupo_cupones').val(DatosListaPromocionesCupones['grupoCuponesId']);
    $('#stock_grupo_cupones').val(DatosListaPromocionesCupones['stock']);

    $('#select_sistemas').val(DatosListaPromocionesCupones['tipo_sistema']);

    $('#rutas_prohibidas').val(null).trigger('change');
    $('#rutas_aceptadas').val(null).trigger('change');
    
    if(DatosListaPromocionesCupones['rutas_prohibidas'] != null){
      var dat_lit_pro_cup = DatosListaPromocionesCupones['rutas_prohibidas'].split(",");
      
      for(var a=0; a<dat_lit_pro_cup.length; a++){
        let find1 = this.ltRutas.find(x => x?.id === Number(dat_lit_pro_cup[a]));

        var newOption = new Option(find1?.denominacion, "'"+dat_lit_pro_cup[a]+"'", true, true);
        $('#rutas_prohibidas').append(newOption).trigger('change');
      }

      this.todas_rutas();
    }

    if(DatosListaPromocionesCupones['rutas_aceptadas'] != null){
      var dat_lit_pro_cup = DatosListaPromocionesCupones['rutas_aceptadas'].split(",");
      
      for(var a=0; a<dat_lit_pro_cup.length; a++){
        let find1 = this.ltRutas.find(x => x?.id === Number(dat_lit_pro_cup[a]));

        var newOption = new Option(find1?.denominacion, "'"+dat_lit_pro_cup[a]+"'", true, true);
        $('#rutas_aceptadas').append(newOption).trigger('change');
      }

      this.rutas_aceptadas();
    }

    $('#modal_create_editar_cupon').modal('show'); 
  }

  change_select_grupo_cupones(){
    var id_grupo_cupones = Number($('#select_grupo_cupones').val());

    for(var a=0; a<this.ltGrupoCupones.length; a++){
      if(id_grupo_cupones == this.ltGrupoCupones[a]['grupocupones_id']){
        $('#stock_grupo_cupones').val(this.ltGrupoCupones[a]['stock']);
      }
    }
  }

  change_select_seleccionar_sistema(){
    var id_select_seleccionar_sistema = Number($('#select_seleccionar_sistema').val());

    if(id_select_seleccionar_sistema == 0){
      this.lstDatosListaPromocionesCupones = this.lstRespaldoDatosListaPromocionesCupones;
    }else{
      this.lstDatosListaPromocionesCupones = this.lstRespaldoDatosListaPromocionesCupones.filter(x => x.tipo_sistema == id_select_seleccionar_sistema);
    }
  }

  guardarPromocion(){
    var ServiciosPromocion = "";
    if($('#chkEconomico').is(":checked") == true){
      ServiciosPromocion += this.codigosEconomico+", ";
    }
    if($('#chkEjecutivo').is(":checked") == true){
      ServiciosPromocion += this.codigosEjecutivoVip+", ";
    }
    if($('#chkPresidencial').is(":checked") == true){
      ServiciosPromocion += this.codigosPresidencial+", ";
    }
    if($('#chkPremier').is(":checked") == true){
      ServiciosPromocion += this.codigosPremier+",";
    }
    
    ServiciosPromocion = ServiciosPromocion.trim();
    ServiciosPromocion = ServiciosPromocion.substring(0, ServiciosPromocion.length - 1);

    var RutasProhibidas = "";
    var list_rutas_prohibidas = $('#rutas_prohibidas').val();
    if(list_rutas_prohibidas != ""){
      for(var a=0; a<list_rutas_prohibidas.length; a++){
        RutasProhibidas += list_rutas_prohibidas[a] + ",";
      }
      RutasProhibidas = RutasProhibidas.replaceAll("'","");
      RutasProhibidas = RutasProhibidas.substring(0, RutasProhibidas.length - 1).trim();
    }

    var RutasAceptadas = "";
    var list_rutas_aceptadas = $('#rutas_aceptadas').val();
    if(list_rutas_aceptadas != ""){
      for(var a=0; a<list_rutas_aceptadas.length; a++){
        RutasAceptadas += list_rutas_aceptadas[a] + ",";
      }
      RutasAceptadas = RutasAceptadas.replaceAll("'","");
      RutasAceptadas = RutasAceptadas.substring(0, RutasAceptadas.length - 1).trim();
    }

    var tipo_promocion = 1;
    if($('#rdbCupon').is(":checked")){
      tipo_promocion = 1;
    }else{
      tipo_promocion = 2;
    }

    var data = {
      'cupones_id': Number($('#code_promocion').val()),
      'nombre': $('#nombre_promocion').val(),
      'porcentaje_desc': Number($('#porcentaje_descuento').val()),
      'usosrestantes': Number($('#stock_pasajeros').val()),
      'servicios': ServiciosPromocion,
      'rutas_prohibidas': RutasProhibidas,
      'fecha_inicio': this.funcionesService.convert_format_fecha_barra($('#fecha_cupon_inicio').val()),
      'fecha_fin': this.funcionesService.convert_format_fecha_barra($('#fecha_cupon_fin').val()),
      'compra_inicio': this.funcionesService.convert_format_fecha_barra($('#fecha_compra_inicio').val()),
      'compra_fin': this.funcionesService.convert_format_fecha_barra($('#fecha_compra_fin').val()),
      'estado': Number($('#estado_promocion').val()),
      'grupo_cupones': Number($('#select_grupo_cupones').val()),
      'rutas_aceptadas': RutasAceptadas,
      'tipo_promocion': tipo_promocion,
      'tipo_sistema': Number($('#select_sistemas').val())
    }

    if(this.verificar_modal_promociones(data) == true){
      this.taskService.updateInsertPromocion(data).subscribe(responseupdateInsertPromocion => {
        if(responseupdateInsertPromocion['result'] == true){
          if(responseupdateInsertPromocion['mensaje'].includes('0')){
            this.funcionesService.notificacion_mensaje("Success", "Se insertó con éxito la promoción.");
          }else{
            this.funcionesService.notificacion_mensaje("Success", "Se actualizó con éxito la promoción.");
          }

          $("#tabla_promociones").DataTable().destroy();
          this.cargarListaPromocionesCupones();
          $('#modal_create_editar_cupon').modal('hide');
        }else{
          if(responseupdateInsertPromocion['mensaje'].includes('0')){
            this.funcionesService.notificacion_mensaje("Error", "Hubo un error al insertar la promoción.");
          }else{
            this.funcionesService.notificacion_mensaje("Error", "Hubo un error al actualizar la promoción.");
          }
        }
      });
    }
  }

  eliminarPromocionCupon(DatosListaPromocionesCupones: any){
    this.taskService.eliminarPromocion(DatosListaPromocionesCupones['cupones_id']).subscribe(responseeliminarPromocion => {
      if(responseeliminarPromocion['result'] == true){
        this.funcionesService.notificacion_mensaje("Success", "Se eliminó con éxito la promoción.");

        $("#tabla_promociones").DataTable().destroy();
        this.cargarListaPromocionesCupones();
      }else{
        this.funcionesService.notificacion_mensaje("Error", "Hubo un error al eliminar la promoción.");
      }
    });
  }

  verificar_modal_promociones(data: any){
    if(data['nombre'] == ""){ $('#nombre_promocion').addClass("empty_datos"); return false;
    }else{ $('#nombre_promocion').removeClass("empty_datos"); }

    if(data['porcentaje_desc'] == 0){ $('#porcentaje_descuento').addClass("empty_datos"); return false;
    }else{ $('#porcentaje_descuento').removeClass("empty_datos"); }

    if(data['usosrestantes'] == 0){ $('#stock_pasajeros').addClass("empty_datos"); return false;
    }else{ $('#stock_pasajeros').removeClass("empty_datos"); }

    if(data['servicios'] == ""){ $('#chkEconomico').addClass("empty_datos"); $('#chkEjecutivo').addClass("empty_datos"); $('#chkPresidencial').addClass("empty_datos"); $('#chkPremier').addClass("empty_datos"); return false;
    }else{ $('#chkEconomico').removeClass("empty_datos"); $('#chkEjecutivo').removeClass("empty_datos"); $('#chkPresidencial').removeClass("empty_datos"); $('#chkPremier').removeClass("empty_datos"); }

    if(data['rutas_prohibidas'] == "" && data['rutas_aceptadas'] == ""){ $('#rutas_aceptadas').addClass("empty_datos"); $('#rutas_prohibidas').addClass("empty_datos"); return false;
    }else{ $('#rutas_aceptadas').removeClass("empty_datos"); $('#rutas_prohibidas').removeClass("empty_datos"); }

    if(data['fecha_inicio'] == ""){ $('#fecha_cupon_inicio').addClass("empty_datos"); return false;
    }else{ $('#fecha_cupon_inicio').removeClass("empty_datos"); }

    if(data['fecha_fin'] == ""){ $('#fecha_cupon_fin').addClass("empty_datos"); return false;
    }else{ $('#fecha_cupon_fin').removeClass("empty_datos"); }

    if(data['compra_inicio'] == ""){ $('#fecha_compra_inicio').addClass("empty_datos"); return false;
    }else{ $('#fecha_compra_inicio').removeClass("empty_datos"); }

    if(data['compra_fin'] == ""){ $('#fecha_compra_fin').addClass("empty_datos"); return false;
    }else{ $('#fecha_compra_fin').removeClass("empty_datos"); }

    if(data['grupo_cupones'] == 0){ $('#select_grupo_cupones').addClass("empty_datos"); return false;
    }else{ $('#select_grupo_cupones').removeClass("empty_datos"); }

    if(data['tipo_sistema'] == 0){ $('#select_sistemas').addClass("empty_datos"); return false;
    }else{ $('#select_sistemas').removeClass("empty_datos"); }

    return true;
  }

  seleccionarServiciosPromocionModal(serviciosDisponibles: string){
    if(serviciosDisponibles != null){
      if(serviciosDisponibles.includes(this.codigosEconomico.trim())){
        $("#chkEconomico").prop("checked", true);
      }else{
        $("#chkEconomico").prop("checked", false);
      }

      if(serviciosDisponibles.includes(this.codigosEjecutivoVip.trim())){
        $("#chkEjecutivo").prop("checked", true);
      }else{
        $("#chkEjecutivo").prop("checked", false);
      }

      if(serviciosDisponibles.includes(this.codigosPresidencial.trim())){
        $("#chkPresidencial").prop("checked", true);
      }else{
        $("#chkPresidencial").prop("checked", false);
      }

      if(serviciosDisponibles.includes(this.codigosPremier.trim())){
        $("#chkPremier").prop("checked", true);
      }else{
        $("#chkPremier").prop("checked", false);
      }
    }
  }

  todas_rutas(){
    $('#btn_todas_rutas').removeClass('active');
    $('#btn_rutas_aceptadas').removeClass('active');

    $('#btn_todas_rutas').addClass('active');
    $('#div_rutas_aceptadas').css('display', 'none');
    $('#div_rutas_excluidas').css('display', 'inline');
  }

  rutas_aceptadas(){
    $('#btn_todas_rutas').removeClass('active');
    $('#btn_rutas_aceptadas').removeClass('active');

    $('#btn_rutas_aceptadas').addClass('active');
    $('#div_rutas_aceptadas').css('display', 'inline');
    $('#div_rutas_excluidas').css('display', 'none');
  }

}