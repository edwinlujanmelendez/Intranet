/*import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { Ng2TelInputModule } from 'ng2-tel-input';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SimularPagosComponent } from './ecommerce/simular-pagos/simular-pagos.component';

import { ConsultaBoletosComponent } from './operaciones/consulta-boletos/consulta-boletos.component';
import { ItinerarioComponent } from './operaciones/ventas-reserva/itinerario/itinerario.component';
import { AsientosComponent } from './operaciones/ventas-reserva/asientos/asientos.component';
import { DatosPasajerosComponent } from './operaciones/ventas-reserva/datos-pasajeros/datos-pasajeros.component';
import { ConfirmacionPasajesComponent } from './operaciones/ventas-reserva/confirmacion-pasajes/confirmacion-pasajes.component';
import { ItinerarioRetornoComponent } from './operaciones/ventas-reserva/itinerario-retorno/itinerario-retorno.component';
import { AsientosRetornoComponent } from './operaciones/ventas-reserva/asientos-retorno/asientos-retorno.component';
import { ReporteVentasPasajesComponent } from './operaciones/reporte-ventas-pasajes/reporte-ventas-pasajes.component';
import { PromocionesComponent } from './operaciones/promociones/promociones.component';

import { AuditoriaBoletosComponent } from './modulo-ti/auditoria-boletos/auditoria-boletos.component';
import { VersionesComponent } from './modulo-ti/versiones/versiones.component';
import { ReporteFrotcomComponent } from './reportes/operaciones/reporte-frotcom/reporte-frotcom.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { InitLayoutComponent } from './layouts/init-layout/init-layout.component';

const routes: Routes = [
  {
    path: '',
    component: InitLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'modulo-ti',
        children: [
          { path: 'auditoria-boletos', component: AuditoriaBoletosComponent },
          { path: 'versiones', component: VersionesComponent }
        ]
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'simular-pagos', component: SimularPagosComponent },
      {
        path: 'operaciones',
        children: [
          { path: 'reporte-ventas-pasajes', component: ReporteVentasPasajesComponent },
          { path: 'consulta-boletos', component: ConsultaBoletosComponent },
          { path: 'promociones', component: PromocionesComponent },
          {
            path: 'ventas-reserva',
            children: [
              { path: 'itinerario', component: ItinerarioComponent },
              { path: 'asientos', component: AsientosComponent },
              { path: 'itinerario-retorno', component: ItinerarioRetornoComponent },
              { path: 'asientos-retorno', component: AsientosRetornoComponent },
              { path: 'datos-pasajeros', component: DatosPasajerosComponent },
              { path: 'confirmacion-pasajes', component: ConfirmacionPasajesComponent }
            ]
          }
        ]
      },
      {
        path: 'reportes',
        children: [
          {
            path: 'operaciones',
            children: [
              { path: 'reporte-frotcom', component: ReporteFrotcomComponent }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ConsultaBoletosComponent,
    SimularPagosComponent,
    ItinerarioComponent,
    AsientosComponent,
    DatosPasajerosComponent,
    ConfirmacionPasajesComponent,
    ItinerarioRetornoComponent,
    AsientosRetornoComponent,
    ReporteVentasPasajesComponent,
    PromocionesComponent,
    AuditoriaBoletosComponent,
    VersionesComponent,
    ReporteFrotcomComponent,
    MainLayoutComponent,
    InitLayoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    Ng2TelInputModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { InitLayoutComponent } from './layouts/init-layout/init-layout.component';

const routes: Routes = [
  {
    path: '',
    component: InitLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'modulo-ti', loadChildren: () => import('./modulo-ti/modulo-ti.module').then(m => m.ModuloTiModule) }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'simular-pagos', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
      { path: 'operaciones', loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule) },
      { path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule) }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    InitLayoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }