import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.css']
})
export class VersionesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    $(".loader").fadeOut("slow");
  }
}