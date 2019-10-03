const User = require('../model/user');
const Blog = require('../model/blog');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/newBlog', (req, res) => {
    if (!req.body.title) {
        return res.status(200).json({ success: false, msg: 'Blog Tilte is required' });
    } else {
        if (!req.body.body) {
            return res.status(200).json({ success: false, msg: 'Blog Body is required' });
        } else {
            if (!req.body.createdBy) {
                return res.status(200).json({ success: false, msg: 'Blog creator is required' });
            } else {
                const blog = new Blog({
                    title: req.body.title,
                    body: req.body.body,
                    createdBy: req.body.createdBy
                });
                blog.save((err) => {
                    if (err) {
                        if (err.errors) {
                            if (err.errors.title) {
                                return res.status(200).json({ success: false, msg: err.errors.title.message });
                            } else {
                                if (err.errors.body) {
                                    return res.status(200).json({ success: false, msg: err.errors.body.message });
                                } else {
                                    return res.status(200).json({ success: false, msg: err.errmsg });
                                }
                            }
                        } else {
                            return res.status(200).json({ success: false, msg: err });
                        }
                    } else {
                        return res.status(200).json({ success: true, msg: 'Blog Saved !' });
                    }
                })
            }
        }
    }
});


router.get('/allBlogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            return res.status(200).json({ success: false, msg: err });
        } else {
            if (!blogs) {
                return res.status(200).json({ success: false, msg: 'Not Blogs Founded.' });
            } else {
                return res.status(200).json({ success: true, Blogs: blogs });
            }
        }
    }).sort({ '_id': -1 });
})



// router.use((req ,res, next)=>{
//     const token = req.header('auth');
//     if(!token){
//         return res.status(401).send('Acess denied ... No Tocken protected')
//     }
//     try{
//         const user = JWT.verify( token , config.secret);
//         req.decoded = user;

//         next();
//     }catch(ex){
//         return res.status(400).send('Invalid Token')        
//     }
// })



router.get('/singleBlog/:id', auth, (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({ success: false, msg: 'No Blogs Id was provided' });
    } else {
        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            if (err) {
                return res.status(200).json({ success: false, msg: 'Not a valid blog Id' });
            } else {
                if (!blog) {
                    return res.status(200).json({ success: false, msg: 'Not Blog Founded.' });
                } else {
                    User.findOne({ _id: req.decoded.user_id }, (err, user) => {
                        if (err) {
                            return res.status(200).json({ success: false, msg: err });
                        } else {
                            if (user.username !== blog.createdBy) {
                                return res.status(200).json({ success: false, msg: 'You are not authorized to edit this Blog post.' });
                            } else {
                                return res.status(200).json({ success: true, Blogs: blog });
                            }
                        }
                    })
                }
            }
        });
    }
});

router.put('/updateBlog', auth, (req, res) => {
    if (!req.body._id) {
        return res.status(200).json({ success: false, msg: 'No Blog Id provided' });
    } else {
        Blog.findOne({ _id: req.body._id }, (err, blog) => {
            if (err) {
                return res.status(200).json({ success: false, msg: 'Not a valid blog Id' });
            } else {
                if (!blog) {
                    return res.status(200).json({ success: false, msg: 'Not Blog Founded.' });
                } else {
                    User.findOne({ _id: req.decoded.user_id }).select('username email').exec((err, user) => {
                        if (err) {
                            return res.status(404).send(err)
                        } else {
                            if (user.username !== blog.createdBy) {
                                return res.status(200).json({ success: false, msg: 'You are not authorized to edit this Blog post.' });
                            } else {
                                blog.title = req.body.title,
                                    blog.body = req.body.body
                                blog.save((err) => {
                                    if (err) {
                                        return res.status(200).json({ success: false, msg: err });
                                    } else {
                                        return res.status(200).json({ success: true, msg: 'Blog Updated' });
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    }
})

router.delete('/deleteBlog/:id', auth, (req, res, next) => {
    if (!req.params.id) {
        return res.status(200).json({ success: false, msg: 'No Blog Id provided' });
    } else {
        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            if (err) {
                return res.status(200).json({ success: false, msg: 'Invlid Id' });
            } else {
                if (!blog) {
                    return res.status(200).json({ success: false, msg: 'Id was not Found' });
                } else {
                    User.findOne({ _id: req.decoded.user_id }, (err, user) => {
                        if (err) {
                            return res.status(200).json({ success: false, msg: err });
                        } else {
                            if (!user) {
                                return res.status(200).json({ success: false, msg: 'Unable to auth user' });
                            } else {
                                if (user.username !== blog.createdBy) {
                                    return res.status(200).json({ success: false, msg: 'You are not auth to delete this blog' });
                                } else {
                                    blog.remove((err) => {
                                        if (err) {
                                            return res.status(200).json({ success: false, msg: err });
                                        } else {
                                            return res.status(200).json({ success: false, msg: 'Blog Deleted' });
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})


router.put('/likeBlog', (req, res) => {
    if (!req.body.id) {
        res.json({ success: false, message: 'No Id was provided' });
    } else {
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
            if (err) {
                res.json({ success: false, message: 'Invalid Blog Id' });
            } else {
                if (!blog) {
                    res.json({ success: false, message: 'The Blog was not found' });
                } else {
                    User.findOne({ _id: req.decoded.user_id }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: 'Somthing was Wrong' });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: "Couldn't auth user" });
                            } else {
                                if (user.username = blog.createdBy) {
                                    res.json({ success: false, message: "Can't Like your own Post" });
                                } else {
                                    if (blog.likedBy.includes(user.username)) {
                                        res.json({ success: false, message: "You already like This Post" });
                                    } else {
                                        if (blog.dislikedBy.includes(user.username)) {
                                            blog.dislike--;
                                            const arrayIndex = blog.dislikedBy.indexOf(user.username);
                                            blog.dislikedBy.splice(arrayIndex, 1);
                                            blog.likes++;
                                            blog.likedBy.push(user.username);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: "Somthing Went Wrong" });
                                                } else {
                                                    res.json({ success: true, message: "Blog Liked!" });
                                                }
                                            })
                                        } else {
                                            blog.likes++;
                                            blog.likedBy.push(user.username);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: "Somthing Went Wrong" });
                                                } else {
                                                    res.json({ success: true, message: "Blog Liked!" });
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})



router.put('/dislikeBlog', (req, res) => {
    if (!req.body.id) {
        res.json({ success: false, message: 'No Id was provided' });
    } else {
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
            if (err) {
                res.json({ success: false, message: 'Invalid Blog Id' });
            } else {
                if (!blog) {
                    res.json({ success: false, message: 'The Blog was not found' });
                } else {
                    User.findOne({ _id: req.decoded.user_id }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: 'Somthing was Wrong' });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: "Couldn't auth user" });
                            } else {
                                if (user.username = blog.createdBy) {
                                    res.json({ success: false, message: "Can't disLike your own Post" });
                                } else {
                                    if (blog.likedBy.includes(user.username)) {
                                        res.json({ success: false, message: "You already disliked This Post" });
                                    } else {
                                        if (blog.likedBy.includes(user.username)) {
                                            blog.dislike--;
                                            const arrayIndex = blog.likedBy.indexOf(user.username);
                                            blog.likedBy.splice(arrayIndex, 1);
                                            blog.dislike++;
                                            blog.dislike.push(user.username);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: "Somthing Went Wrong" });
                                                } else {
                                                    res.json({ success: true, message: "Blog dislike!" });
                                                }
                                            })
                                        } else {
                                            blog.dislike++;
                                            blog.dislike.push(user.username);
                                            blog.save((err) => {
                                                if (err) {
                                                    res.json({ success: false, message: "Somthing Went Wrong" });
                                                } else {
                                                    res.json({ success: true, message: "Blog dislike!" });
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})



router.post('/comment', auth, (req, res) => {
    if (!req.body.comment) {
        return res.status(200).json({ success: false, msg: 'No Comment provided' });
    } else {
        if (!req.body.id) {
            return res.status(200).json({ success: false, msg: 'No ID was provided' });
        } else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    return res.status(200).json({ success: false, msg: 'Invalid Blog Id' });
                } else {
                    if (!blog) {
                        return res.status(200).json({ success: false, msg: 'Blog Not Found' });
                    } else {
                        User.findOne({ _id: req.decoded.user_id }, (err, user) => {
                            if (err) {
                                return res.status(200).json({ success: false, msg: 'Error Somthing went wrong' });
                            } else {
                                if (!user) {
                                    return res.status(200).json({ success: false, msg: 'User Not Found' });
                                } else {
                                    blog.comments.push({
                                        comment: req.body.comment,
                                        commentator: user.username
                                    });
                                    blog.save((err) => {
                                        if (err) {
                                            return res.status(200).json({ success: false, msg: 'Error Somthing went wrong' });
                                        } else {
                                            return res.status(200).json({ success: false, msg: 'Comment Saved' });
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    }
})







module.exports = router