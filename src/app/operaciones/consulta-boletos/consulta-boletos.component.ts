import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { saveAs } from 'file-saver';
import { DatoAsociado } from '../../interfaces/DatoAsociado';
import { MaestroAsociado } from '../../interfaces/MaestroAsociado';
import { DatosDetallesVenta } from '../../interfaces/DatosDetallesVenta';
import { MaestroDataTransbordos } from '../../interfaces/MaestroDataTransbordos';
import { take } from 'rxjs/operators';

declare var $:any;

@Component({
  selector: 'app-consulta-boletos',
  templateUrl: './consulta-boletos.component.html',
  styleUrls: ['./consulta-boletos.component.css']
})
export class ConsultaBoletosComponent implements OnInit {

  public innerWidth: any;

  date!: Date;
  date_actual: string = "";

  numOperacion: string = "";
  lstDatosListaPasajerosIda: any = [];
  lstDatosListaPasajerosRetorno: any = [];

  responsegetBuscarPasajes: any = [];
  rol_superusuario: number = 0;
  permitir_enviar_correo: number = 0;
  permitir_descargar_pdfs: number = 0;
  pdf_para_descargar: any = [];
  pdf_pasajes_enviar: number = 0;

  nuevos_datos_agrupados: any = [];
  DatosVistaViajes: DatoAsociado[] = [];
  DatosPartidasUnicas: any = [];
  DatosDetallesVenta: DatosDetallesVenta[] = [];

  DataSelectDocument: any = [];
  DataMaestroDataTransbordos: MaestroDataTransbordos[] = [];

  constructor(private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService){
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

    //this.date_actual = anio + "-" + mes + "-" + dia;
    this.date_actual = dia + "-" + mes + "-" + anio;
  }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit(){
    let StorageRol = JSON.parse(localStorage.getItem('StorageRol') || '{}');
    this.rol_superusuario = Number(StorageRol['rol_id']);
  }

  toggle_seleccion(id: string){
    $(id).toggleClass('toggle_seleccion');
  }

  select_chk_document(position: number, documento: any){
    if($('#chk_documentos_'+position).is(":checked") == true){
      this.DataSelectDocument.push(documento);
    }else{
      const index = this.DataSelectDocument.findIndex(d => d === documento);
      if (index !== -1) {
        this.DataSelectDocument.splice(index, 1);
      }
    }

    if (this.DataSelectDocument.length > 0) {
      $('#email_pdf_correo').prop('disabled', false);
      $('#button_pdf_correo').prop('disabled', false);
      $('#button_download_pdf').prop('disabled', false);
    } else {
      $('#email_pdf_correo').prop('disabled', true);
      $('#button_pdf_correo').prop('disabled', true);
      $('#button_download_pdf').prop('disabled', true);
    }
  }

  buscarDatos(){
    var textoBuscar = String($("#inputBuscar").val()).trim();
    if(textoBuscar != ""){
      $(".loader").fadeIn("slow");

      $('#div_vista_viajes').css('display', 'none');
      $('#div_vista_detalles').css('display', 'none');
      $('#div_vista_transbordos').css('display', 'none');
      $('#div_buscando_pdf').css('display', 'none');

      this.lstDatosListaPasajerosIda = [];
      this.lstDatosListaPasajerosRetorno = [];

      this.permitir_descargar_pdfs = 0;
      this.permitir_enviar_correo = 0;
      this.pdf_para_descargar = [];

      this.responsegetBuscarPasajes = [];
      this.DatosPartidasUnicas = [];
      this.DatosDetallesVenta = [];
      this.nuevos_datos_agrupados = [];

      this.DataSelectDocument = [];
      this.DataMaestroDataTransbordos = [];

      this.taskService.getBuscarPasajes(String(textoBuscar)).subscribe(responsegetBuscarPasajes => {
        //console.log(responsegetBuscarPasajes);
        
        this.responsegetBuscarPasajes = responsegetBuscarPasajes;
      }, error => {
        $(".loader").fadeOut("slow");
      }, () => {
        this.nueva_funcionalidad();
      });
    }
  }

