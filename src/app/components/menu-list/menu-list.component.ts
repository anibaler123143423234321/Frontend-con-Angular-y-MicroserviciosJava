import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { User } from '@app/models/backend/user/index';
import { CarritoService } from '@app/services/CarritoService';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();

  @Input() isAuthorized !: boolean | null;
  @Input() user: User | null = null;
  @Output() signOut = new EventEmitter<void>();
// Agrega estas variables para controlar los desplegables
listarMenuOpen: boolean = true; // Establece a `true` para que esté desplegado por defecto
agregarMenuOpen: boolean = true; // Establece a `true` para que esté desplegado por defecto

constructor(private carritoService: CarritoService, private appComponent: AppComponent) {}

  ngOnInit(): void {
  }

  closeMenu() : void {
    this.menuToggle.emit();
    this.carritoService.clearCart();
  }

  onSignOut(): void {
    this.signOut.emit();
    // Usa la referencia a AppComponent para manejar el cierre de sesión
    this.appComponent.handleSignOut();
  }


  isAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.user?.role === 'ADMIN';
  }

  isSuperAdmin(): boolean {
    // Verificar si user no es nulo y tiene la propiedad role
    return this.user?.role === 'SUPERADMIN';
  }


  // Métodos para controlar la apertura y cierre de los desplegables
  toggleListarMenu(): void {
    this.listarMenuOpen = !this.listarMenuOpen;
  }

  toggleAgregarMenu(): void {
    this.agregarMenuOpen = !this.agregarMenuOpen;
  }

}
