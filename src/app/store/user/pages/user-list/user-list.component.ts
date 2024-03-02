// Importa las dependencias necesarias
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UserResponse } from '../../user.models';
import * as fromActions from '@app/store/user/user.actions';
import * as fromSelectors from '@app/store/user/user.selectors';
import { CompraResponse } from '@app/pages/compra/store/save';
import * as fromRoot from '@app/store';
import { CompraService } from '@app/services/CompraService';
import { GeneralService } from '@app/services/general.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '@app/modal/modal.component';
import { NotificacionesService } from '@app/services/NotificacionesService';
import { Dispositivo } from '@app/models/backend/dispositivo';
import { User } from '@app/models/backend/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users$: Observable<UserResponse[] | null>;
  loading$: Observable<boolean | null>;
  searchTerm: string = '';
  filteredUsers: UserResponse[] = [];

  compras$!: Observable<CompraResponse[] | null>;
  userComprasMap: { [userId: number]: CompraResponse[] } = {};
  estadoEditadoExitoso: boolean = false;
  mensajeExito = '';

  idNegocioUser: string | undefined;

  displayedColumns: string[] = [
    'negocioId',
    'nombre',
    'apellido',
    'telefono',
    'email',
    'role',
    'compras',
  ];
  private loggedIn = true;
  private intervalSubscription: any;
  private compraSubscription: Subscription | undefined;

  dispositivos: Dispositivo[] = [];
