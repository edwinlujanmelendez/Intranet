import { Injectable } from '@angular/core';
import ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';

declare var $:any;

@Injectable({
    providedIn: 'root'
})
export class FuncionesService {

    /***************************************** REGLAS DE LAS VENTAS *****************************************/
    
    /***************************************** REGLAS DE LAS VENTAS *****************************************/

    exportarReporteExcel(header: any, body: any, nombreArchivoExcel: string){
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Hoja1');

        // Cabecera
        worksheet.addRow(header);

        // 🔹 Estilos cabecera
        worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '95B3D7' }
        };
        cell.font = { bold: false, color: { argb: '000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        });

        // Cuerpo
        for (let i = 0; i < body.length; i++) {
            worksheet.addRow(body[i]);
        }

        // 🔹 Bordes en toda la tabla
        worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };

            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        });

        // Recorremos todas las columnas de la hoja
        worksheet.columns.forEach((column) => {
        let maxLength = 0;

        column.eachCell({ includeEmpty: true }, (cell) => {
            // Valor de la celda convertido a string
            const cellValue = cell.value ? cell.value.toString() : '';
            // Verificamos si es el más largo
            maxLength = Math.max(maxLength, cellValue.length);
        });

        // Ajustamos el ancho de la columna (+2 para espacio extra visual)
        column.width = maxLength + 4;
        });

        // Exportar
        workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, nombreArchivoExcel+'.xlsx');
        });
    }

    validarEmail(email: any){
        var emailRegex;
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        
        return emailRegex.test(email);
    }

    validarRUC(ruc: any){
        ruc = String(ruc);
        ruc = ruc.trim().toUpperCase();
        let suma: number = 0;
        let digito: number = 0;
        let resto: number = 0;

        if(ruc.length == 11){
            suma = 0;
            let x: number = 6;

            for(var i=0; i<ruc.length - 1; i++){
                if(i==4){
                x=8;
                }
                digito = ruc.charAt(i);
                x--;
                if(i==0){
                suma += digito*x;
                }else{
                suma += digito*x;
                }
            }
            resto = suma % 11;
            resto = 11 - resto;
            if(resto >=10){
                resto = resto -10;
            }

            if(resto == ruc.charAt(ruc.length-1)){
                return true;
            }
        }

        return false;
    }

    convert_audfecins(fecha_y_hora: string){
        if(fecha_y_hora != "" && fecha_y_hora != null){
            var part_fecha_hora = fecha_y_hora.split(" ");

            var part_fecha = part_fecha_hora[0].split("-");
            var new_fecha_hora = part_fecha_hora[1] + " " + part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
            //                          HORA                      DIA            -  MES            -  AÑO
            return new_fecha_hora;
        }else{
            return "";
        }
    }

    convert_format_fecha_barra(fecha: string){
        if(fecha != "" && fecha != null){
            fecha = fecha.replace(" 00:00:00", "");
            var part_fecha = fecha.split("-");
            var new_fecha = part_fecha[2]+"/"+part_fecha[1]+"/"+part_fecha[0];
            //              DIA            -  MES            -  AÑO
            return new_fecha;
        }else{
            return "";
        }
    }

    capitalizarTexto(texto) {
        if (!texto || texto.trim() === "") {
            return texto;
        }

        const palabras = texto.toLowerCase().split(" ");
        let resultado = "";

        for (const palabra of palabras) {
            if (palabra) {
            resultado += palabra.charAt(0).toUpperCase() + palabra.slice(1) + " ";
            }
        }

        return resultado.trim();
    }

    invertir_fecha_guion(fecha: string){
        // formato en que viene: 2025-09-05
        if(fecha != "" && fecha != null){
            fecha = fecha.replace(" 00:00:00", "");
            var part_fecha = fecha.split("-");
            var new_fecha = part_fecha[2]+"-"+part_fecha[1]+"-"+part_fecha[0];
            //              DIA            -  MES            -  AÑO
            return new_fecha;
        }else{
            return "";
        }
    }

    convert_format_fecha_guion(fecha: string){
        if(fecha != "" && fecha != null){
            fecha = fecha.replace(" 00:00:00", "");
            var part_fecha = fecha.split("/");
            var new_fecha = part_fecha[2]+"-"+part_fecha[1]+"-"+part_fecha[0];
            //              AÑO            -  MES            -  DIA
            return new_fecha;
        }else{
            return "";
        }
    }

    getFechaHoyGuion(){
        var date = new Date();
        var dia = "";
        if(Number(date.getDate()) < 10){
        dia = "0"+ date.getDate();
        }else{
        dia = String(date.getDate());
        }
        var mes = "";
        if(Number(date.getMonth() + 1) < 10){
        mes = "0"+ Number(date.getMonth() + 1);
        }else{
        mes = String(date.getMonth() + 1);
        }
        var anio = date.getFullYear();

        var date_actual = anio + "-" + mes + "-" + dia;

        return date_actual;
    }

    format_fecha(fecha_ingresada: string){
        if(fecha_ingresada != null){
            fecha_ingresada = fecha_ingresada.replace(" 00:00:00", "");
            var partFechaHora = fecha_ingresada.split(" ");
            var partFecha = partFechaHora[0].split("-");

            return partFecha[2]+"-"+partFecha[1]+"-"+partFecha[0];
        }else{
            return "";
        }
    }

    format_ruta(ruta_ingresada: string, posicion: number){
        var partRuta = ruta_ingresada.split("-");

        return partRuta[posicion];
    }

    convert_nom_fecha(fecha: string){
        if(fecha != ""){
            let dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            let date = new Date(fecha.replace(/-+/g, '/'));

            var fechaNum = date.getDate();
            var mes_name = date.getMonth();
            
            return dias[date.getDay()] + " " + fechaNum + " de " + meses[mes_name];
        }else{
            return "";
        }
    }
  
    ordenarEstructuraBus(estructuraBus: any){
        var cant_piso_1 = 0;
        var cant_piso_2 = 0;
        var array_piso1: string[] = [];
        var array_sub_piso1: string[] = [];
        
        var array_piso2: string[] = [];
        var array_sub_piso2: string[] = [];

        if(estructuraBus['listaAsiento'] != null){
            for(var a=0; a<estructuraBus['listaAsiento'].length; a++){
            if(estructuraBus['listaAsiento'][a]['piso'] == 0){
                array_piso1.push(estructuraBus['listaAsiento'][a]);
                cant_piso_1++;
            }
            if(estructuraBus['listaAsiento'][a]['piso'] == 1){
                array_piso2.push(estructuraBus['listaAsiento'][a]);
                cant_piso_2++;
            }
            }
        }

        var num_filas_piso1 = 0;
        if(array_piso1.length != 0){                //Elije el máximo
            num_filas_piso1 = Math.max.apply(Math, array_piso1.map(function(o) { return o['fila']; }));
        }

        var num_filas_piso2 = 0;
        if(array_piso2.length != 0){                //Elije el máximo
            num_filas_piso2 = Math.max.apply(Math, array_piso2.map(function(o) { return o['fila']; }));
        }
        
        var array_pisos_1: any[] = [];
        var sub_array_pisos_1: any[] = [];
        var array_pisos_1_final: any[] = [];
        var array_pisos_2: any[] = [];
        var sub_array_pisos_2: any[] = [];
        var array_pisos_2_final: any[] = [];

        if(num_filas_piso1 != 0){
            for(var a=0; a<=num_filas_piso1; a++){
            array_sub_piso1 = [];
            for(var b=0; b<array_piso1.length; b++){
                if(array_piso1[b]['fila'] == a){
                array_sub_piso1.push(array_piso1[b]);
                }
            }
            array_pisos_1.push(array_sub_piso1);
            }
        }

        if(num_filas_piso2 != 0){
            for(var a=0; a<=num_filas_piso2; a++){
            array_sub_piso2 = [];
            for(var b=0; b<array_piso2.length; b++){
                if(array_piso2[b]['fila'] == a){
                array_sub_piso2.push(array_piso2[b]);
                }
            }
            array_pisos_2.push(array_sub_piso2);
            }
        }
        
        for(var a=0; a<array_pisos_1.length; a++){
            var array_asientos = [0, 1, 2, 3, 4];
            sub_array_pisos_1 = [];
            var sub_mensaje = "";

            if(array_pisos_1[a][0] && array_pisos_1[a][1] && array_pisos_1[a][2] && array_pisos_1[a][3] && array_pisos_1[a][4]){
            if((array_pisos_1[a][0].tipoObjeto == 5 && array_pisos_1[a][0].tipoTarifa == 0) && (array_pisos_1[a][1].tipoObjeto == 5 && array_pisos_1[a][1].tipoTarifa == 0) && (array_pisos_1[a][2].tipoObjeto == 5 && array_pisos_1[a][2].tipoTarifa == 0) && (array_pisos_1[a][3].tipoObjeto == 5 && array_pisos_1[a][3].tipoTarifa == 0) && (array_pisos_1[a][4].tipoObjeto == 5 && array_pisos_1[a][4].tipoTarifa == 0)){
                sub_mensaje = "mensaje";
            }
            }

            if(array_pisos_1[a][0]){
            sub_array_pisos_1.push(array_pisos_1[a][0]);
            var i = array_asientos.indexOf(array_pisos_1[a][0].columna);
            array_asientos.splice(i, 1);
            }

            if(array_pisos_1[a][1]){
            sub_array_pisos_1.push(array_pisos_1[a][1]);
            var i = array_asientos.indexOf(array_pisos_1[a][1].columna);
            array_asientos.splice(i, 1);
            }

            if(array_pisos_1[a][2]){
                sub_array_pisos_1.push(array_pisos_1[a][2]);
                var i = array_asientos.indexOf(array_pisos_1[a][2].columna);
                array_asientos.splice(i, 1);
            }

            if(array_pisos_1[a][3]){
                sub_array_pisos_1.push(array_pisos_1[a][3]);
                var i = array_asientos.indexOf(array_pisos_1[a][3].columna);
                array_asientos.splice(i, 1);
            }

            if(array_pisos_1[a][4]){
                sub_array_pisos_1.push(array_pisos_1[a][4]);
                var i = array_asientos.indexOf(array_pisos_1[a][4].columna);
                array_asientos.splice(i, 1);
            }

            for(var aa=0; aa<array_asientos.length; aa++){
            sub_array_pisos_1.push({"asiento": 0,
                "bloqueado": 1,
                "columna": array_asientos[aa],
                "estadoAsiento": 0,
                "fila": a,
                "piso": 0,
                "tarifaAsiento": 0,
                "tipoObjeto": 5
            });
            }

            sub_array_pisos_1.sort((a, b) => a.columna - b.columna); 

            array_pisos_1_final.push(sub_array_pisos_1);

            if(sub_mensaje == "mensaje"){
            sub_array_pisos_1 = [];
            var array_asientos2 = [0, 1, 2, 3, 4];

            for(var bb=0; bb<array_asientos2.length; bb++){
                sub_array_pisos_1.push({"asiento": 0,
                "bloqueado": 1,
                "columna": array_asientos2[bb],
                "estadoAsiento": 0,
                "fila": a,
                "piso": 0,
                "tarifaAsiento": 0,
                "tipoObjeto": 99
                });
            }

            sub_array_pisos_1.sort((a, b) => a.columna - b.columna); 

            array_pisos_1_final.push(sub_array_pisos_1);
            }
        }

        for(var a=0; a<array_pisos_2.length; a++){
            var array_asientos = [0, 1, 2, 3, 4];
            sub_array_pisos_2 = [];

            if(array_pisos_2[a][0]){
            sub_array_pisos_2.push(array_pisos_2[a][0]);
            var i = array_asientos.indexOf(array_pisos_2[a][0].columna);
            array_asientos.splice(i, 1);
            }

            if(array_pisos_2[a][1]){
            sub_array_pisos_2.push(array_pisos_2[a][1]);
            var i = array_asientos.indexOf(array_pisos_2[a][1].columna);
            array_asientos.splice(i, 1);
            }

            if(array_pisos_2[a][2]){
            sub_array_pisos_2.push(array_pisos_2[a][2]);
                var i = array_asientos.indexOf(array_pisos_2[a][2].columna);
                array_asientos.splice(i, 1);
            }

            if(array_pisos_2[a][3]){
            sub_array_pisos_2.push(array_pisos_2[a][3]);
                var i = array_asientos.indexOf(array_pisos_2[a][3].columna);
                array_asientos.splice(i, 1);
            }

            if(array_pisos_2[a][4]){
            sub_array_pisos_2.push(array_pisos_2[a][4]);
                var i = array_asientos.indexOf(array_pisos_2[a][4].columna);
                array_asientos.splice(i, 1);
            }

            for(var aa=0; aa<array_asientos.length; aa++){
            sub_array_pisos_2.push({"asiento": 0,
                "bloqueado": 1,
                "columna": array_asientos[aa],
                "estadoAsiento": 0,
                "fila": a,
                "piso": 0,
                "tarifaAsiento": 0,
                "tipoObjeto": 5
            });
            }

            sub_array_pisos_2.sort((a, b) => a.columna - b.columna); 

            array_pisos_2_final.push(sub_array_pisos_2);
        }

        var array_pisos_final: any = [];

        if(array_pisos_1_final.length != 0){
            array_pisos_final.push(array_pisos_1_final);
        }

        if(array_pisos_2_final.length != 0){
            array_pisos_final.push(array_pisos_2_final);
        }

        return array_pisos_final;
    }

    mostrar_modal(name_modal: string){
        $('#'+name_modal).modal('show');
      }
    
      ocultar_modal(name_modal: string){
        $('#'+name_modal).modal('hide');
      }

    notificacion_mensaje(tipo: String, message: String){
        if(tipo == "Success"){
          $.toast({
            heading: '<b>Éxito</b>',
            text: "<b>"+message+"</b>",
            icon: 'success',
            loader: true,
            loaderBg: '#9EC600',
            showHideTransition: 'fade',        //fade,slide,plain
            hideAfter: 7500,
            allowToastClose: false,            //true,false
            position: 'bottom-left' 
          });
        }else if(tipo == "Information"){
          $.toast({
            heading: '<b>Información</b>',
            text: "<b>"+message+"</b>",
            icon: 'info',
            loader: true,
            loaderBg: '#9EC600',
            showHideTransition: 'fade',        //fade,slide,plain
            hideAfter: 7500,
            allowToastClose: false,            //true,false
            position: 'bottom-left' 
          });
        }else if(tipo == "Warning"){
          $.toast({
            heading: '<b>Advertencia</b>',
            text: "<b>"+message+"</b>",
            icon: 'warning',
            bgColor: '#d1952d',
            loader: true,
            loaderBg: '#9EC600',
            showHideTransition: 'fade',        //fade,slide,plain
            hideAfter: 7500,
            allowToastClose: false,            //true,false
            position: 'bottom-left' 
          });
        }else if(tipo == "Error"){
          $.toast({
            heading: '<b>Error</b>',
            text: "<b>"+message+"</b>",
            icon: 'error',
            loader: true,
            loaderBg: '#9EC600',
            showHideTransition: 'fade',        //fade,slide,plain
            hideAfter: 7500,
            allowToastClose: false,            //true,false
            position: 'bottom-left' 
          });
        }
      }
}