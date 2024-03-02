import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviarEmailComponent } from './enviaremail.component';

const routes: Routes = [
  {
    path: '',
    component: EnviarEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnviarEmailRoutingModule { }
