import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  blogs;
  dataSuccess ;
  loading = true;
  blog = {
    title : String,
    body : String
  }
  proccessing = false;
  currentUrl;
  msgg;
  msggss

  constructor(private router : Router , private  location : Location , private activatedRoute : ActivatedRoute , private flashmessage : FlashMessagesService  , private blogService : BlogService) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data =>{
      console.log(data);
      this.blogs = data;
      this.blog = this.blogs.Blogs;
      this.loading = false
    })
  }

  updateBlog(){
    this.blogService.editBlog(this.blog).subscribe(data =>{
      this.msgg = data;
      this.msggss = this.msgg.msg
      this.flashmessage.show(this.msggss , { cssClass : 'alert-success' , timeout : 3000 });
      setTimeout(() => {
        this.router.navigate(['/blog'])
      }, 2000);
    })
  }

  goBack(){
    this.location.back()
  }

}
