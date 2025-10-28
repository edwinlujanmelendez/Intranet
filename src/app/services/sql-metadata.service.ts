import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SqlInteligenteService {
  constructor(private http: HttpClient) {}

  async generarPrompt(): Promise<string> {
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
    // ? ************* ITINERARIOS
    // - VRTITINERARIO
    // - VRTDETITI
    // - VRMSERVICIO
    // - VRMRUTA
    // - VRMLOCALIDAD
    // - VRTITIAGEPAR
    // - VRTITIAGELLE
    // - VRTTARIFAXNIVEL
    // - VRMTIPITI
    // - VRMAGENCIA
    // - VRMTIPAGE
    // - VRMBUS
    // - VRMESTBUS
    // - VRMCONFIGASIENTO
    // - VRTMANIFIESTO
    // - VRTTRANSBORDO

    // ? ************* VENTAS
    // - VRTVENPAS
    // - VRMCANVEN
    // - VRMTIPMOV
    // - VRMTIPCOM
    // - VRMTIPFORPAG
    // - VRMTIPTAR
    // - VRMTARCRE
    // - VRMOPETARCRE
    // - VRMTIPNOTA
    // - VRMFORPAG
    // - VRMCLIENTE
    // - VRMNETSUITCLIENTE
    // - VRMPARENTESCO
    // - VRMCONCESIONARIO
    // - VRMEMPRESA
    // - VRMLOGECOMMERCE
    // - VRMPOS
    // - VRTEMBARQUE
    // - VRTCORTESIA
    // - VRTHISTORIALVENTAS
    // - VRTLOGCANJEVENPAS
    // - VRTLOGSENDMAILVENPAS
    // - VRTSENDMAILPASAJEROS
    // - VRHREIMPRESION

    // ? ************* USUARIOS
    // - VRMUSUARIO
    // - VRTUSUHARD
    // - VRTAUDIACCESO
    // - VRMPERSONAL
    // - VRMESTCIV

    // ? ************* PROMOCIONES
    // - VRMPROMOCION
    // - VRMPROMOCIONES
    // - VRTPROMOCIONES
    // - VRMGRUPOCUPONES

    // ? ************* PASAJEROS
    // - VRMPASAJERO
    // - VRMTIPDOC
    // - VRMSEXO

    // ? ************* CONFIGURACION
    // - VRMPARAMETROS
    // - VRMFLAG

    // ? ************* LIQUIDACION
    // - VRTLINCRECLI
    // - VRTLIQUIDACION
    // - VRTDETLIQ

    // ? ************* ASIENTOS BLOQUEADOS TEMPORALMENTE
    // - VRTTMPOCUASI

    // ? ************* ROLES
    // - VRMROL
    // - VRTUSUARIO_ROL

    // ? ************* AGREGADOS
    // - VRMCENCOS
    // - VRMTIPCENCOS
    // - VRMESPVAL
    // - VRMMOTCOR
    // - VRTCARCLI
    // - VRTHRE
    // - VRTDETHRE
    // - VRTPROSER

    const prompt =
    "Eres un asistente experto en bases de datos Oracle SQL. " +
    "Tu tarea es generar consultas SQL (solo el código, sin explicaciones) basadas en las descripciones que te dará el usuario. " +
    "CONTEXTO: " +
    " - El usuario trabaja con un sistema de venta de boletos, postergaciones y pasajeros. " +
    " - Solo debes usar las tablas que están documentadas a continuación. " +
    " - Devuelve el SQL Oracle exacto, formateado correctamente y ejecutable. " +
    " - No inventes tablas ni campos fuera de lo que te proporciono. " +
    "\n\nESQUEMA DE TABLAS: " + contexto +
    "\n\nDATOS ADICIONALES: "+
    " - si dicen BOLETA al consultar la tabla VRMTIPCOM, el Query colocalo BOLETA DE VENTA, asi: C_DENOMINACION='BOLETA DE VENTA'. "+
    " - si consultas la tabla VRTEMBARQUE, guiate si no encontro datos 'NO VIAJO', si encontro datos 'VIAJO', no te guies de FLAG_MANUAL, has esto: CASE WHEN EXISTS ( SELECT 1 FROM VRTEMBARQUE WHERE C_NUMBOLETO = '...' ) THEN 1 ELSE 0 END AS HAY_DATA. "+
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
    " - Responde únicamente con la sentencia SQL limpia y lista para ejecutar. "+
    "\n\nIMPORTANTE: "+
    " - No inventes tablas ni columnas que no existan. "+
    " - Usa únicamente los nombres exactos de las tablas y columnas proporcionadas en el JSON. "+
    " - NO uses ningún tipo de formato markdown (no incluyas ```sql ni ```). ";

    return prompt;
  }
}