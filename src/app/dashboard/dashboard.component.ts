import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SharedService } from '../shared.service';

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router:Router, private sharedService:SharedService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.tokenService.verificarToken();         // TODO: Verifica el logeo del Usuario y lo redirecciona
    //this.sharedService.enviarDatosSubMenu("Dashboard");
  }

  ngAfterViewInit(){
    
  }

}