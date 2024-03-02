import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmailService } from '@app/services/EmailService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enviaremail',
  templateUrl: './enviaremail.component.html',
  styleUrls: ['./enviaremail.component.scss']
})
export class EnviarEmailComponent {

  constructor(private emailService: EmailService,
    private router: Router // Inyecta el servicio Router
    ) {}

  enviarCorreo(form: NgForm): void {
    const correo = form.value.email;

    if (correo) {
      this.emailService.sendForgotPasswordEmail(correo).subscribe(
        response => {
          console.log('Correo enviado con éxito', response);

          // Muestra SweetAlert después de enviar el correo
          Swal.fire({
            title: 'Correo enviado',
            text: 'Se ha enviado un correo a su dirección. Por favor, verifique su bandeja de entrada y siga las instrucciones para restablecer su contraseña.',
            icon: 'success',
            confirmButtonText: '¡Entendido!'
          }).then(() => {
            // Redirige al usuario a auth/login después de hacer clic en "Entendido"
            this.router.navigate(['auth/login']);
          });
        },
        error => {
          console.error('Error al enviar el correo electrónico', error);
          // Puedes manejar el error según sea necesario
        }
      );
    }
  }


  eliminarCuenta(form: NgForm): void {
    const correo = form.value.email;

    if (correo) {
      this.emailService.deleteAccount(correo).subscribe(
        response => {
          console.log('Solicitud para eliminar cuenta enviada con éxito', response);

          // Muestra SweetAlert después de enviar la solicitud
          Swal.fire({
            title: 'Solicitud enviada',
            text: 'Se ha enviado una solicitud para eliminar su cuenta. Por favor, verifique su bandeja de entrada  y siga las instrucciones, recuerde esperar 7 días para la eliminación exitosa.',
            icon: 'success',
            confirmButtonText: '¡Entendido!'
          }).then(() => {
            // Puedes redirigir o realizar otras acciones después de hacer clic en "Entendido"
          });
        },
        error => {
          console.error('Error al enviar la solicitud para eliminar cuenta', error);
          // Puedes manejar el error según sea necesario
        }
      );
    }
  }
}
