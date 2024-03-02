import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { NotificacionesService } from '@app/services/NotificacionesService';
import { GeneralService } from '@app/services/general.service';
import { NegocioService } from '@app/services/NegocioService';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent {
  title: string = '';
  message: string = '';
  idNegocioUser: string | undefined;
  idUser: number | undefined;
  nombreNegocioUsuario: string | undefined;

  constructor(
    private notificacionesService: NotificacionesService,
    private generalService: GeneralService,
    private negocioService: NegocioService,
  ) {}

  ngOnInit(): void {
    this.idUser = this.generalService.usuario$?.id;
    this.idNegocioUser = this.generalService.usuario$?.negocioId;
    console.log('ID Usuario:', this.idUser);
    console.log('ID Negocio User:', this.idNegocioUser);

   // Obtener el negocio actual del usuario
   if (this.idNegocioUser) {
    const negocioId = parseInt(this.idNegocioUser);
    this.negocioService.getNegocioById(negocioId).subscribe((negocio) => {
      if (negocio) {
        this.nombreNegocioUsuario = negocio.nombre;

        // Asignar el nombre del negocio como título predeterminado
        this.title = this.nombreNegocioUsuario;
      }
    });
  }



  }

  enviarNotificacion() {
    const negocioId = this.generalService.usuario$?.negocioId;

    if (!negocioId) {
      console.error('Negocio ID no disponible.');
      return;
    }

    const cuerpoNotificacion = {
      title: this.title,
      message: this.message,
    };

    this.notificacionesService.enviarNotificacion(negocioId, cuerpoNotificacion).subscribe(
      (respuesta) => {
        // Mostrar la respuesta en un SweetAlert con temporizador automático
        Swal.fire({
          title: 'Éxito',
          text: respuesta,
          icon: 'success',
          timer: 2000, // Tiempo en milisegundos
          showConfirmButton: false, // No mostrar el botón "OK"
        });
      },
      (error) => {
        // Mostrar el mensaje de error en un SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'Error al enviar la notificación',
          icon: 'error',
        });
        console.error('Error al enviar la notificación:', error);
      }
    );
  }
}
