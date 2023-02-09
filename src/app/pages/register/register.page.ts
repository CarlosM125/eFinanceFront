import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    
  }

  onSignUp(ngForm: NgForm) {
    if (ngForm.invalid) {
      return;
    }
    this.userService.createUser(ngForm.value.email, ngForm.value.name, ngForm.value.lastname, ngForm.value.password);
  }
 /* navigateLoginPage(){
    this.router.navigate(['/login']);
  }*/
}