  nueva_funcionalidad(){
    // TODO: ASOCIAR PROMOCIONES FALTANTES
    this.asociar_promociones_faltantes();

    // TODO: LIMPIAMOS EL ARRAY DE DATOS QUE NO VALEN - VOUCHERS
    for(let i = 0; i < this.responsegetBuscarPasajes.length; i++){
      let boleto = this.responsegetBuscarPasajes[i]['c_numboleto'];

      if(!boleto){ continue; }

      /*if(!this.responsegetBuscarPasajes[i]['c_numboleto'].includes('FB') && !this.responsegetBuscarPasajes[i]['c_numboleto'].includes('BB')){
        this.responsegetBuscarPasajes.splice(i, 1);
        i--;
      }*/

      if(this.responsegetBuscarPasajes[i]['detalle_tipcom'].includes('VOUCHER DE AGENCIA DE VIAJES')){
        this.responsegetBuscarPasajes.splice(i, 1);
        i--;
      }
    }

    // TODO: LIMPIAMOS EL ARRAY DE DATOS QUE NO VALEN - ANULACIONES
    for(let i = 0; i < this.responsegetBuscarPasajes.length; i++){
      if(this.responsegetBuscarPasajes[i]['detalle_tipmov'] == 'ANULACION SISTEMA'){
        this.responsegetBuscarPasajes.splice(i, 1);
        i--;
      }
    }

    // TODO: BUSCAMOS LOS BOLETOS MAESTROS
    const boletosPrincipales: DatoAsociado[] = [];

    this.responsegetBuscarPasajes = this.responsegetBuscarPasajes.filter(item => {
      const esPrincipal = (item.detalle_tipcom === 'BOLETA DE VENTA' || item.detalle_tipcom === 'FACTURA') && 
                          (item.detalle_tipmov === 'CREDITO' || item.detalle_tipmov === 'EFECTIVO');
      
      if(esPrincipal){
        boletosPrincipales.push(item); //return false; 
      }
      return true;
    });

    // TODO: BUSCAMOS LOS BOLETOS MAESTROS Y LOS JUNTAMOS EN GRUPOS
    this.agrupar_datos_por_boleto(boletosPrincipales);

    // TODO: ORDENAMOS LAS VISTAS DE VIAJES (PRIMER REGISTRO Y FECHA DE PARTIDAS UNICAS)
    this.ordenar_vista_de_viajes();

    // TODO: ORDENAMOS LOS DETALLES DE LAS VENTAS
    this.ordenar_detalles_de_la_venta();

    // TODO: LIMPIEZA DATA DE LOS AGRUPADOS
    this.limpieza_data_agrupados();

    // TODO: SE MUESTRA EL PANEL PARA DESCARGAR LOS PDF
    this.verificar_descargas_pdf();

    // TODO: SE MUESTRA EL PANEL PARA ENVIAR LOS CORREOS
    this.mostrar_panel_correo_pdf();
    
    // TODO: SE BUSCA SI EXISTE ALGUN TRANSBORDO EN ALGUNOS DE LOS BOLETOS
    this.buscar_transbordos_de_boletos();

    // TODO: ARMAMOS LA VISTA FINAL
    $('#div_vista_viajes').css('display', 'inline');
    $('#div_vista_detalles').css('display', 'inline');
    $(".loader").fadeOut("slow");
    
    //console.log(this.responsegetBuscarPasajes);
    //console.log(this.nuevos_datos_agrupados);
  }