// En tu componente
mensajeNotificacion: string = '';
mensajeNotificaciones: { [userId: number]: string } = {};
  constructor(
    private store: Store<fromRoot.State>,
    private dialog: MatDialog,
    public CompraService: CompraService,
    public GeneralService: GeneralService,
    private notificacionesService: NotificacionesService
  ) {
    this.users$ = this.store.select(fromSelectors.getUsers);
    this.loading$ = this.store.select(fromSelectors.getLoading);
  }

  ngOnInit() {
    this.loadDevices();

    this.store.dispatch(new fromActions.ListUsers());
    this.idNegocioUser = this.GeneralService.usuario$?.negocioId;

    this.CompraService.cargarDatosDeCompras().subscribe((compras) => {
      console.log('Datos de compras cargados:', compras);

      this.compras$ = of(compras);

      this.users$.subscribe((users) => {
        if (users) {
          this.filteredUsers = users.filter((user) => user.negocioId === this.idNegocioUser);
          this.userComprasMap = this.filterComprasByUser(this.filteredUsers);
          this.updateFilteredUsers(); // Agrega esta línea para aplicar el filtrado inicial
        }
      });
    });

    this.intervalSubscription = interval(10000)
      .pipe(switchMap(() => this.CompraService.cargarDatosDeCompras()))
      .subscribe((compras) => {
        if (this.loggedIn) {
          console.log('Datos de compras actualizados automáticamente:', compras);
          this.compras$ = of(compras);
          this.userComprasMap = this.filterComprasByUser(this.filteredUsers);
        } else {
          this.intervalSubscription.unsubscribe();
        }
      });
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.loggedIn = false;

    if (this.compraSubscription) {
      this.compraSubscription.unsubscribe();
    }
  }

  filterUsers(users: UserResponse[], term: string): UserResponse[] {
    term = term.toLowerCase();
    return users.filter((user) => {
      if (user.role) {
        return (
          user.nombre.toLowerCase().includes(term) ||
          user.apellido.toLowerCase().includes(term) ||
          user.telefono.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
        );
      }
      return false;
    });
  }

  shouldRemoveUser(user: UserResponse): boolean {
    if (!this.userComprasMap[user.id]) {
      return true;
    } else {
      return this.userComprasMap[user.id].every(
        (compra) => compra.estadoCompra === 'Completado'
      );
    }
  }

  updateFilteredUsers() {
    if (this.users$) {
      this.users$.subscribe((users) => {
        if (users) {
          // Filtrar usuarios según el término de búsqueda
          this.filteredUsers = this.filterUsers(users, this.searchTerm);

          // Filtrar usuarios que tienen compras
          this.filteredUsers = this.filteredUsers.filter((user) => {
            return (
              this.userComprasMap[user.id] &&
              this.userComprasMap[user.id].length > 0 &&
              this.filterComprasByUserId(this.userComprasMap[user.id], user.id).length > 0
            );
          });
        }
      });
    }
  }

  shouldIncludeUser(user: UserResponse): boolean {
    return !!this.userComprasMap[user.id] && this.userComprasMap[user.id].length > 0;
  }


  filterComprasByUser(users: UserResponse[]): {
    [userId: number]: CompraResponse[];
  } {
    const filteredMap: { [userId: number]: CompraResponse[] } = {};

    this.compras$.subscribe((comprasData) => {
      if (comprasData) {
        users.forEach((user) => {
          if (user.id) {
            const compras = this.filterComprasByUserId(comprasData, user.id);
            if (compras.length > 0) {
              filteredMap[user.id] = compras;

              const todasCompletadas = compras.every(
                (compra) => compra.estadoCompra === 'Completado'
              );

              if (!todasCompletadas) {
                filteredMap[user.id] = compras;
              }
            }
          }
        });
      }
    });

    return filteredMap;
  }

  filterComprasByUserId(
    comprasData: CompraResponse[],
    userId: number
  ): CompraResponse[] {
    return comprasData.filter((compra) => {
      return (
        compra.userId === userId &&
        (compra.estadoCompra === 'Pendiente Por Revisar' ||
          compra.estadoCompra === 'Despachado')
      );
    });
  }

  openModal(compras: CompraResponse[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { compras };

    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  loadDevices() {
    this.notificacionesService.getAllDevices().subscribe(
      (dispositivos) => {
        this.dispositivos = dispositivos;
        console.log('Lista de dispositivos:', this.dispositivos);
      },
      (error) => {
        console.error('Error al cargar la lista de dispositivos:', error);
      }
    );
  }

  enviarNotificacion(user: User, title: string, message: string) {
    const notificationBody = {
      title: title,
      message: message,
    };

    // Verifica que el usuario tenga un id asociado al dispositivo
    if (user.dispositivoId) {
      const dispositivoIdUsuario = user.dispositivoId;

      const dispositivoUsuario = this.dispositivos.find(
        (dispositivo) => dispositivo.deviceId === dispositivoIdUsuario
      );

      if (dispositivoUsuario) {
        // Verifica si el usuario tiene un id asociado al dispositivo
        if (dispositivoUsuario.id) {
          // Envía al endpoint el id asociado al deviceId del dispositivo
          this.notificacionesService.sendNotification(dispositivoUsuario.id.toString(), notificationBody)
            .subscribe(
              (response: any) => {
                // Verifica si la respuesta es una cadena de éxito
                if (response && response.includes('Notificación enviada correctamente.')) {
                  console.log('Notificación enviada con éxito:', response);
                  // Limpiar el cuadro de texto
                  this.mensajeNotificacion = '';
                  // Mostrar SweetAlert2
                  Swal.fire({
                    icon: 'success',
                    title: 'Notificación enviada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                  });
                } else {
                  console.error('Error al enviar la notificación:', response);
                  // Mostrar SweetAlert2 con error
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar la notificación',
                    text: response,
                  });
                }
              },
              (error) => {
                console.error('Error al enviar la notificación:', error);
                // Mostrar SweetAlert2 con error
                Swal.fire({
                  icon: 'error',
                  title: 'Error al enviar la notificación',
                  text: error.message || 'Error inesperado',
                });
              }
            );
        } else {
          console.error('No se encontró el id del dispositivo del usuario. Usuario:', user);
        }
      } else {
        console.error('No se encontró el dispositivo del usuario. Usuario:', user);
        console.log('Lista de dispositivos:', this.dispositivos);
      }
    } else {
      console.error('El usuario no tiene un dispositivoId.');
    }
  }

}
