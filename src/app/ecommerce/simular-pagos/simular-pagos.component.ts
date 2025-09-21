import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-simular-pagos',
  templateUrl: './simular-pagos.component.html',
  styleUrls: ['./simular-pagos.component.css']
})
export class SimularPagosComponent implements OnInit {

  public innerWidth: any;

  PagoRealizado: number = 0;
  mensajeSimulacionPago: string = "";

  constructor(private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
    this.innerWidth = window.innerWidth;
  }

  PagarPasaje(){
    $(".loader").fadeIn("slow");

    this.taskService.simularPago(String($("#inputPagarPasaje").val()).trim()).subscribe(responsesimularPago => {
      console.log(responsesimularPago);

      if(responsesimularPago['result'] == true){
        this.PagoRealizado = 1;
        this.mensajeSimulacionPago = responsesimularPago['mensaje'];
      }else{
        this.PagoRealizado = 2;
        this.mensajeSimulacionPago = responsesimularPago['mensaje'];
      }
      
      $(".loader").fadeOut("slow");
    });
  }
}
