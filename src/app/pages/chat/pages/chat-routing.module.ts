// chat-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':userId',
    loadChildren: () => import('./chat-list/chat-nuevo.module').then(m => m.ChatNuevoModule),
  },
  {
    path: 'room/:id',
    loadChildren: () => import('./video-room/video-room-nuevo.module').then(m => m.VideoNuevoModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
