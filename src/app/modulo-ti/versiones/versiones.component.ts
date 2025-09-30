import { Component, OnInit } from '@angular/core';
import { HistorialCambio } from '../../interfaces/HistorialCambio';

declare var $:any;

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.css']
})
export class VersionesComponent implements OnInit {

  lstHistorialCambios: HistorialCambio[] = [];

  constructor() { }

  ngOnInit(): void {
    const data: HistorialCambio[] = [
      {
        version: '2.3',
        fecha_hora_publicacion: '19:00:00 PM del 30/09/2025',
        descripcion: [
          'Se agregó el módulo de Reporte Frotcom para los roles de Operaciones.',
          'Cambio del diseño total de la Intranet.'
        ]
      },
      {
        version: '2.2',
        fecha_hora_publicacion: '11:22:00 PM del 27/08/2025',
        descripcion: [
          'Se solucionó sobre la diferencia entre Soles y Porcentajes al aplicar descuento en la Intranet, CORREO: INTRANET | PROMOCIÓN IDA Y VUELTA.'
        ]
      },
      {
        version: '2.1',
        fecha_hora_publicacion: '18:00 PM del 15/08/2025',
        descripcion: [
          'Mejora en el módulo de "Operaciones > Consulta de Boletos", agregando el historial de cambios por cada boleto, los transbordos encontrados que se realizaron por cada boleto, también permite descargar todos los PDFs encontrados, ya sean boletos, postergaciones o confirmaciones.'
        ]
      },
      {
        version: '2.0',
        fecha_hora_publicacion: '00:01 AM del 09/07/2025',
        descripcion: [
          'Se habilitó la búsqueda por "OBSERVACIONES" en el Reporte de Ventas, no se visualiza en la tabla por tema de dimensiones en el diseño, pero permite su búsqueda en el cuadro de texto.',
          'Se agregó las ventas por PagoEfectivo , para Ventas mayores e iguales a S/. 86.00',
          'Se separó la visualización de Cantidad de Ventas y Montos de PagoLink y PagoEfectivo, cada uno por separado en el Reporte de Ventas.',
          'Se agregaron las promociones por Descuentos por RUC y también Descuentos por Tarjeta.',
          'No se pueden acumular Promociones en una Venta.',
          'Al realizar una Venta, en el apartado de llenar los Datos del Pasajero, aparecen las Promociones automáticamente de acuerdo a al Itinerario, Ruta, Fecha de Viaje y Tipo de Servicio.',
          'Se modificó el modelo del formato de PagoLink que se envía como correo al Pasajero.'
        ]
      },
      {
        version: '1.2',
        fecha_hora_publicacion: '02:00 AM del 05/05/2025',
        descripcion: [
          'Se bajó la sesión activa de 3 horas a 40 minutos.',
          'Se bajó el tiempo de la deshabilitación del link de Niubiz y reserva de asientos, de 2 horas a 1 hora.',
          'Se solucionó el problema del envío de correos de los pasajes en el módulo de "Consulta Boletos".',
          'Se realizó el copiado de los correos enviados a confirmacionpasajes@movilbus.pe.',
          'Se agregó la búsqueda por Voucher en el módulo de "Consulta Boletos" y la columna de precio.'
        ]
      },
      {
        version: '1.1',
        fecha_hora_publicacion: '03:05 AM del 28/04/2025',
        descripcion: [
          'Al ingresar un teléfono, se debe actualizar en todos los pasajeros.',
          'Permite al pasajero menor de edad, agregar el adulto con quien viajara.',
          'Deshabilitar link de Niubiz pasado las 2 horas.',
          'Aumentar el tiempo de la sesión activa a 3 horas.',
          'Solución de ventas que no se registraban en la base de datos.',
          'Pasajero menor de edad, ahora permite agregar el adulto con quien viajara.',
          'Ahora en la Intranet, permite que se abran varias pestañas a la vez para distintas ventas sin que se mezclen los datos entre las ventas y funcione cada uno por separado.',
          'Se mejoró el módulo de "Consulta de Boletos", dando una mejor visión de todo el historial de cambios que pasa en un conjunto de boletos o facturas dentro de una misma venta, agregando también el envío de correos electrónicos de los pasajes y también la opción de descarga de PDF de la misma venta.',
          'En el módulo de "Consulta de Boletos", aparece un  al costado de los pasajeros si ese boleto se encuentra en el FE, y si se muestra en un tono pálido , quiere decir que no se encuentra en el FE.',
          'El botón de Envío de Correos en el módulo de "Consulta de Boletos", solo lo hará si los viajes son posteriores o iguales a la fecha actual, y solo enviará el PDF del viaje que cumpla esas condiciones. (Todos los PDF de la venta deben aparecer en Rojo )',
          'El botón de Descarga de PDF en el módulo de "Consulta de Boletos", solo aparecerá si todos los PDF de la venta aparecen en Rojo .'
        ]
      }];

    this.lstHistorialCambios = data;
  }

  ngAfterViewInit(){
    $(".loader").fadeOut("slow");
  }
}