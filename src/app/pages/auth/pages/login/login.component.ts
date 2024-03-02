import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromUser from '@app/store/user';
import { Store } from '@ngrx/store';

import { NegocioService } from '@app/services/NegocioService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading$!: Observable<boolean | null>;
  negocios: { id: number; nombre: string }[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    public NegocioService: NegocioService,
    private router: Router  // Agrega el Router al constructor
  ) {}

  ngOnInit(): void {

  }

  loginUsuario(form: NgForm): void {
    const userLoginRequest: fromUser.EmailPasswordCredentials = {
      email: form.value.email,
      password: form.value.password
    };

    this.store.dispatch(new fromUser.SignInEmail(userLoginRequest));

    this.NegocioService.cargarDatosDeNegocios().subscribe((negocios) => {
      this.negocios = negocios.map((negocio) => ({
        id: negocio.id,
        nombre: negocio.nombre
      }));

    });
  }


  olvideContrasena(): void {
    // Navegar a la página de recuperación de contraseña sin intentar autenticar
    this.router.navigate(['/auth/enviaremail']);
  }


}
