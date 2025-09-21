import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { FuncionesService } from '../funciones/funciones.service';

declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //username: string = "";
  //password: string = "";
  //rol_id: number = 0;
  ltRoles: any;
  estadoLogin: number = 0;
  validarcampos: boolean = true;

  DataResponsePostLogin: any;
  version_intranet: number = 0;

  constructor(private router:Router, private taskService: TaskService, public funcionesService: FuncionesService) { }

  ngOnInit(): void {
    this.eliminarStorage();           // * Remover Todos los Local Storage del Sistema
    this.version_intranet = this.taskService.VERSION_INTRANET;
  }

  ngAfterViewInit(){
    $(".loader").fadeOut("slow");
  }

  ingresar(){
    if(this.estadoLogin == 0){
      $('#div_roles').css('display', 'none');
    }

    this.validarcampos = this.validarCampos();
    if(this.validarcampos == true){
      var username = $('#username').val();
      var password = $('#password').val();
      var rol_id = $('#roles').val();

      $(".loader").fadeIn("slow");
      const parametrosLoginSispas = {username: username, password: password, rol_id: rol_id};
      this.taskService.postLogin(parametrosLoginSispas).subscribe(responsePostLogin => {
        //console.log(responsePostLogin);
        this.DataResponsePostLogin = responsePostLogin;
      }, error =>{
        // ! ******************* ERROR
        $(".loader").fadeOut("slow");

        this.funcionesService.notificacion_mensaje("Error", "Hubo un error al iniciar sesión, comuníquese con sistemas");
      },() =>{
        // * ******************* COMPLETE
        $(".loader").fadeOut("slow");

        if(this.DataResponsePostLogin['login'] == 1){            // * ELEGIR ROL
          this.estadoLogin = 1;
          this.ltRoles = this.DataResponsePostLogin['usuarioRol'];
          $('#div_roles').css('display', 'block');
        }else if(this.DataResponsePostLogin['login'] == 2){      // * INICIAR SESIÓN
          this.estadoLogin = 2;
          localStorage.setItem("StorageLoginToken", JSON.stringify(this.DataResponsePostLogin['token']));
          localStorage.setItem("StorageLiquidacion", JSON.stringify(this.DataResponsePostLogin['liquidacion']));
          localStorage.setItem("StorageRol", JSON.stringify(this.DataResponsePostLogin['rol']));
          localStorage.setItem("StorageTipoComprobante", JSON.stringify(this.DataResponsePostLogin['tipoComprobante']));
          localStorage.setItem("StorageUsuario", JSON.stringify(this.DataResponsePostLogin['usuario']));
          localStorage.setItem("StorageUsuarioAprobador", JSON.stringify(this.DataResponsePostLogin['usuarioAprobador']));
          localStorage.setItem("StorageUsuarioHardware", JSON.stringify(this.DataResponsePostLogin['usuarioHardware']));
          location.href ='/dashboard';                  // TODO: Redireccionar al Dashboard
        }else{                                          // * ERROR DE SESIÓN
          this.estadoLogin = 0;
          this.funcionesService.notificacion_mensaje("Error", "Usuario Invalido");
          this.limpiarStorage();
        }
      });
    }
  }

  limpiarStorage(){
    localStorage.setItem("StorageLoginToken", JSON.stringify({}));
    localStorage.setItem("StorageLiquidacion", JSON.stringify({}));
    localStorage.setItem("StorageRol", JSON.stringify({}));
    localStorage.setItem("StorageTipoComprobante", JSON.stringify({}));
    localStorage.setItem("StorageUsuario", JSON.stringify({}));
    localStorage.setItem("StorageUsuarioAprobador", JSON.stringify({}));
    localStorage.setItem("StorageUsuarioHardware", JSON.stringify({}));
  }

  eliminarStorage(){
    localStorage.removeItem("StorageLoginToken");
    localStorage.removeItem("StorageLiquidacion");
    localStorage.removeItem("StorageRol");
    localStorage.removeItem("StorageTipoComprobante");
    localStorage.removeItem("StorageUsuario");
    localStorage.removeItem("StorageUsuarioAprobador");
    localStorage.removeItem("StorageUsuarioHardware");
  }

  validarCampos(){
    if(this.estadoLogin == 1 || this.estadoLogin == 0){
      if($('#username').val() == ""){
        $('#username').addClass("empty_datos");
        this.funcionesService.notificacion_mensaje("Error", "Ingresar Usuario");
        return false;
      }else{
        $('#username').removeClass("empty_datos");
      }
  
      if($('#password').val() == ""){
        $('#password').addClass("empty_datos");
        this.funcionesService.notificacion_mensaje("Error", "Ingresar Contraseña");
        return false;
      }else{
        $('#password').removeClass("empty_datos");
      }
  
      if(this.estadoLogin == 1){
        if($('#roles').val() == null){
          $('#roles').addClass("empty_datos");
          this.funcionesService.notificacion_mensaje("Error", "Seleccionar Rol");
          return false;
        }else{
          $('#roles').removeClass("empty_datos");
        }
      }
    }

    return true;
  }

  versiones(){
    this.router.navigate(['modulo-ti/versiones']);
  }
}