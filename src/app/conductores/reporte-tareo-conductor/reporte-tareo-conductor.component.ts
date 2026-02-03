import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { SharedService } from '../../shared.service';
import { TaskService } from '../../services/task.service';
import { FuncionesService } from '../../funciones/funciones.service';
import { forkJoin } from 'rxjs';

declare var $:any;

@Component({
  selector: 'app-reporte-tareo-conductor',
  templateUrl: './reporte-tareo-conductor.component.html',
  styleUrls: ['./reporte-tareo-conductor.component.css']
})
export class ReporteTareoConductorComponent implements OnInit {

  date_actual: string = "";

  date_fecha_inicio: string = "";
  date_fecha_fin: string = "";
  conductor: number = 0;

  ListReporteTareoConductor: any = [];
  ltPilotos: any = [];

  dataReporteMantenimientoRuta: any = [];

  dataReporteTareoConductor: any[] = [];
  dataReporteFormularioReten: any[] = [];

  ListReporteConsolidado: any[] = [];

  constructor(private sharedService:SharedService, private tokenService: TokenService, private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object, public funcionesService: FuncionesService) { 
    this.date_actual = this.funcionesService.getFechaHoyGuion();

    this.date_fecha_inicio = this.funcionesService.getFechaSemanaAtrasGuion();
    this.date_fecha_fin = this.funcionesService.getFechaHoyGuion();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.taskService.getPilotos().subscribe(responsegetPilotos => {
      this.ltPilotos = responsegetPilotos;
    });

    this.taskService.getReporteMantenimientoRuta(0, 0).subscribe(responsegetReporteMantenimientoRuta => {
      this.dataReporteMantenimientoRuta = responsegetReporteMantenimientoRuta;
    });

    this.mostrarDataReporte();
  }

