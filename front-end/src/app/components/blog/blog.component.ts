import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { FlashMessagesService } from 'angular2-flash-messages';



@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  messageData;
  newPost = false;
  loadingBlogs = false;
  commentForm;
  username;
  user;
  proccessing = false;
  titlee;
  bodyy;
  blogsPosts;
  Blogs;
  newComment = [];
  enableComments = [] 

  constructor(private auth :AuthService , private blogService : BlogService,private flash : FlashMessagesService ) { }

  

  ngOnInit() {
    this.auth.getProfile().subscribe(profile =>{
      this.user = profile;
      this.username = this.user.user.username
    })

    this.getAllBlogs()
  }

  newBlogForm(){
    this.newPost = true
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    this.getAllBlogs()
    // window.location.reload();
    setTimeout(() => {
      this.loadingBlogs = false
    }, 4000);
  }

  draftComments(id){
    this.newComment = [];
    this.newComment.push(id);
  }

  onBlogSubmit(val){
    let blog = {
      title : this.titlee,
      body : this.bodyy,
      createdBy : this.username
    }
    this.blogService.newBlog(blog).subscribe(data =>{
      this.messageData = data;
      this.message = this.messageData.msg;
      this.flash.show(this.message , { cssClass : 'alert-success' , timeout : 5000 })
      this.getAllBlogs()
      setTimeout(() => {
        this.newPost = false;
        this.message = false
      }, 2000);
    })
  }

  saveBlogs(){
    this.loadingBlogs = true;
    setTimeout(() => {
      this.loadingBlogs = false
    }, 1000);
  }

  goBack(){
    window.location.reload()
  }

  getAllBlogs(){
    this.blogService.getBlogs().subscribe(blogs =>{
      this.blogsPosts = blogs
      this.Blogs = this.blogsPosts.Blogs;
      console.log(this.Blogs);
      
    })
  }

  postComment(id){
    console.log(id)
  }
  expand(id){
    this.enableComments.push(id)
  }
  collapse(id){
    const index = this.enableComments.indexOf(id);
    this.enableComments.splice(index , 1)
  }

  cancleSubmittion(id){
    const index = this.newComment.indexOf(id)
    this.newComment.splice(index , 1);
    this.proccessing = false;
  }

  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data =>{
      this.getAllBlogs()
    })
  }

  dislikeBlog(id){
    this.blogService.dislikeBlog(id).subscribe(data =>{
      this.getAllBlogs()
    })
  }


}
