import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  createdBy;
  createdAt;
  by;
  currentUrl;
  body;
  title;
  id;
  proccess = true;
  message;
  msg;
  showMsg

  constructor(private ActiveRoute : ActivatedRoute ,private route : Router,private auth :AuthService ,private blogService : BlogService,private flashmessage : FlashMessagesService ) { }

  ;

  ngOnInit() {
    this.currentUrl = this.ActiveRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data =>{
      this.by = data;
      this.createdBy = this.by.Blogs.createdBy
      this.createdAt = this.by.Blogs.createAt
      this.body = this.by.Blogs.body
      this.title = this.by.Blogs.title
    })
    
    
  }

  deleteBlog(){
    let id = this.currentUrl.id;
    this.blogService.deleteBlog(id).subscribe(data =>{
      console.log(data);
      this.proccess = false;
      this.msg = data
      this.message = this.msg.msg;
     this.showMsg =  this.message ;
     this.flashmessage.show(this.showMsg , {cssClass : 'alert-danger' ,  timeout : 3000 })
     this.route.navigate(['/blog']);
    })
  }
  }
