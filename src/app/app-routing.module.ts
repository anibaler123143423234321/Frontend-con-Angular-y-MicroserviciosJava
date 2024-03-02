import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { ChatComponent } from './pages/chat/pages/chat-list/chat.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "compra",
        loadChildren: () => import('./pages/compra/compra.module').then( m => m.CompraModule)
      },
      {
        path: "notificaciones",
        loadChildren: () => import('./pages/notificaciones/notificaciones.module').then( m => m.NotificacionesModule)
      },
      {
        path: "pago",
        loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentModule)
      },
      {
        path: "negocio",
        loadChildren: () => import('./pages/negocio/negocio.module').then( m => m.NegocioModule)
      },
      {
        path: "categoria",
        loadChildren: () => import('./pages/categoria/categoria.module').then( m => m.CategoriaModule)
      },
      {
        path: "producto",
        loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoModule)
      },
      {
        path: "user",
        loadChildren: () => import('./store/user/user.module').then( m => m.UserModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
      },
      {
        path: 'static',
        loadChildren: () => import('./pages/static/static.module').then(m=>m.StaticModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'static/welcome'
      },
      /*{
        path: 'chat/:userId',
        component: ChatComponent
      },*/
      {
        path: "chat",
        loadChildren: () => import('./pages/chat/pages/chat.module').then( m => m.ChatModule)
      },


    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'static/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
