const express = require('express');
const server = express();

server.use(express.json());

server.listen(5000, ()=>{
    console.log('server is running');
})

let posts = [{
    id: 0,
    title: "The post title",
    contents: "The post contents",
    created_at: 'Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)',
    updated_at: 'Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)'
  }];

  let comments = [{
    text: "The text of the comment",
    post_id: 0,
    created_at: 'Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)',
    updated_at: 'Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)'
  }]

  server.post('/api/posts', (req, res) =>{
      if(req.body.title === undefined){
          res.status(404).send({msg: 'missing title'})
      }
      if(req.body.contents === undefined){
        res.status(404).send({msg: 'missing contents'})
      }
      posts = [...posts, req.body];
      res.send(posts);
  });

  server.post('/api/posts/:id/comments', (req, res) =>{
    const {id} = req.params;
    console.log(req.body);
    const postIndex = posts.findIndex(a => a.id == id);
    if (postIndex === -1){
        res.status(404).send({msg: 'no such post'})
    }
    if(req.body.text === undefined){
        res.status(404).send({msg: 'missing text'})
    }
    comments = [...comments, req.body];
    res.send(comments);
});

server.get('/api/posts', (req, res) =>{
    res.send(posts);
})

server.get('/api/posts/:id', (req,res) =>{
    const {id} = req.params;
    console.log(id);
    const postIndex = posts.findIndex(a => a.id == id);
    if (postIndex === -1){
        res.status(404).send({msg: 'no such post'})
    }
    res.send(posts[postIndex]);
})

server.get('/api/posts/:id/comments', (req,res) =>{
    const {id} = req.params;
    console.log(id);
    const postIndex = posts.findIndex(a => a.id == id);
    if (postIndex === -1){
        res.status(404).send({msg: 'no such post'})
    }
    res.send(comments.filter(a => a.post_id == id));
})

server.delete('/api/posts/:id', (req,res) =>{
    const {id} = req.params;
    console.log(id);
    const postIndex = posts.findIndex(a => a.id == id);
    if (postIndex === -1){
        res.status(404).send({msg: 'no such post'})
    }
    posts = posts.filter(a => a.id != id);
    res.send(posts);
})

server.put('/api/posts/:id', (req, res) =>{
    const {id} = req.params;
    console.log(id);
    const postIndex = posts.findIndex(a => a.id == id);
    if (postIndex === -1){
        res.status(404).send({msg: 'no such post'})
    }
    if(req.body.title === undefined){
        res.status(404).send({msg: 'missing title'})
    }
    if(req.body.contents === undefined){
      res.status(404).send({msg: 'missing contents'})
    }
    
    const post = {...req.body };
  
      posts = [
        ...posts.slice(0, postIndex),
        post,
        ...posts.slice(postIndex + 1)
      ];
    res.status(201).send(posts);
});
 