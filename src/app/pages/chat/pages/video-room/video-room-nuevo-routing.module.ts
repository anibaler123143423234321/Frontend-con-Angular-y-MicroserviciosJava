import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoRoomComponent } from './video-room.component';

const routes: Routes = [
  {
    path: '', // Asegúrate de tener :productoId como parámetro
    component: VideoRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoomRoutingModule {}
