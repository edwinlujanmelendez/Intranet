import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import * as XLSX from 'xlsx';

declare var $:any;

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.component.html',
  styleUrls: ['./mantenimiento-rutas.component.css']
})
export class MantenimientoRutasComponent implements OnInit {

  date_actual: string = "";

  codLocalidadIda: number = 0;
  codLocalidadDestino: number = 0;

  ltLocalidadOrigen: any;
  ltLocalidadDestino: any;

  ListReporteMantenimientoRutas: any = [];

  ArrayMostrarModal: any = [];

  fileName: string = "";
  fileSize: string = "";

  fileSelected: File | null = null;
  excelRows: any[] = [];
  excelHeaders: string[] = [];

  constructor(private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
    this.date_actual = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.taskService.getLocalidad().subscribe(responseLocalidad => {
      this.ltLocalidadOrigen = responseLocalidad;
      this.ltLocalidadDestino = responseLocalidad;
    });

    this.mostrarDataReporte();
  }

  mostrarDataReporte(){
    $(".loader").fadeIn("slow");

    this.ListReporteMantenimientoRutas = [];

    $("#tabla_reportes").DataTable().destroy();

    this.taskService.getReporteMantenimientoRuta(this.codLocalidadIda, this.codLocalidadDestino).subscribe(responsegetReporteMantenimientoRuta => {
      //console.log(responsegetReporteMantenimientoRuta);
      this.ListReporteMantenimientoRutas = responsegetReporteMantenimientoRuta;

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

  onChangeOrigen(){
    this.taskService.getLocalidadDestino(this.codLocalidadIda).subscribe(response => {
      this.ltLocalidadDestino = response;
    });
  }

  cargarActualizarReporte(){
    this.resetFile();
    this.abrirModal('modal_cargar_excel');
  }

  tableToExcel(){
    $(".loader").fadeIn("slow");

    const header = ['ID RUTA', 'ORIGEN', 'DESTINO', 'KILOMETROS', 'HORAS DE VIAJE', 'PRECIO BASE', 'PRECIO ECONOMICO', 'PRECIO EJECUTIVO', 'PRECIO PRESIDENCIAL', 'PRECIO PREMIER'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteMantenimientoRutas.length; i++) {
      body.push([
        `${this.ListReporteMantenimientoRutas[i]['ruta_id']}`,
        `${this.ListReporteMantenimientoRutas[i]['c_origen']}`,
        `${this.ListReporteMantenimientoRutas[i]['c_destino']}`,
        `${this.ListReporteMantenimientoRutas[i]['n_kilometros']}`,
        `${this.ListReporteMantenimientoRutas[i]['n_horvia']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_base']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_economico']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_ejecutivo']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_presidencial']}`,
        `${this.ListReporteMantenimientoRutas[i]['precio_premier']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteMantenimientoRutas');
    $(".loader").fadeOut("slow");
  }

  abrirModal(nombreModal: string) {
    this.ArrayMostrarModal[nombreModal] = true;
    document.body.classList.add('overflow-x-hidden');
  }

  cerrarModal(nombreModal: string) {
    this.ArrayMostrarModal[nombreModal] = false;
    document.body.classList.remove('overflow-x-hidden');
  }

  procesar_excel_rutas(){
    if (!this.fileSelected) {
      alert("Selecciona un Excel primero.");
      return;
    }

    if (!this.excelRows || this.excelRows.length === 0) {
      alert("No se detectaron filas en el Excel.");
      return;
    }

    $('#reload_excel1').css('display', 'inline');

    const dataExcel = this.excelRows.map(r => ({
      ruta_id: this.toNumber(r['ID RUTA']),
      c_origen: this.toText(r['ORIGEN']),
      c_destino: this.toText(r['DESTINO']),
      n_kilometros: this.toNumber(r['KILOMETROS']),
      n_horvia: this.toNumber(r['HORAS DE VIAJE']),
      precio_base: this.toNumber(r['PRECIO BASE']),
      precio_economico: this.toNumber(r['PRECIO ECONOMICO']),
      precio_ejecutivo: this.toNumber(r['PRECIO EJECUTIVO']),
      precio_presidencial: this.toNumber(r['PRECIO PRESIDENCIAL']),
      precio_premier: this.toNumber(r['PRECIO PREMIER']),
    })).filter(x => x.ruta_id > 0 && x.c_origen && x.c_destino);

    this.taskService.insertDatosMantenimientoRuta(dataExcel).subscribe(responseinsertDatosMantenimientoRuta => {
      if(responseinsertDatosMantenimientoRuta['result'] == true) {
        //console.log("todo bien");
        this.funcionesService.notificacion_mensaje("Success", "Se actualizaron las rutas de forma correcta.");
        this.cerrarModal('modal_cargar_excel');
        this.mostrarDataReporte();
      } else {
        //console.log("todo mal");
        this.funcionesService.notificacion_mensaje("Error", "Hubo un error al actualizar los datos de las rutas.");
      }

      $('#reload_excel1').css('display', 'none');
    }, error => {
      //console.log("todo mal");
      this.funcionesService.notificacion_mensaje("Error", "Hubo un error al actualizar los datos de las rutas.");
      $('#reload_excel1').css('display', 'none');
    });
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;

    // Excel puede venir como number o string
    const s = String(value).trim().replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  private toText(value: any): string {
    return String(value ?? '').trim();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.resetFile();
      return;
    }

    const file = input.files[0];

    // validación extra por seguridad (no confiar solo en accept)
    const allowedExtensions = ['xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(extension)) {
      this.resetFile();
      alert("Solo se permiten archivos Excel (.xlsx, .xls)");
      input.value = ""; // limpia el input
      return;
    }

    this.fileSelected = file;
    this.fileName = file.name;
    this.fileSize = this.formatBytes(file.size);

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = e.target.result as ArrayBuffer;
        const wb = XLSX.read(data, { type: 'array' });

        // primera hoja
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];

        // 1) obtener filas como array (incluye header)
        const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (!raw || raw.length <= 1) {
          this.excelHeaders = [];
          this.excelRows = [];
          alert("El Excel está vacío o no tiene data.");
          return;
        }

        // headers
        this.excelHeaders = raw[0].map((h: any) => String(h).trim());

        // rows -> convierte array[][] en objetos usando headers
        this.excelRows = raw.slice(1)
          .filter(r => r.some(c => String(c).trim() !== '')) // filtra filas vacías
          .map(row => {
            const obj: any = {};
            this.excelHeaders.forEach((h, i) => obj[h] = row[i] ?? '');
            return obj;
          });
      } catch (err) {
        console.error(err);
        alert("Error leyendo el Excel.");
        this.excelHeaders = [];
        this.excelRows = [];
      }
    };

    reader.readAsArrayBuffer(file);
  }

  resetFile() {
    this.fileSelected = null;
    this.fileName = "";
    this.fileSize = "";
  }

  /** Convierte bytes a KB/MB */
  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}