  asociar_promociones_faltantes(){
    for(var a=0; a<this.responsegetBuscarPasajes.length; a++){
      if(this.responsegetBuscarPasajes[a]['c_numbolant']?.includes("FB") || this.responsegetBuscarPasajes[a]['c_numbolant']?.includes("BB")){
        if(this.responsegetBuscarPasajes[a]['nombre_promocion1'] != null || this.responsegetBuscarPasajes[a]['nombre_promocion2'] != null){
          for(var b=0; b<this.responsegetBuscarPasajes.length; b++){
            if(this.responsegetBuscarPasajes[a]['c_numbolant'] == this.responsegetBuscarPasajes[b]['c_numboleto']){
              this.responsegetBuscarPasajes[b]['nombre_promocion1'] = this.responsegetBuscarPasajes[a]['nombre_promocion1'];
              this.responsegetBuscarPasajes[b]['nombre_promocion2'] = this.responsegetBuscarPasajes[a]['nombre_promocion2'];

              this.responsegetBuscarPasajes[b]['descuento_promocion1'] = this.responsegetBuscarPasajes[a]['descuento_promocion1'];
              this.responsegetBuscarPasajes[b]['descuento_promocion2'] = this.responsegetBuscarPasajes[a]['descuento_promocion2'];
            }
          }
        }
      }
    }
  }

  buscar_transbordos_de_boletos(){
    this.DataMaestroDataTransbordos = [];

    for (let a = 0; a < this.nuevos_datos_agrupados.length; a++){
      for (let b = 0; b < this.nuevos_datos_agrupados[a]['datos_asociados'].length; b++) {
        if(this.nuevos_datos_agrupados[a]['datos_asociados'][b]['detalle_tipcom'] != "NOTA DE CREDITO" && this.nuevos_datos_agrupados[a]['datos_asociados'][b]['detalle_tipmov'] != "EFECTIVO"){

          const boleto = this.nuevos_datos_agrupados[a].datos_asociados[b].c_numboleto;

          this.taskService.getBuscarTransbordos(boleto).pipe(take(1)).subscribe(responseBuscarTransbordos=> {            
            if(responseBuscarTransbordos.length > 0){
              this.DataMaestroDataTransbordos.push({
                boleto,
                datos_asociados_transbordos: responseBuscarTransbordos
              });
              
              //console.log(this.DataMaestroDataTransbordos);
              $('#div_vista_transbordos').css('display', 'inline');
            }
          });
        }
      }
    }
  }

  limpieza_data_agrupados(){
    this.nuevos_datos_agrupados;

    this.nuevos_datos_agrupados = this.nuevos_datos_agrupados.filter((itemA, indexA, arr) => {
      if (itemA.datos_asociados.length > 0) {
        return true; // Mantener siempre si tiene datos asociados
      }

      // Buscar si este boleto está listado en otro elemento
      const encontrado = arr.some((itemB, indexB) =>
        indexB !== indexA &&
        itemB.datos_asociados.includes(itemA.boleto)
      );

      // Solo eliminar si lo encontró
      return !encontrado;
    });
  }

  verificar_descargas_pdf() {
    let pasajes: string[] = [];

    // 1️⃣ Recolectar todos los pasajes 1
    for (let a = 0; a < this.nuevos_datos_agrupados.length; a++) {
      for (let b = 0; b < this.nuevos_datos_agrupados[a]['datos_asociados'].length; b++) {
        const boleto = this.nuevos_datos_agrupados[a]['datos_asociados'][b]['c_numboleto'];
        if (boleto.includes('BB') || boleto.includes('FB')) {
          pasajes.push(boleto);
        }
      }
    }

    // 1️⃣ Recolectar todos los pasajes 2
    for (let a = 0; a < this.responsegetBuscarPasajes.length; a++) {
      const boleto = this.responsegetBuscarPasajes[a]['c_numboleto'];
      if (boleto.includes('BB') || boleto.includes('FB')) {
        pasajes.push(boleto);
      }
    }

    // 2️⃣ Función para partir array en lotes de tamaño fijo
    const dividirEnLotes = (array: string[], tamano: number) => {
      const resultado: string[][] = [];
      for (let i = 0; i < array.length; i += tamano) {
        resultado.push(array.slice(i, i + tamano));
      }
      return resultado;
    };

    const lotes = dividirEnLotes(pasajes, 3);
    let acumulado: any[] = [];
    let indice = 0;

    $('#div_buscando_pdf').css('display', 'inline');

    // 3️⃣ Función recursiva para procesar lotes uno por uno
    const procesarLote = () => {
      if (indice >= lotes.length) {
        // 🔹 Cuando termina, actualiza estado final
        if (acumulado.length > 0) {
          this.pdf_para_descargar = acumulado;
          this.permitir_descargar_pdfs = 1;
        } else {
          this.pdf_para_descargar = [];
          this.permitir_descargar_pdfs = 3;
        }

        // 🔹 Marcar PDFs en nuevos_datos_agrupados
        for (let a = 0; a < acumulado.length; a++) {
          for (let b = 0; b < this.nuevos_datos_agrupados.length; b++) {
            for (let c = 0; c < this.nuevos_datos_agrupados[b]['datos_asociados'].length; c++) {
              if (this.nuevos_datos_agrupados[b]['datos_asociados'][c]['c_numboleto'] === acumulado[a]['boleto']) {
                this.nuevos_datos_agrupados[b]['datos_asociados'][c]['pdf_para_descargar'] = 1;
              }
            }
          }
        }

        $('#div_buscando_pdf').css('display', 'none');
        //console.log(this.pdf_para_descargar);
        return;
      }

      // 📡 Llamada al servicio con el lote actual
      this.taskService.postDescargarPdfPasajes(lotes[indice])
        .subscribe(
          (resp) => {
            if (resp.length > 0) {
              acumulado = acumulado.concat(resp);
            }
            indice++;
            procesarLote(); // ⏭ Ir al siguiente lote
          },
          (error) => {
            indice++;
            procesarLote(); // ⏭ Continuar aunque falle
          }
        );
    };

    // 🚀 Iniciar procesamiento
    procesarLote();
  }

  mostrar_panel_correo_pdf(){
    this.pdf_pasajes_enviar = 0;

    for(var a=0; a<this.DatosVistaViajes.length; a++){
      var fecha1;

      if(this.DatosVistaViajes[a]['fecha_partida'] != null && this.DatosVistaViajes[a]['fecha_partida'] != ""){
        fecha1 = new Date(this.funcionesService.convert_format_fecha_guion(this.funcionesService.invertir_fecha_guion(this.DatosVistaViajes[a]['fecha_partida']).replaceAll("-","/")));
      }else{
        fecha1 = "";
      }

      var fecha2 = new Date(this.funcionesService.convert_format_fecha_guion(this.date_actual.replaceAll("-","/")));
      
      if(fecha1 > fecha2){
        this.permitir_enviar_correo = 1;
        this.pdf_pasajes_enviar = 1;
      }else if(fecha1 < fecha2){
        this.permitir_enviar_correo = 0;
        this.pdf_pasajes_enviar = 0;
      }else{
        this.permitir_enviar_correo = 1;
        this.pdf_pasajes_enviar = 1;
      }
    }
  }

  ordenar_detalles_de_la_venta(){
    this.DatosDetallesVenta = [];

    for(var a=0; a<this.DatosVistaViajes.length; a++){
      if(a == 0) {
        this.DatosDetallesVenta.push({
          detalle_result_ws_id: this.DatosVistaViajes[0]['nro_operation_niubiz'] != null
                                ? (this.DatosVistaViajes[0]['detalle_result_ws_id'] != null
                                    ? this.DatosVistaViajes[0]['detalle_result_ws_id']
                                    : ((this.DatosVistaViajes[0]['detalle_tipcom'] === "BOLETA DE VENTA" || this.DatosVistaViajes[0]['detalle_tipcom'] === "FACTURA") 
                                        && this.DatosVistaViajes[0]['detalle_tipmov'] === "EFECTIVO" || this.DatosVistaViajes[0]['detalle_tipmov'] === "CREDITO"
                                        ? "Pagado"
                                        : ""))
                                : ((this.DatosVistaViajes[0]['detalle_tipcom'] === "BOLETA DE VENTA" || this.DatosVistaViajes[0]['detalle_tipcom'] === "FACTURA") 
                                    && (this.DatosVistaViajes[0]['detalle_tipmov'] === "EFECTIVO" || this.DatosVistaViajes[0]['detalle_tipmov'].includes("CONFIRMACION"))
                                    ? "Pagado"
                                    : ""),
          numoperacion: this.DatosVistaViajes[0]['nro_operation_niubiz'] != null ? this.DatosVistaViajes[0]['nro_operation_niubiz'] : (this.DatosVistaViajes[0]['n_numopeban'] != null ? this.DatosVistaViajes[0]['n_numopeban'] : ""),
          canal_venta: this.DatosVistaViajes[0]['detalle_canven'],
          boleto: this.DatosVistaViajes[0]['nro_operation_niubiz'] != "" ? this.DatosVistaViajes[0]['c_numboleto'] : this.DatosVistaViajes[0]['c_numbolant'],
          telefono: this.DatosVistaViajes[0]['telefono_pasajero'],
          email: this.DatosVistaViajes[0]['email_pasajero'] != null ? this.DatosVistaViajes[0]['email_pasajero'] : this.DatosVistaViajes[0]['c_email_contacto'],
          tipo: this.DatosVistaViajes[0]['detalle_tipcom'],
          correo_enviado: this.DatosVistaViajes[0]['correo_enviado1'] != 0 ? this.DatosVistaViajes[0]['correo_enviado1'] : this.DatosVistaViajes[0]['correo_enviado2'],
          ruc: this.DatosVistaViajes[0]['ruc_cliente'],
          razon_social: this.DatosVistaViajes[0]['razon_social'],
          direccion_ruc: this.DatosVistaViajes[0]['direccion_cliente'],
          numeroCip: this.DatosVistaViajes[0]['nro_cip_pagoefectivo'] != null ? this.DatosVistaViajes[0]['nro_cip_pagoefectivo'] : "",
          fecha_insercion: this.DatosVistaViajes[0]['audfecins'],
          fecha_hora_niubiz: this.DatosVistaViajes[0]['fecha_hora_niubiz'],
          fecha_hora_niubiz2: this.DatosVistaViajes[0]['fecha_hora_niubiz2'],
          fecha_hora_canje: this.DatosVistaViajes[0]['fecha_hora_canje'],
          fecha_hora_correo: this.DatosVistaViajes[0]['fecha_hora_correo']
        });
      }
    }
  }

