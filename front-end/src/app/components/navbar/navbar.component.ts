import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user;
  username;

  constructor( private auth : AuthService , private router : Router , private flash : FlashMessagesService
  ){ }

  ngOnInit() {
    this.auth.getProfile().subscribe(data =>{
      this.user = data
      this.username = this.user.user.username
      console.log(this.user);
      
      })
  }

  logout(){
    this.auth.logout();
    this.flash.show(`You are Loggedout successfully` , { cssClass : 'alert-success' , timeout : 3000 });
    this.router.navigate(['/login']);
    
  }


}
