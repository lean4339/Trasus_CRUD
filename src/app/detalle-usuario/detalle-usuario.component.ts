import { Component,OnInit, inject } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user';
import { FormGroup, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule,MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule]
})
export class DetalleUsuarioComponent implements OnInit {
  id: string = '';
  user?: IUser;
  userEmail: string = '';
  constructor (private _ActiveRoute: ActivatedRoute, private _router: Router) {
  }
  private _usersService = inject(UserService);
  userForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    rol: new FormControl('', Validators.required),

  });
  ngOnInit() {
    this._ActiveRoute.params.subscribe(params => {
      this.id = params['id']
    })

   

    // Obtener los datos del usuario
    this._usersService.get(`http://localhost:8080/users/${this.id}`).subscribe((user: any) => {
     this.user = user;
      this.userForm.setValue({nombre:user.data.nombre, email:user.data.email, rol:user.data.rol});
    });
  }
  onSubmit() {
    console.log("onSubmit",this.userForm.value)
    if(this.userForm.valid){ 
      this._usersService.put(`http://localhost:8080/users/${this.id}`, this.userForm.value).subscribe((user: any) => {
        this._router.navigate(['users']);
      })
    }
  }
}