  verificarClaseObservaciones(ListaPasajeros: any){
    for(var a = 0; a < this.nuevos_datos_agrupados.length; a++){
      const boleto = this.nuevos_datos_agrupados[a]['boleto'];
      
      if(ListaPasajeros['c_numboleto'] === boleto['c_numboleto'] || ListaPasajeros['c_numbolant'] === boleto['c_numboleto']){
        const datosAsociados = this.nuevos_datos_agrupados[a]['datos_asociados'];
        const ultimo = datosAsociados[datosAsociados.length - 1];

        if(boleto['c_numboleto'] != ultimo['c_numboleto']){
          if(ultimo['detalle_tipmov'].includes('POSTERGACION')){
            return 'tr_postergacion';
          }else if(ultimo['detalle_tipmov'] == 'CREDITO' && ultimo['detalle_tipcom'] == 'NOTA DE CREDITO'){
            return 'tr_nota_credito';
          }else if(ultimo['detalle_tipmov'] == 'EFECTIVO' && ultimo['detalle_tipcom'] == 'FACTURA'){
            return 'tr_viaje';
          }else if((ultimo['detalle_tipmov'] == 'CREDITO' || ultimo['detalle_tipmov'] == 'EFECTIVO') && ultimo['detalle_tipcom'] == 'BOLETA DE VENTA' && boleto['c_numboleto'] != ultimo['c_numboleto']){
            return 'tr_viaje';
          }else if(ultimo['detalle_tipmov'] == 'ANULACION'){
            return 'tr_anulacion';
          }else{
            return '';
          }
        }else{
          return `-`
        }
      }
    }

    return '';
  }

