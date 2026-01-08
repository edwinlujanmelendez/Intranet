import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-asistente-sql-inteligente',
  templateUrl: './asistente-sql-inteligente.component.html',
  styleUrls: ['./asistente-sql-inteligente.component.css']
})
export class AsistenteSqlInteligenteComponent implements OnInit {

  displayedTextAI = '';
  isTypingAI = false;
  intervalAI: any;

  copied = false;

  id_rol_usuario: number = 0;
  usuario_login: String = "";

  constructor(private tokenService: TokenService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
  }

  ngAfterViewInit(){
    let StorageRol = JSON.parse(localStorage.getItem('StorageRol') || '{}');
    this.id_rol_usuario = Number(StorageRol['rol_id']);

    let StorageUsuario = JSON.parse(localStorage.getItem('StorageUsuario') || '{}');
    this.usuario_login = StorageUsuario['login'];

    $(".loader").fadeOut("slow");
  }

  generarQuery() {
    //if(this.id_rol_usuario == 1 && (this.usuario_login == "elujan" || this.usuario_login == "ereynoso" || this.usuario_login == "vvega")){
    //if(this.id_rol_usuario == 1){
      const textoBuscar = String($("#inputBuscar").val()).trim();

      if (textoBuscar !== "") {
        $(".loader").fadeIn("slow");

        this.displayedTextAI = "";
        console.log("Ejecutando Asistente SQL Inteligente");
        this.taskService.AsistenteSqlInteligente(textoBuscar).then((observable: any) => {
          observable.subscribe({
            next: (responseResumenOpenIA) => {
              const content = responseResumenOpenIA['choices'][0]['message']['content'] || '';
              //this.startTypingEffectAI(content);
              //$(".loader").fadeOut("slow");

              console.log("Ejecutando Verificador SQL Validado");
              this.taskService.VerificarSQLValidado(content).subscribe({
              next: (responseSqlValidado: any) => {
                const content = responseSqlValidado['choices'][0]['message']['content'] || '';
                this.startTypingEffectAI(content);
                $(".loader").fadeOut("slow");
              },
              error: (err) => {
                console.error("Error:", err);
                $(".loader").fadeOut("slow");
              },
              complete: () => {
                $(".loader").fadeOut("slow");
              }
            });
            },
            error: (err) => { console.error("Error:", err); $(".loader").fadeOut("slow"); }
          });
        });
      }
    //}
  }

  startTypingEffectAI(fullTextAI: string) {
    this.isTypingAI = true;
    this.displayedTextAI = '';

    const chars = [...fullTextAI];
    let i = 0;

    this.intervalAI = setInterval(() => {
      this.displayedTextAI += chars[i];
      i++;

      if (i === chars.length) {
        clearInterval(this.intervalAI);
        this.isTypingAI = false;
        $('#div_buscando_resumen_ai').css('display', 'none');
      }
    }, 15);
  }

  highlightSQL(text: string): string {
    if (!text) return '';

    // Escapar caracteres HTML
    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Resalta palabras clave SQL
    const keywords = /\b(SELECT|FROM|JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|ON|WHERE|AND|OR|BETWEEN|ORDER\s+BY|GROUP\s+BY|INSERT\s+INTO|VALUES|UPDATE|SET|DELETE)\b/gi;
    text = text.replace(keywords, `<span class="sql-keyword">$1</span>`);

    // Resalta cadenas entre comillas simples
    text = text.replace(/'([^']*)'/g, `<span class="sql-string">'$1'</span>`);

    return text;
  }

  copiarSQL(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    });
  }
}