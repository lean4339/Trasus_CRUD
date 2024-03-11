import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AgregarUserComponent } from './components/agregar-user/agregar-user.component';
const routes: Routes = [
  { path: 'users', component:UsuariosComponent},
  {path: 'users/add', component: AgregarUserComponent},
  { path: 'users/:id',component: DetalleUsuarioComponent },
  {path: '**', redirectTo: ' ', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