  verificarDataObservaciones(ListaPasajeros: any){
    for(var a = 0; a < this.nuevos_datos_agrupados.length; a++){
      const boleto = this.nuevos_datos_agrupados[a]['boleto'];
      
      if(ListaPasajeros['c_numboleto'] === boleto['c_numboleto'] || ListaPasajeros['c_numbolant'] === boleto['c_numboleto']){
        const datosAsociados = this.nuevos_datos_agrupados[a]['datos_asociados'];
        const ultimo = datosAsociados[datosAsociados.length - 1];

        if(boleto['c_numboleto'] != ultimo['c_numboleto']){
          if(ultimo['detalle_tipmov'].includes('POSTERGACION')){
            return `${ultimo['detalle_tipmov']}: ${ultimo['c_numboleto']}`
          }else if(ultimo['detalle_tipmov'] == 'CREDITO' && ultimo['detalle_tipcom'] == 'NOTA DE CREDITO'){
            return `${ultimo['detalle_tipcom']}: ${ultimo['c_numboleto']}`
          }else if(ultimo['detalle_tipmov'] == 'EFECTIVO' && ultimo['detalle_tipcom'] == 'FACTURA'){
            return `${ultimo['detalle_tipcom']}: ${ultimo['c_numboleto']}`
          }else if((ultimo['detalle_tipmov'] == 'CREDITO' || ultimo['detalle_tipmov'] == 'EFECTIVO') && ultimo['detalle_tipcom'] == 'BOLETA DE VENTA' && boleto['c_numboleto'] != ultimo['c_numboleto']){
            return `${ultimo['detalle_tipcom']}: ${ultimo['c_numboleto']}`
          }else{
            return `-`
          }
        }else{
          return `-`
        }
      }
    }
  }

  verificarDataViaje(DatosLista: any, ListaPasajeros: any): boolean {
    const comparaciones: [any, any][] = [
      [DatosLista.fecha_partida, this.funcionesService.convert_format_fecha_barra(ListaPasajeros.fecha_partida)],
      [DatosLista.servicio, ListaPasajeros.detalle_servicio],
      [DatosLista.salida, ListaPasajeros.c_origen],
      [DatosLista.destino, ListaPasajeros.c_destino],
      [DatosLista.hora_partida, ListaPasajeros.hora_partida],
      [DatosLista.hora_llegada, ListaPasajeros.hora_llegada],
      [DatosLista.direccion_partida, ListaPasajeros.direccion_agencia_partida],
      [DatosLista.direccion_llegada, ListaPasajeros.direccion_agencia_llegada]
    ];

    return comparaciones.every(([valor1, valor2]) => valor1 === valor2);
  }

  ordenar_vista_de_viajes(){
    // TODO: SE OBTIENE EL PRIMER REGISTRO
    this.DatosVistaViajes = [];

    for(const grupo of this.nuevos_datos_agrupados){
      if(!grupo.datos_asociados || grupo.datos_asociados.length === 0){
        continue;
      }

      //const primero = grupo.datos_asociados[0];
      const primero = grupo.boleto;

      if(
        (primero.detalle_tipcom === 'BOLETA DE VENTA' || primero.detalle_tipcom === 'FACTURA') &&
        (primero.detalle_tipmov === 'CREDITO' || primero.detalle_tipmov === 'EFECTIVO')
      ){
        this.DatosVistaViajes.push(primero);
      }
    }
    
    // TODO: SE OBTIENE LAS FECHAS DE PARTIDAS UNICAS
    this.DatosPartidasUnicas = [];

    this.DatosPartidasUnicas = Array.from(
      new Map(
        this.DatosVistaViajes
          .filter(item =>
            item.hora_partida && item.hora_partida.trim() !== '' &&
            item.hora_llegada && item.hora_llegada.trim() !== '' &&
            item.direccion_agencia_partida && item.direccion_agencia_partida.trim() !== '' &&
            item.direccion_agencia_llegada && item.direccion_agencia_llegada.trim() !== '' &&
            item.fecha_partida && this.funcionesService.convert_format_fecha_barra(item.fecha_partida).trim() !== ''
          )
          .map(item => {
            const reducido = {
              servicio: item.detalle_servicio,
              fecha_partida: this.funcionesService.convert_format_fecha_barra(item.fecha_partida),
              salida: item.c_origen,
              destino: item.c_destino,
              hora_partida: item.hora_partida,
              hora_llegada: item.hora_llegada,
              direccion_partida: item.direccion_agencia_partida,
              direccion_llegada: item.direccion_agencia_llegada
            };
            return [JSON.stringify(reducido), reducido];
          })
      ).values()
    );
  }

