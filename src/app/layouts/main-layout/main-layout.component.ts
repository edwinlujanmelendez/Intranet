import { Component, OnInit, HostListener } from '@angular/core';
import { TaskService } from './../../services/task.service';
import { Router } from '@angular/router';
import { FuncionesService } from '../../../app/funciones/funciones.service';
import { RolesService } from '../../../app/services/roles.service';

declare var $:any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  title = 'IntranetMovilBus';
  showMenu = false;

  // * CABECERA
  ambiente: string = "";
  equipo: string = "";
  liquidacion: string = "";
  nombre: string = "";
  nombre_corto: string = "";
  email_usuario: string = "";
  agencia: string = "";
  img_user: string = "assets/img/mp_neutro.png";
  sub_menu: string = "";
  canal_venta: string = "";
  rol_actual: string = "";
  anio_actual: string = "";

  date_actual: string = "";

  rolId!: number;

  constructor(private router:Router, private taskService: TaskService, public funcionesService: FuncionesService, public rolesService: RolesService){
    this.date_actual = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
    $(".loader").fadeOut("slow");

    let StorageLoginToken = JSON.parse(localStorage.getItem('StorageLoginToken') || '{}');
    //console.log(StorageLoginToken);
    let StorageUsuarioHardware = JSON.parse(localStorage.getItem('StorageUsuarioHardware') || '{}');
    //console.log(StorageUsuarioHardware);
    let StorageUsuario = JSON.parse(localStorage.getItem('StorageUsuario') || '{}');
    //console.log(StorageUsuario);
    let StorageRol = JSON.parse(localStorage.getItem('StorageRol') || '{}');
    //console.log(StorageRol);
    let StorageLiquidacion = JSON.parse(localStorage.getItem('StorageLiquidacion') || '{}');
    //console.log(StorageLiquidacion);
    
    if(JSON.stringify(StorageUsuarioHardware)!="{}" && JSON.stringify(StorageUsuario)!="{}" && JSON.stringify(StorageRol)!="{}"){
      this.ambiente = this.taskService.AMBIENTE;
      this.equipo = StorageUsuarioHardware['c_descripcion'];
      this.nombre = StorageUsuario['apellidoPaterno'] + " " + StorageUsuario['apellidoMaterno'] + ", " + StorageUsuario['nombre'];
      this.nombre_corto = StorageUsuario['nombre'];
      this.email_usuario = StorageUsuario['emailFuncionario'];
      this.agencia = StorageUsuarioHardware['agencia']['c_denominacion'];
      this.canal_venta = StorageUsuarioHardware['canalVenta']['nombreCorto'];
      this.rol_actual = StorageRol['c_denominacion'];

      if(StorageUsuario['personal'] != null){
        if(StorageUsuario['personal']['sexo_id'] == 1){
          this.img_user = "assets/img/mp_woman.png";
        }else if(StorageUsuario['personal']['sexo_id'] == 2){
          this.img_user = "assets/img/mp_man.png";
        }
      }
    }
    
    this.anio_actual = String(new Date().getFullYear());

    if (JSON.stringify(StorageLiquidacion) != "null" && JSON.stringify(StorageLiquidacion) != '{}') {
      if (StorageLiquidacion['d_fecliq'] == this.date_actual) {
        this.liquidacion = "CAJA ABIERTA";
      } else {
        this.liquidacion = "CAJA DÍA ANTERIOR";
        //$('#detalle_liquidacion').addClass("error_caja");
      }
    } else {
      this.liquidacion = "CAJA CERRADA";
      //$('#detalle_liquidacion').addClass("error_caja");
    }

    this.rolId = Number(StorageRol['rol_id']);
  }

  ngAfterViewInit(){
    //$('#detalle_liquidacion').removeClass("error_caja");    
  }

  puedeVer(menu: 'VentaReservaPasajes' | 'ReporteVentasPasajes' | 'Promociones') {
    return this.rolesService.manejarVistas(menu, this.rolId);
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // Detecta clic en cualquier parte del documento
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Si el clic no ocurre dentro del dropdown o el avatar → cerrar
    if (!target.closest('.user-dropdown')) {
      this.showMenu = false;
    }
  }

  CerrarSesion(){
    this.router.navigate(['login']);
  }

  Dashboard(){
    this.router.navigate(['dashboard']);
  }

  SimularPagos(){
    this.router.navigate(['simular-pagos']);
  }

  /****************************** MODULO TI ******************************/
  AuditoriaBoletos(){
    this.router.navigate(['modulo-ti/auditoria-boletos']);
  }
  /****************************** MODULO TI ******************************/

  /****************************** OPERACIONES ******************************/
  ConsultaBoletos(){
    this.router.navigate(['operaciones/consulta-boletos']);
  }

  VentaReservaPasajes(){
    this.router.navigate(['operaciones/ventas-reserva/itinerario']);
  }

  ReporteVentasPasajes(){
    this.router.navigate(['operaciones/reporte-ventas-pasajes']);
  }

  Promociones(){
    this.router.navigate(['operaciones/promociones']);
  }
  /****************************** OPERACIONES ******************************/

  /****************************** REPORTES ******************************/
  ReporteOperacionesSeguimientoFrotcom(){
    this.router.navigate(['reportes/operaciones/seguimiento-frotcom']);
  }
  /****************************** REPORTES ******************************/
  
  openNav(texto: string){
    $("#menuNav"+texto).toggleClass("show");
    $("#submenuNav"+texto).toggleClass("show");
  }

  openNavBar(){
    $("#kt_app_sidebar").toggleClass("drawer drawer-start drawer-on");
    $("#div_sombreado").toggleClass("display");
  }

  ver_submenu_perfil(){
    $("#imagen_perfil").toggleClass("show menu-dropdown");
    $("#submenu_imagen_perfil").toggleClass("show submenu_imagen_perfil");
  }
}