var express = require('express');
var router = express.Router();
var dbConn  = require('../db/connection');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM Posts ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users/',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('users/',{data:rows});
        }
    });
});
router.get('/index', function(req, res, next) {      
  dbConn.query('SELECT * FROM Posts ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          // render to views/users/index.ejs
          res.render('users/index',{data:''});   
      } else {
          // render to views/users/index.ejs
          res.render('users/index',{data:rows});
      }
  });
});
router.get('/posts', function(req, res, next) {      
  dbConn.query('SELECT * FROM Posts ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          // render to views/users/index.ejs
          res.render('users/posts',{data:''});   
      } else {
          // render to views/users/index.ejs
          res.render('users/posts',{data:rows});
      }
  });
});
// // display add user page
router.get('/add-post', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add-post', {
        title: '',
        description: ''
        
    })
})

// add a new user
router.post('/add-post', function(req, res, next) {    

    let title = req.body.title;
    let description = req.body.description;
   
    let errors = false;

    if(title.length === 0 || description.length === 0 ) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/add-post', {
            title: title,
            description: description
          
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
          title: title,
          description: description
        }
        
        // insert query
        dbConn.query('INSERT INTO Posts SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add-post.ejs
                res.render('users/add-post', {
                    title: form_data.title,
                    description: form_data.description
                   
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/posts');
            }
        })
    }
})
router.get('/edit', function(req, res, next) {    
    // render to add.ejs
    res.render('users/edit', {
        id:'',
        title: '',
        description: ''
        
    })
})
// display edit user page
router.get('/edit/:id', function(req, res, next) {

    let id = req.params.id;
    
   
    dbConn.query('SELECT * FROM Posts WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/posts')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', { 
                id: rows[0].id,
                title: rows[0].title,
                description: rows[0].description,
             
            })
        }
    })
})

// update user data
router.post('/edit/:id', function(req, res, next) {
    let postId = req.params.id;
    let title = req.body.title;
    let description = req.body.description;

    let errors = false;

    if (title.length === 0 || description.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");

        // render to edit.ejs with flash message
        res.render('users/edit', {
            id: postId,
            title: title,
            description: description
        });
    }

    // if no error
    if (!errors) {
        var form_data = {
            title: title,
            description: description
        };

        // update query
        dbConn.query('UPDATE Posts SET ? WHERE id = ?', [form_data, postId], function(err, result) {
            if (err) {
                req.flash('error', err);

                // render to edit-post.ejs
                res.render('users/edit', {
                    id: postId,
                    title: form_data.title,
                    description: form_data.description
                });
            } else {
                req.flash('success', 'Post successfully updated');
                res.redirect('/posts');
            }
        });
    }
});

   
// delete user
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM Posts WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/posts');
        } else {
            req.flash('success', 'Post successfully deleted! ID = ' + id);
            res.redirect('/posts');
        }
    });
});

module.exports = router;