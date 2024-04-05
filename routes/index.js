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

router.post('/adminlogin', function(req, res) {
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
      res.render('index', { title: 'Express',error:'Invalid ID or password' });
    }
  });
});

router.get('/dashboard', function(req,res,next){
  res.render('dashboard')
})
router.get('/counter', function(req,res,next){
  res.render('counter')
})
router.get('/products',function(req,res){
  connection.query("SELECT P.PRODUCT_ID,P.PRODUCT_NAME,C.CATEGORY_NAME,P.COST_PRICE,P.SELLING_PRICE,P.STOCK FROM PRODUCT P JOIN CATEGORY C ON P.CATEGORY_ID = C.CATEGORY_ID;",function(error,results,fields){
    console.log(JSON.stringify(results))
    // results.forEach(function(products){
    //   console.log(products.PRODUCT_NAME)
    // })
    
    res.render('products',{results:results})

  })
})
// In your routes file (e.g., index.js)
router.post('/addCategory', function(req, res, next) {
  const categoryName = req.body.categoryName;

  // Retrieve the last category ID from the database
  connection.query('SELECT CATEGORY_ID FROM CATEGORY ORDER BY CATEGORY_ID DESC LIMIT 1', function(error, results, fields) {
      if (error) {
          console.error('Error retrieving last category ID:', error);
          res.status(500).send('Internal Server Error');
          return;
      }

      let lastCategoryId = 'C100'; // Default value if no categories exist
      if (results.length > 0) {
          lastCategoryId = results[0].CATEGORY_ID;
      }

      // Increment the last category ID to generate the new category ID
      let nextCategoryId = 'C' + (parseInt(lastCategoryId.substr(1)) + 1);

      // Perform database operation to insert the new category
      connection.query('INSERT INTO CATEGORY (CATEGORY_ID, CATEGORY_NAME) VALUES (?, ?)', [nextCategoryId, categoryName], function(error, results, fields) {
          if (error) {
              console.error('Error adding category to database:', error);
              res.status(500).send('Internal Server Error');
              return;
          }

          // Category added successfully
          res.status(200).send('Category added successfully!');
      });
  });
});

router.post('/deleteProduct', function(req, res, next) {
  const productId = req.body.productId; // Assuming the product ID is sent in the request body

  // Perform the deletion query
  const sql = "DELETE FROM PRODUCT WHERE PRODUCT_ID = ?";
  connection.query(sql, [productId], function(error, results, fields) {
      if (error) {
          console.error('Error deleting product:', error);
          res.status(500).send('Internal Server Error'); // Send a 500 status code if there's an error
      } else {
          console.log('Product deleted successfully');
          res.status(200).send('Product deleted successfully'); // Send a success response
      }
  });
});
module.exports = router;
