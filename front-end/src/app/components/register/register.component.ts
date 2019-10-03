import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { from } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  namePattern = "^[a-zA-z0-9_-]{8,15}$";
  passowrdPattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/;
  emailVlaid ;
  emailMessage;
  usernameValid;
  usernameMessage;
  datass;
  datassError;
  err;
  success;
  datas


  constructor(private router : Router , private authService : AuthService , private flash : FlashMessagesService) { }

  ngOnInit() {
  }


  onRegister(val){
    this.authService.register(val).subscribe(data =>{
      this.router.navigate(['/']);
      console.log(data);
      this.datas = data
      this.authService.storeUserData(this.datas.token , this.datas.user);
      this.flash.show('You are now user' , { cssClass : 'alert-success' , timeout : 3000 });
    } , 
    err =>{
      this.flash.show(`${err.error.text}` , { cssClass : 'alert-danger' , timeout : 5000 });
      console.log(err)
    })
  }


  // checkEmail(email){
  //   this.authService.checkEmail(email).subscribe(data =>{
  //     this.emailVlaid= true;
  //     this.emailMessage = data
  //   }, err =>{
  //     this.emailVlaid = false;
  //     this.emailMessage = err.error.text
  //   }
  //   )
  // }

  // checkUsername(username){
  //   this.authService.checkUsername(username).subscribe(data =>{
  //     this.success = data;
  //     console.log(data);
  //   },err =>{
  //     this.datassError = err
  //     console.log(this.datassError.error.msg);
  //   }
  //   )
    
  // }


}
