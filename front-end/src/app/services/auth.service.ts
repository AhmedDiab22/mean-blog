import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  url = 'http://localhost:3200/authenticate';
  authToken;
  user;
  options;

  constructor( private http : HttpClient ) { }


  register(user){
    return this.http.post(`${this.url}/register` , user  , {headers : new HttpHeaders({'Content-Type' : 'application/json'})});
  }

  // checkUsername(username){
  //   return this.http.get(`${this.url}/checkUsername/${username}`, { headers : this.headers });
  // }

  // checkEmail(email){
  //   return this.http.get(`${this.url}/checkEmail/${email}`);
  // }

  login(user){
    return this.http.post(`${this.url}/login` , user );
  }

  getProfile(){
    this.craeteAuthHeader();
    return this.http.get(`${this.url}/profile` , {headers : this.options});
  }

  craeteAuthHeader(){
    this.loadToken();
    this.options =  new HttpHeaders({
      'Content-Type' : 'application/json',
      'auth' : this.authToken
    })
  }


  loadToken(){
    const token = localStorage.getItem('token');
    this.authToken = token
  }


  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token , user){
    localStorage.setItem('token' , token);
    localStorage.setItem('user' , JSON.stringify(user));
    this.authToken = token;
    this.user = user
  }



}

