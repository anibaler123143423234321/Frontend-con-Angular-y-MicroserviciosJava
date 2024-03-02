import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule } from './notificaciones-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NotificacionesComponent } from './pages/notificaciones.component';

//import { reducers, effects } from './store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificacionesRoutingModule,

   // StoreModule.forFeature('producto', reducers),
   // EffectsModule.forFeature(effects),
  ]
})
export class NotificacionesModule { }
