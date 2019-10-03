import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    datas :any ;
    passwordd

  constructor(private login : AuthService , private flashmessage : FlashMessagesService , private router : Router) { }

  ngOnInit() {
  }

  onLoginSubmit(val){
    this.login.login(val).subscribe(data =>{
       this.datas = data
       this.flashmessage.show(this.datas.msg , { cssClass : 'alert-success' , timeout : 3000 });
       this.login.storeUserData(this.datas.token , this.datas.user);
      this.router.navigate(['/']);
      
      
    } , 
    err =>{
      this.flashmessage.show(`${err.error.msg}` , { cssClass : 'alert-danger' , timeout : 3000 });
        this.passwordd = '';
    })
  }

}
