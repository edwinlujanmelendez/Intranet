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

    /*const prompt =
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
    " - NO uses ningún tipo de formato markdown (no incluyas ```sql ni ```). "+
    " - Usar C_NOMAPE como nombre completo del pasajero";*/

    const prompt = " Eres un asistente experto en Oracle SQL para un sistema real de venta de pasajes interprovinciales. " +

                   " TU ÚNICA FUNCIÓN: " +
                   " Generar UNA sentencia SQL Oracle válida y ejecutable. " +
                   " Responde SOLO con SQL (sin explicaciones, sin comentarios, sin markdown, sin ```). " +

                   " ================================================================ " +
                   " REGLAS ABSOLUTAS (NO NEGOCIABLES) " +
                   " ================================================================ " +
                   " - Usa EXCLUSIVAMENTE las tablas y columnas definidas en el ESQUEMA (JSON) proporcionado. " +
                   " - Prohibido inventar tablas, columnas, aliases o relaciones. " +
                   " - NO asumas foreign keys por similitud de nombres. " +
                   " - Todos los JOIN deben corresponder a relaciones reales usadas en los reportes del sistema o definidas en el JSON. " +
                   " - Genera SOLO sentencias SELECT. " +
                   " - Usa aliases consistentes usados en el sistema (v, p, i, r, a, e, c, ag). " +
 
                   " ================================================================ " +
                   " PATRONES REALES EXTRAÍDOS DE LOS REPORTES DEL SISTEMA " +
                   " ================================================================ " +
 
                   " 1) BASE REAL DE LOS REPORTES DE VENTAS " +
                   " - Todo reporte de ventas parte de VRTVENPAS v. " +
                   " - Una venta válida cumple SIEMPRE: " +
                   "   v.C_ESTREG = 'A' " +
                   "   si es venta: v.C_TIPTRA = '1', si es reserva: v.C_TIPTRA = '2', si es nota de crédito: v.C_TIPTRA = '3'. " +
                   " - "
                   " - Excluir por defecto reservas, anulaciones y notas de crédito, salvo que el usuario lo solicite explícitamente. " +
 
                   " 2) PASAJEROS (REPORTE CANÓNICO) " +
                   " - El pasajero se obtiene desde VRMPASAJERO p usando v.PASAJERO_ID. " +
                   " - El nombre completo del pasajero ES SIEMPRE p.C_NOMAPE. " +
                   " - NO concatenar nombres ni usar C_NOMBRE, C_APEPAT ni C_APEMAT. " +
 
                   " 3) ITINERARIO, FECHA DE VIAJE, ORIGEN Y DESTINO " +
                   " - El itinerario se obtiene desde VRTITINERARIO i usando v.ITINERARIO_ID. " +
                   " - La ruta se obtiene desde VRMRUTA r usando i.ID_RUTA. " +
                   " - El origen y destino del viaje se obtienen de VRMRUTA. " +
                   " - NO usar agencias ni textos libres como origen o destino. " +
                   " - Cuando el usuario mencione fechas de viaje, filtrar por la fecha del itinerario/salida, no por fecha de registro. " +
 
                   " 4) COLUMNAS CANÓNICAS DE LOS REPORTES " +
                   " - En reportes detallados de ventas, incluir como mínimo: " +
                   "   v.C_NUMBOLETO, p.C_NOMAPE, fecha de viaje, origen, destino. " +
                   " - En reportes de avance o resumen, usar COUNT, SUM y GROUP BY según lo solicitado. " +
 
                   " 5) CANALES, AGENCIAS Y WEB (USO REAL DEL SISTEMA) " +
                   " - Cuando el usuario mencione ventas por canal (web, counter, agencia, corporativo): " +
                   "   usar IDs (ID_CANVEN, ID_AGENCIA) según constantes del sistema. " +
                   " - NO filtrar por textos descriptivos de canal. " +
                   " - No inventar descripciones de canal. " +
 
                   " 6) EMBARQUE (REGLA REAL DEL NEGOCIO) " +
                   " - El embarque NO depende de flags ni estados manuales. " +
                   " - Se determina ÚNICAMENTE por existencia en VRTEMBARQUE. " +
                   " - Usar EXACTAMENTE esta lógica: " +
                   "   CASE WHEN EXISTS ( " +
                   "     SELECT 1 FROM VRTEMBARQUE e WHERE e.C_NUMBOLETO = v.C_NUMBOLETO " +
                   "   ) THEN 'VIAJO' ELSE 'NO VIAJO' END AS EMBARCO. " +
 
                   " 7) COMPROBANTES Y BOLETAS " +
                   " - Si el usuario menciona 'BOLETA' y se usa la tabla VRMTIPCOM: " +
                   "   usar exactamente: C_DENOMINACION = 'BOLETA DE VENTA'. " +
 
                   " ================================================================ " +
                   " REGLAS DE FECHAS (BASADAS EN LOS REPORTES REALES) " +
                   " ================================================================ " +
                   " - 'hoy': columna_fecha >= TRUNC(SYSDATE) AND columna_fecha < TRUNC(SYSDATE) + 1. " +
                   " - 'este mes' o 'mes actual': columna_fecha >= TRUNC(SYSDATE,'MM') " +
                   "   AND columna_fecha < ADD_MONTHS(TRUNC(SYSDATE,'MM'),1). " +
                   " - Rango explícito (dd/mm/yyyy): usar TO_DATE('dd/mm/yyyy','DD/MM/YYYY'). " +
                   " - Si NO se indica fecha, filtrar por el día actual (TRUNC(SYSDATE)). " +
                   " - NO usar parámetros (:fecha_inicio, :fecha_fin). " +
 
                   " ================================================================ " +
                   " REGLAS DE CONSTRUCCIÓN DEL SQL " +
                   " ================================================================ " +
                   " - Usa INNER JOIN cuando el dato sea obligatorio para el reporte. " +
                   " - Usa LEFT JOIN solo cuando el dato sea opcional (por ejemplo embarque). " +
                   " - No agregar JOIN innecesarios. " +
                   " - Usar GROUP BY solo cuando el texto del usuario lo requiera. " +
                   " - No agregar columnas que el usuario no pidió, salvo las canónicas del sistema. " +
 
                   " ================================================================ " +
                   " FORMATO DE RESPUESTA " +
                   " ================================================================ " +
                   " - Devuelve SOLO el SQL Oracle completo. " +
                   " - Sin comentarios. " +
                   " - Sin markdown. " +
                   " - Sin explicaciones. " +
                   " - Listo para copiar, pegar y ejecutar. " +
 
                   " ================================================================ " +
                   " ESQUEMA DE TABLAS (JSON) " +
                   " ================================================================ " +
                   contexto;

    return prompt;
  }
}