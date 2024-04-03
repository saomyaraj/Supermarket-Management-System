var express = require('express');
var mysql = require("mysql");
var router = express.Router();

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root123',
  database : 'Supermarket'
});
try{
  connection.connect();

}
catch(err){
  console.log(err)
}

/* GET home page. */
router.get('/adminlogin', function(req, res, next) {
  res.render('index', { title: 'Express',error:'' });
});

router.post('/loginbyadmin', function(req, res, next) {
  const EMP_ID = req.body.ID;
  const password = req.body.password;
  // console.log(ID);

  connection.query('SELECT EMP_ID, PASSWORD, EMP_ROLE FROM EMPLOYEE_LOGIN WHERE EMP_ID = ? AND PASSWORD = ?', [EMP_ID, password], function (error, results, fields) {
    console.log(results)
    if (error) {
      console.error('Error querying database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 1) {
      const role = results[0].EMP_ROLE;
      console.log('User logged in successfully with role',role);
      if(role === 'ADMIN'){
        res.redirect('/dashboard')
      }
      else{

      res.redirect('/counter'); 

      }// Redirect to the dashboard or another page upon successful login

    }
     else {
      console.log('Invalid ID or password');
      res.render('index', { title: 'Express', error: 'Invalid ID or password' });
    }
  });
});

router.get('/dashboard', function(req,res,next){
  res.render('dashboard')
})
router.get('/counter', function(req,res,next){
  res.render('counter')
})

module.exports = router;
