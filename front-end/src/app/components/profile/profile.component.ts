import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  data;
  user;
  emaill;
  username;
  email

  constructor(private auth :AuthService) { }

  ngOnInit() {
    this.auth.getProfile().subscribe(data =>{
      this.user = data
      this.username = this.user.user.username
      this.emaill = data
      this.email = this.user.user.email
      
      console.log(this.user);
      
    })
  }

}