  agrupar_datos_por_boleto(boletosPrincipales: DatoAsociado[]){
    const datos_maestros: MaestroAsociado[] = [];

    for(const boleto of boletosPrincipales){
      datos_maestros.push({
        boleto,
        datos_asociados: []
      });
    }

    this.responsegetBuscarPasajes = this.responsegetBuscarPasajes.filter(item => {
      const existente = datos_maestros.find( d => d.boleto.c_numboleto === item.c_numboleto || d.boleto.c_numboleto === item.c_numbolant);
      if(existente){
        console.log(item.c_numboleto + " *** " + item.c_numbolant);
        existente.datos_asociados.push(item); return false;
      }
      return true;
    });

    this.nuevos_datos_agrupados = datos_maestros;
  }

  getClaseFila(data: any): string {
    if (data.estado_order === 1 && data.detalle_tipmov.includes('POSTERGACION')) {
      return 'tr_postergacion';
    }

    if (data.detalle_tipcom.includes('NOTA DE CREDITO')) {
      return 'tr_nota_credito';
    }

    if (data.estado_order === 1 && data.detalle_tipmov.includes('ANULACION')) {
      return 'tr_anulacion';
    }

    /*const esComprobanteValido = ['VOUCHER', 'BOLETA', 'FACTURA'].some(c => data.detalle_tipcom.includes(c));
    if (!esComprobanteValido) {
      return 'tr_anulacion';
    }*/

    if (data.estado_order === 1 && !data.detalle_tipmov.includes('POSTERGACION')) {
      return 'tr_viaje';
    }

    return '';
  }

  descargar_pdfs(){
    $(".loader").fadeIn("slow");
    for(var a=0; a<this.pdf_para_descargar.length; a++){
      for(var b=0; b<this.DataSelectDocument.length; b++){
        if(this.pdf_para_descargar[a]['boleto'] == this.DataSelectDocument[b]['boleto']){
          var sliceSize = 1024;
          var byteCharacters = atob(this.pdf_para_descargar[a]['pdf']);
          var byteArrays: any[] = [];

          for(var offset = 0; offset < byteCharacters.length; offset += sliceSize){
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for(var i = 0; i < slice.length; i++){
              byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, { type: 'application/octet-stream' });
          saveAs(blob, this.pdf_para_descargar[a]['boleto']+".pdf");
        }
      }
    }
    $(".loader").fadeOut("slow");
  }

  enviarPdfCorreo(){
    var email_pdf_correo = $("#email_pdf_correo").val().trim();
    if(email_pdf_correo!="" && email_pdf_correo.includes("@")){
      $(".loader").fadeIn("slow");

      var boletos_seleccionados: Array<string> = [];

      for(var a=0; a<this.DataSelectDocument.length; a++){
        if(this.pdf_pasajes_enviar == 1 || this.pdf_pasajes_enviar == 3){
          boletos_seleccionados.push(String(this.DataSelectDocument[a]['boleto']));
        }
      }

      var datos = {
        correo: $("#email_pdf_correo").val().trim(),
        boleto_factura: boletos_seleccionados
      }
  
      this.taskService.enviarPdfCorreo(datos).subscribe(responseEnviarPdfCorreo=> {
        if(Number(responseEnviarPdfCorreo) == 0){
          this.funcionesService.notificacion_mensaje("Error", "Hubo un error, vuelva a enviar los boletos a su correo.");
        }else if(Number(responseEnviarPdfCorreo) == 1){
          this.funcionesService.notificacion_mensaje("Success", "Se envió correctamente el correo.");
          $("#email_pdf_correo").val("");
        }

        $(".loader").fadeOut("slow");
      }, error =>{
        //! SI ES ERROR
        $(".loader").fadeOut("slow");
      }, () =>{
        $(".loader").fadeOut("slow");
      });
    }else{
      this.funcionesService.notificacion_mensaje("Warning", "Debe ingresar un correo electrónico para poder continuar.");
    }
  }
}