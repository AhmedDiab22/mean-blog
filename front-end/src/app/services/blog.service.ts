import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  options
  url = 'http://localhost:3200/blogs';

  constructor( private http : HttpClient , private auth : AuthService ) { }

  craeteAuthHeader(){
    this.auth.loadToken();
    this.options =  new HttpHeaders({
      'Content-Type' : 'application/json',
      'auth' : this.auth.authToken
    })
  }


  newBlog(blog){
    this.craeteAuthHeader();
    return this.http.post(`${this.url}/newBlog` , blog ,   {headers : this.options})
  }
  getBlogs(){
    this.craeteAuthHeader();
    return this.http.get(`${this.url}/allBlogs` , {headers : this.options})
  }
  getSingleBlog(id){
    this.craeteAuthHeader();
    return this.http.get(`${this.url}/singleBlog/${id}` , {headers : this.options})
  }
  editBlog(blog){
    this.craeteAuthHeader();
    return this.http.put(`${this.url}/updateBlog` , blog , {headers : this.options})    
  }
  deleteBlog(id){
    this.craeteAuthHeader();
    return this.http.delete(`${this.url}/deleteBlog/${id}` , {headers : this.options});
  }
  postComment(id , comment){
    this.craeteAuthHeader();
    const blogData = {
      id : id,
      comment : comment
    }
    return this.http.post(`${this.url}/comment` , blogData , {headers : this.options});
  }

  likeBlog(id){
    const blogData = {id : id};
    return this.http.put(`${this.url}/likeBlog` , blogData , {headers : this.options}) 
  }
  dislikeBlog(id){
    const blogData = {id : id}
    return this.http.put(`${this.url}/dislikeBlog` , blogData , {headers : this.options})
  }

}


