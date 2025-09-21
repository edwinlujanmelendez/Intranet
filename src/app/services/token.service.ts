import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  verificarToken(){
    let getdat = JSON.parse(localStorage.getItem('StorageLoginToken') || '{}');
    if(JSON.stringify(getdat)=="{}"){location.href ='/login';}
  }
}