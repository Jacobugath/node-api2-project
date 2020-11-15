const express = require('express');
const server = express();

const {find,
    findById,
    insert,
    update,
    remove,
    findPostComments,
    findCommentById,
    insertComment} = require('./data/db')

server.use(express.json());

server.listen(5000, ()=>{
    console.log('server is running');
})

  server.post('/api/posts', (req, res) =>{
      if(req.body.title === undefined ||req.body.contents === undefined){
          res.status(400).send({errorMessage: "Please provide title and contents for the post." })
      }
      insert(req.body).then(a =>{
        findById(a.id).then(b => res.status(201).send(b))
      }).catch(a =>{res.status(500).send({ error: "There was an error while saving the post to the database" })
    })})

  server.post('/api/posts/:id/comments', (req, res) =>{
    if(req.body.text === undefined){
        res.status(400).send({errorMessage: "Please provide text for the comment."})
    }
    insertComment(req.body).then(a => findCommentById(a.id).then(b => res.status(201).send(b))).catch(err => res.status(404).send({ message: "The post with the specified ID does not exist."}))
});

server.get('/api/posts', (req, res) =>{
    find().then(a => res.send(a)).catch(a => res.status(500).send({ error: "The posts information could not be retrieved." }));
})

server.get('/api/posts/:id', (req,res) =>{
    const {id} = req.params;
    findById(id).then(a => {
        if(a === []) res.status(404).send({ message: "The post with the specified ID does not exist." });
        res.send(a);
    }).catch(err => res.status(500).send({ error: "The post information could not be retrieved." }))
})

server.get('/api/posts/:id/comments', (req,res) =>{
    const {id} = req.params;
    findPostComments(id).then(a =>{
        if(a === []) res.status(404).send({ message: "The post with the specified ID does not exist." })
        res.send(a);
    }).catch(err => res.status(500).send({ error: "The comments information could not be retrieved." }));
})

server.delete('/api/posts/:id', (req,res) =>{
    const {id} = req.params;
    remove(id).then(a =>{
        if(a !== 1) res.status(404).send({ message: "The post with the specified ID does not exist." })
        res.send('successfully deleted')
    }).catch(err => res.status(500).send({ error: "The post could not be removed" }))
})

server.put('/api/posts/:id', (req, res) =>{
    const {id} = req.params;
    update(id, req.body).then(a =>{
        if(a !== 1) res.status(404).send({ errorMessage: "Please provide title and contents for the post." })
        findById(id).then(b => res.status(200).send(b))
    }).catch(err => res.status(500).send({ error: "The post information could not be modified." }))
});
 