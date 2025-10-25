import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SqlInteligenteService {
  constructor(private http: HttpClient) {}

  async generarPrompt(): Promise<string> {
    //  Usa toPromise() para versiones antiguas de RxJS
    const metadata: any = await this.http.get('../assets/js/metadataDataTableOracle.json').toPromise();

    let contexto = '';
    for (const [tabla, info] of Object.entries(metadata as Record<string, any>)) {
      contexto += `\n\n TABLA: ${tabla}\n ${info.descripcion}\n`;

      if (info.columnas) {
        for (const [col, desc] of Object.entries(info.columnas)) {
          contexto += `   - ${col}: ${desc}\n`;
        }
      }

      if (info.primaryKey) {
        contexto += `    PK: ${info.primaryKey.join(', ')}\n`;
      }

      if (info.foreignKeys) {
        contexto += `    FKs:\n`;
        for (const [col, ref] of Object.entries(info.foreignKeys)) {
          contexto += `      ${col} → ${ref}\n`;
        }
      }
    }

    // TODO: TABLAS AGREGADAS.

    /*
      - VRTVENPAS
      - VRMAGENCIA
      - VRMCANVEN
      - VRMCENCOS
      - VRMCLIENTE
      - VRMEMPRESA
      - VRMFORPAG
      - VRMPREALI
      - VRMRUTA
      - VRMTARCRE
      - VRMTIPCOM
      - VRMTIPMOV
      - VRTREGISTROPAGO_PAYME
      - VRMPASAJERO
      - VRMPROMOCION
      - VRMSERVICIO
      - VRMTIPFORPAG
      - VRMUSUARIO
      - VRTMANIFIESTO
      - VRTITINERARIO
      - VRTLIQUIDACION
      - VRTDETITI
    */

    const prompt =
    "Eres un asistente experto en bases de datos Oracle SQL. " +
    "Tu tarea es generar consultas SQL (solo el código, sin explicaciones) basadas en las descripciones que te dará el usuario. " +
    "CONTEXTO: " +
    " - El usuario trabaja con un sistema de venta de boletos, postergaciones y pasajeros. " +
    " - Solo debes usar las tablas que están documentadas a continuación. " +
    " - Devuelve el SQL Oracle exacto, formateado correctamente y ejecutable. " +
    " - No inventes tablas ni campos fuera de lo que te proporciono. " +
    "\n\nESQUEMA DE TABLAS: " + contexto +
    "\n\nINSTRUCCIONES: " +
    " - Si el usuario pide un reporte, genera un SELECT con las tablas necesarias. " +
    " - Usa INNER JOIN o LEFT JOIN según corresponda. " +
    " - Guíate del nombre de los campos con las demás tablas y si son iguales, tienen un foreignKeys. "+
    " - No expliques nada, responde solo con el SQL listo para copiar y pegar. " +
    " - Devuelve solo el código SQL Oracle completo, sin explicaciones ni comentarios. " +
    " - Si el usuario menciona un rango de fechas, usa to_date() en formato 'dd/mm/yyyy'. " +
    "   Ejemplo: WHERE fecha BETWEEN to_date('24/10/2025','dd/mm/yyyy') AND to_date('25/10/2025','dd/mm/yyyy'). " +
    " - Si el usuario no indica fechas, utiliza la fecha actual del sistema. " +
    " - No uses parámetros como :fecha_inicio o :fecha_fin. " +
    " - No inventes tablas ni columnas que no existan. " +
    " - NO uses ningún tipo de formato markdown (no incluyas ```sql ni ```). " +
    " - Responde únicamente con la sentencia SQL limpia y lista para ejecutar.";

    return prompt;
  }
}