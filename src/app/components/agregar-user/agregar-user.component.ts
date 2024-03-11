import { Component } from '@angular/core';

import { OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute , Router} from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user';
import { FormGroup, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'add-user',
  templateUrl: './agregar-user.component.html',
  standalone: true,
  styleUrls: ['./agregar-user.component.css'],
  imports: [ReactiveFormsModule, MatCardModule,MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule,NgIf]
})

export class AgregarUserComponent {
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
  onSubmit() {
    console.log(this.userForm.errors)
    if(this.userForm.valid){ 
      this._usersService.post(`http://localhost:8080/users`, this.userForm.value).subscribe((user: any) => {
        console.log("onSubmit",user)
        this._router.navigate(['users',user.data.id]);
        
      })
    }
  }
  getErrorMessage() {
    if (this.userForm.errors
    ){
      return 'You must enter a value';
    }else{return null}
  }
}
