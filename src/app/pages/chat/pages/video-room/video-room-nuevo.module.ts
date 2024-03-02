// chat-nuevo.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoRoomRoutingModule } from './video-room-nuevo-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { VideoRoomComponent } from './video-room.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    VideoRoomRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ]
})
export class VideoNuevoModule { }
