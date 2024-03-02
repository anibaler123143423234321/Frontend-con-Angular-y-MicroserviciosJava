import { Component, OnInit } from '@angular/core';
import { ChangePasswordDTO } from '@app/models/backend/changepassworddto';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailService } from '@app/services/EmailService';
import Swal, { SweetAlertOptions, SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-cambiarcontraseña',
  templateUrl: './cambiarcontraseña.component.html',
  styleUrls: ['./cambiarcontraseña.component.scss']
})
export class CambiarContraseñaComponent implements OnInit {

  password!: string;
  confirmPassword!: string;
  tokenPassword!: string;
  dto!: ChangePasswordDTO;

  constructor(
    private emailPasswordService: EmailService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Acceder a 'tokenPassword' con corchetes
    this.tokenPassword = this.activatedRoute.snapshot.params['tokenPassword'];
  }

  onChangePassword(): void {
    if (this.password !== this.confirmPassword) {
      this.showAlert('error', 'Las contraseñas no coinciden', 'Por favor, verifica las contraseñas.');
      return;
    }

    this.dto = new ChangePasswordDTO(this.password, this.confirmPassword, this.tokenPassword);

    this.emailPasswordService.changePassword(this.dto).subscribe(
      data => {
        this.showAlert('success', 'Contraseña cambiada con éxito', data.mensaje);
        this.router.navigate(['auth/login']);
      },
      err => {
        this.showAlert('error', 'Error al cambiar la contraseña', err.error.mensaje);
      }
    );
  }

  private showAlert(icon: SweetAlertIcon, title: string, text: string): void {
    const options: SweetAlertOptions = {
      icon: icon,
      title: title,
      text: text,
      timer: 3000,
      position: 'top-end',
    };

    Swal.fire(options);
  }
}