  mostrarDataReporte(){
    $(".loader").fadeIn("slow");

    this.ListReporteTareoConductor = [];
    $("#tabla_reportes").DataTable().destroy();

    this.ListReporteConsolidado = [];
    $("#tabla_reportes2").DataTable().destroy();

    //console.log(this.date_fecha_inicio);
    //console.log(this.date_fecha_fin);
    //console.log(this.conductor);

    forkJoin({
      reten: this.taskService.getReporteFormularioReten(this.date_fecha_inicio, this.date_fecha_fin),
      tareo: this.taskService.getReporteTareoConductor(this.date_fecha_inicio, this.date_fecha_fin, Number(this.conductor))
    }).subscribe(({ reten, tareo }) => {
      this.dataReporteFormularioReten = (reten || []).map(dat => ({
        ...dat,
        fecha_partida: this.funcionesService.convert_format_fecha_barra(dat.fecha_partida)
      }));

      this.dataReporteFormularioReten = (reten || []).map(dat => ({
        ...dat,
        nombre_conductor: (dat.nombre_conductor || '')
          .replace(/,/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      }));

      this.dataReporteFormularioReten = reten || [];
      this.dataReporteTareoConductor = tareo || [];

      if (this.dataReporteTareoConductor.length === 0) {    // || this.dataReporteFormularioReten.length === 0
        $(".loader").fadeOut("slow");
        return;
      }

      const retenIndex = new Map<string, any[]>();
      
      for (const r of this.dataReporteFormularioReten) {
        r.fecha_partida = (this.funcionesService.convert_format_fecha_barra(r.fecha_partida) || '').trim();
        r.nombre_conductor = (r.nombre_conductor || '').replace(/,/g, '').replace(/\s+/g, ' ').trim().toUpperCase();

        const key = `${r.fecha_partida}||${r.nombre_conductor}`;
        const arr = retenIndex.get(key) || [];
        arr.push(r);
        retenIndex.set(key, arr);
      }

      this.ListReporteTareoConductor = [];

      for (const t of this.dataReporteTareoConductor) {
        const key = `${t.fecha_partida}||${t.conductor}`;
        const retenList = retenIndex.get(key) || [];

        const kilometraje = this.conseguirKilometraje(t.origen, t.destino);
        const precioRutaReten = this.conseguirPreciosRutasReten("");
        const precioRutaKilometraje = this.conseguirPreciosRutasKilometraje(t.origen, t.destino, t.servicio);;
        
        if (retenList.length > 0) {
          for (const r of retenList) {
            const precioRutaReten = this.conseguirPreciosRutasReten(r.tipo);
            const precioRutaKilometraje = this.conseguirPreciosRutasKilometraje(t.origen, t.destino, t.servicio);

            this.ListReporteTareoConductor.push({
              fecha_partida: t.fecha_partida,
              conductor: t.conductor,
              tipo_cond: r.tipo_conductor,
              turno: t.turno,
              nro_bus: t.nro_bus,
              placa_bus: t.placa_bus,
              servicio: t.servicio,
              status: r.tipo,
              origen: t.origen,
              destino: t.destino,
              kilometraje,
              precio_ruta_reten: precioRutaReten,
              precio_ruta_kilometraje: precioRutaKilometraje,
              precio_ruta: precioRutaReten + precioRutaKilometraje
            });
          }
        } else {
          // No hay retén: igual insertas la fila del tareo
          this.ListReporteTareoConductor.push({
            fecha_partida: t.fecha_partida,
            conductor: t.conductor,
            tipo_cond: '-',
            turno: t.turno,
            nro_bus: t.nro_bus,
            placa_bus: t.placa_bus,
            servicio: t.servicio,
            status: '-',
            origen: t.origen,
            destino: t.destino,
            kilometraje,
            precio_ruta_reten: precioRutaReten,
            precio_ruta_kilometraje: precioRutaKilometraje,
            precio_ruta: precioRutaReten + precioRutaKilometraje
          });
        }
      }

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

        //if(Number(this.conductor) != 0){
          this.reporte_consolidado();
        //}
      }, 200);
    }, error => {
      $(".loader").fadeOut("slow");
    });
  }

  reporte_consolidado(){
    const map = new Map<string, any>();

    for (const x of this.ListReporteTareoConductor || []) {
      const fecha = (x.fecha_partida || '').trim();
      const conductor = (x.conductor || '').trim();

      const key = `${fecha}||${conductor}`;

      const km = Number(x.kilometraje ?? 0) || 0;
      const precioRutaReten = Number(x.precio_ruta_reten ?? 0) || 0;
      const precioRutaKilometraje = Number(x.precio_ruta_kilometraje ?? 0) || 0;
      const precio = Number(x.precio_ruta ?? 0) || 0;

      if (!map.has(key)) {
        map.set(key, {
          fecha_partida: fecha,
          conductor,
          kilometraje: 0,
          precio_ruta_reten: 0,
          precio_ruta_kilometraje: 0,
          precio_ruta: 0
        });
      }

      const row = map.get(key);
      row.kilometraje += km;
      row.precio_ruta_reten += precioRutaReten;
      row.precio_ruta_kilometraje += precioRutaKilometraje;
      row.precio_ruta += precio;
    }

    for (const row of map.values()) {
      row.precio_ruta = Number(row.precio_ruta.toFixed(2));
    }
    
    this.ListReporteConsolidado = Array.from(map.values());

    setTimeout(() => {
      $('#tabla_reportes2').DataTable({
        pageLength: 10,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: true,
        scroller: true,
        searching: true
      });
    }, 200);
  }

  conseguirKilometraje(origen: string, destino: string) {
    const ruta = this.dataReporteMantenimientoRuta.find((r: any) =>
      r.c_origen === origen && r.c_destino === destino
    );
    return ruta ? ruta.n_kilometros : 0;
  }

  /*conseguirPreciosRutas(origen: string, destino: string, servicio: string, status: string) {
    const ruta = this.dataReporteMantenimientoRuta.find((r: any) =>
      r.c_origen === origen && r.c_destino === destino
    );
    if (!ruta) return 0;

    const s = (servicio || '').toLowerCase();

    let base =
      s.includes('economico') ? (ruta.precio_economico ?? ruta.precio_base) :
      (s.includes('ejecutivo') || s.includes('e. vip')) ? (ruta.precio_ejecutivo ?? ruta.precio_base) :
      s.includes('presidencial') ? (ruta.precio_presidencial ?? ruta.precio_base) :
      s.includes('premier') ? (ruta.precio_premier ?? ruta.precio_base) :
      ruta.precio_base;

    const st = (status || '')
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, ' ')
      .trim();

    const extraByStatus: Record<string, number> = {
      'RETEN DIA': 42,
      'RETEN NOCHE': 42,
      'ACERCAMIENTO DIA': 42,
      'ACERCAMIENTO NOCHE': 42,
      'DESCANSO MEDICO': 0,
      'DESCANSO FISICO': 0,
      'VACACIONES': 0,
      'LICENCIA': 0,
      'CON GOCE': 0,
      'SIN PROGRAMACION': 0
    };

    const extra = extraByStatus[st] ?? 0;

    return Number(base) + extra;
  }*/

  conseguirPreciosRutasKilometraje(origen: string, destino: string, servicio: string){
    const ruta = this.dataReporteMantenimientoRuta.find((r: any) =>
      r.c_origen === origen && r.c_destino === destino
    );
    if (!ruta) return 0;

    const s = (servicio || '').toLowerCase();

    let base =
    s.includes('economico') ? (ruta.precio_economico ?? ruta.precio_base) :
    (s.includes('ejecutivo') || s.includes('e. vip')) ? (ruta.precio_ejecutivo ?? ruta.precio_base) :
    s.includes('presidencial') ? (ruta.precio_presidencial ?? ruta.precio_base) :
    s.includes('premier') ? (ruta.precio_premier ?? ruta.precio_base) :
    ruta.precio_base;

    return Number(base);
  }

  conseguirPreciosRutasReten(status: string){
    const st = (status || '')
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, ' ')
      .trim();

    const extraByStatus: Record<string, number> = {
      'ACERCAMIENTO DIA': 42,
      'ACERCAMIENTO NOCHE': 42,
      'APOYO Y MANTENIMIENTO': 42,
      'CIERRE DE TURNO O SERVICIO': 42,
      'CON GOCE': 0,
      'DESCANSO FISICO': 0,
      'DESCANSO MEDICO': 0,
      'GRUPO': 42,
      'LICENCIA': 0,
      'REINTEGRO DE RETEN': 42,
      'RETEN ANTAMINA EXTERNO': 42,
      'RETEN ANTAMINA INTERNO': 110,
      'RETEN DIA': 42,
      'RETEN LA ARENA': 100,
      'RETEN NOCHE': 42,
      'SIN PROGRAMACION': 0,
      'VACACIONES': 0
    };

    const extra = extraByStatus[st] ?? 0;

    return extra;
  }

  tableToExcel(){
    $(".loader").fadeIn("slow");

    const header = ['FECHA PARTIDA', 'CONDUCTOR', 'TIPO CONDUCTOR', 'TURNO', 'UNIDAD', 'PLACA', 'SERVICIO', 'STATUS', 'ORIGEN', 'DESTINO', 'KILOMETRAJE', 'PRECIO RUTA'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteTareoConductor.length; i++) {
      body.push([
        `${this.ListReporteTareoConductor[i]['fecha_partida']}`,
        `${this.ListReporteTareoConductor[i]['conductor']}`,
        `${this.ListReporteTareoConductor[i]['tipo_cond']}`,
        `${this.ListReporteTareoConductor[i]['turno']}`,
        `${this.ListReporteTareoConductor[i]['nro_bus']}`,
        `${this.ListReporteTareoConductor[i]['placa_bus']}`,
        `${this.ListReporteTareoConductor[i]['servicio']}`,
        `${this.ListReporteTareoConductor[i]['status']}`,
        `${this.ListReporteTareoConductor[i]['origen']}`,
        `${this.ListReporteTareoConductor[i]['destino']}`,
        `${this.ListReporteTareoConductor[i]['kilometraje']}`,
        `${this.ListReporteTareoConductor[i]['precio_ruta']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteTareoConductor');
    $(".loader").fadeOut("slow");
  }

  tableToExcel2(){
    $(".loader").fadeIn("slow");

    const header = ['FECHA PARTIDA', 'CONDUCTOR', 'KILOMETRAJE', 'PRECIO RUTA'];
    
    const body: string[][] = [];

    for (let i = 0; i < this.ListReporteTareoConductor.length; i++) {
      body.push([
        `${this.ListReporteTareoConductor[i]['fecha_partida']}`,
        `${this.ListReporteTareoConductor[i]['conductor']}`,
        `${this.ListReporteTareoConductor[i]['kilometraje']}`,
        `${this.ListReporteTareoConductor[i]['precio_ruta']}`
      ]);
    }
    
    this.funcionesService.exportarReporteExcel(header, body, 'ReporteConsolidado');
    $(".loader").fadeOut("slow");
  }
}