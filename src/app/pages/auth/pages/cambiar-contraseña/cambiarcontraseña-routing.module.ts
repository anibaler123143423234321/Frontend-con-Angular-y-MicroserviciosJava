import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContraseñaComponent } from './cambiarcontraseña.component';

const routes: Routes = [
  {
    path: '',
    component: CambiarContraseñaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambiarContraseñaRoutingModule { }
