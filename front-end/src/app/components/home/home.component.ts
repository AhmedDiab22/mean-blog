import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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


}
