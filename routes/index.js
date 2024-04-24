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

router.get('/adminlogin', function(req, res, next) {
  console.log(req.session)
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
        req.session.userId = `${EMP_ID}`;
        req.session.role = `${role}`
        res.redirect('/dashboard')
      }
      else{
        req.session.userId = `${EMP_ID}`;
        req.session.role = `${role}`

      res.redirect('/counter'); 

      }// Redirect to the dashboard or another page upon successful login

    }
     else {
      
      console.log('Invalid ID or password');
      res.render('index', { title: 'Express',error:'Invalid ID or password' });
    }
  });
});

router.get('/dashboard',isLoggedIn,isAdmin, function(req, res, next) {
  connection.beginTransaction(function(err) {
      if (err) {
          console.log("Error starting transaction:", err);
          return res.status(500).send('Internal Server Error');
      }

      // Variables to store counts
      let employeeCount, productCount, customerCount;

      // Query to get employee count
      connection.query('SELECT COUNT(*) as employeeCount FROM EMPLOYEE', function(error, results, fields) {
          if (error) {
              console.error('Error getting employee count:', error);
              return connection.rollback(function() {
                  res.status(500).send('Internal Server Error');
              });
          }
          employeeCount = results[0].employeeCount; // Assign employee count
          checkCounts(); // Check if all counts are obtained
      });

      // Query to get product count
      connection.query('SELECT COUNT(*) as productCount FROM PRODUCT', function(error, results, fields) {
          if (error) {
              console.error('Error getting product count:', error);
              return connection.rollback(function() {
                  res.status(500).send('Internal Server Error');
              });
          }
          productCount = results[0].productCount; // Assign product count
          checkCounts(); // Check if all counts are obtained
      });

      connection.query('SELECT COUNT(*) as customerCount FROM CUSTOMER', function(error, results, fields) {
          if (error) {
              console.error('Error getting customer count:', error);
              return connection.rollback(function() {
                  res.status(500).send('Internal Server Error');
              });
          }
          customerCount = results[0].customerCount; // Assign customer count
          checkCounts(); // Check if all counts are obtained
      });

      function checkCounts() {
          if (employeeCount !== undefined && productCount !== undefined && customerCount !== undefined) {
              res.render('dashboard', { employeeCount: employeeCount, productCount: productCount, customerCount: customerCount });
          }
      }
  });
});

router.get('/counter',isLoggedIn, function(req,res,next){
  res.render('counter',{empid:req.session.userId})
})
router.get('/products',isLoggedIn,isAdmin,function(req,res){
  let result;
  let categories;
  connection.beginTransaction((err)=>{
    if(err){
      console.log(err)
    }
    connection.query("SELECT P.PRODUCT_ID,P.PRODUCT_NAME,C.CATEGORY_NAME,P.COST_PRICE,P.SELLING_PRICE,P.STOCK FROM PRODUCT P JOIN CATEGORY C ON P.CATEGORY_ID = C.CATEGORY_ID;",function(error,results,fields){
      result = results;
      if (error) {
        console.error('Error deleting employee from EMPLOYEE_LOGIN:', error);
        return connection.rollback(function() {
            res.status(500).send('Internal Server Error');
        });
    }
    connection.query("SELECT CATEGORY_NAME FROM CATEGORY",function(err,results,fields){
      categories = results;
      console.log(categories[0].CATEGORY_NAME)
      res.render('products',{results:result,categories:categories})

      
    })
    })
  })


})
router.post('/addproduct', function(req, res) {
  const productname = req.body.productname;
  const selectedText = req.body.selectedText;
  const sku = req.body.sku;
  const qty = req.body.qty;
  const cost = req.body.cost;
  const price = req.body.price;
  let categoryID;

  connection.beginTransaction(function(err) {
      if (err) {
          console.log("Error starting transaction:", err);
          return res.status(500).send('Internal Server Error');
      }

      connection.query("SELECT CATEGORY_ID from CATEGORY WHERE CATEGORY_NAME = ?", [selectedText], function(err, results, fields) {
          if (err) {
              console.log(err);
              connection.rollback();
              return res.status(500).send('Internal Server Error');
          }
          categoryID = results[0].CATEGORY_ID;
          console.log(categoryID);

          connection.query("INSERT INTO PRODUCT (PRODUCT_ID, PRODUCT_NAME, CATEGORY_ID, COST_PRICE, SELLING_PRICE, STOCK) VALUES (?, ?, ?, ?, ?, ?)", [sku, productname, categoryID, cost, price, qty], function(err, results, fields) {
              if (err) {
                  console.log('Error adding product to database:', err);
                  connection.rollback();
                  return res.status(500).send('Internal Server Error');
              }

              // Commit the transaction
              connection.commit(function(err) {
                  if (err) {
                      console.log('Error committing transaction:', err);
                      return res.status(500).send('Internal Server Error');
                  }
                  console.log('Transaction complete.');
                  res.status(200).send('Product added successfully!');

              });
          });
      });
  });
});
router.post('/addCategory', function(req, res, next) {
  const categoryName = req.body.categoryName;

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

router.get('/custID',function(req,res){
  connection.query('SELECT C_ID FROM CUSTOMER ORDER BY C_ID DESC LIMIT 1',function(error,results,fields){
    if (error) {
      console.error('Error retrieving last category ID:', error);
      res.status(500).send('Internal Server Error');
      return;
  }
  let lastCustId = 'C100';
  if (results.length > 0) {
    lastCustId = results[0].C_ID;
  }
  let nextCustId = 'C' + (parseInt(lastCustId.substr(1)) + 1);
  res.json(`${nextCustId}`);

})});

router.post('/deleteProduct', function(req, res, next) {
  const productId = req.body.productId; // Assuming the product ID is sent in the request body

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
router.get('/employees',isLoggedIn,isAdmin,function(req,res){
  connection.query('SELECT * FROM EMPLOYEE LEFT JOIN EMPLOYEE_MOBILE on EMPLOYEE.EMP_ID = EMPLOYEE_MOBILE.EMP_ID', function(error, results, fields) {

    res.render('employees',{results:results})
  });
})
router.post('/deleteEMP', function(req, res) {
  const EMP_ID = req.body.EMP_ID;
  console.log(EMP_ID); // Check if EMP_ID is provided
  if (!EMP_ID) {
      return res.status(400).send('EMP_ID is required');
  }

  connection.beginTransaction(function(err) {
      if (err) {
          console.log("Error starting transaction:", err);
          return res.status(500).send('Internal Server Error');
      }

      // Delete from EMPLOYEE_LOGIN table
      connection.query('DELETE FROM EMPLOYEE_LOGIN WHERE EMP_ID = ?', [EMP_ID], function(error, results, fields) {
          if (error) {
              console.error('Error deleting employee from EMPLOYEE_LOGIN:', error);
              return connection.rollback(function() {
                  res.status(500).send('Internal Server Error');
              });
          }

          // Delete from EMPLOYEE_MOBILE table
          connection.query('DELETE FROM EMPLOYEE_MOBILE WHERE EMP_ID = ?', [EMP_ID], function(error, results, fields) {
              if (error) {
                  console.error('Error deleting employee from EMPLOYEE_MOBILE:', error);
                  return connection.rollback(function() {
                      res.status(500).send('Internal Server Error');
                  });
              }

              // Delete from EMPLOYEE table
              connection.query('DELETE FROM EMPLOYEE WHERE EMP_ID = ?', [EMP_ID], function(error, results, fields) {
                  if (error) {
                      console.error('Error deleting employee from EMPLOYEE:', error);
                      return connection.rollback(function() {
                          res.status(500).send('Internal Server Error');
                      });
                  }

                  // Commit the transaction if all queries succeed
                  connection.commit(function(err) {
                      if (err) {
                          console.error('Error committing transaction:', err);
                          return connection.rollback(function() {
                              res.status(500).send('Internal Server Error');
                          });
                      }
                      console.log('Transaction complete.');
                      res.status(200).send('Transaction complete.');
                  });
              });
          });
      });
  });
});

function isLoggedIn(req,res,next){
  if(req.session.userId){
    next()
  }
  else{
    res.redirect('/adminlogin')
  }
}
function isAdmin(req,res,next){
  if(req.session.role === 'ADMIN'){
    next()

  }
  else{
    res.send("You are not authorized to view this page.")
  }
}

router.get('/counter',function(req,res){
  res.render('counter')
})

router.post('/searchCustomer',function(req,res){
  const MobileNo = req.body.MobileNo
  console.log(MobileNo)
  connection.query('SELECT * FROM CUSTOMER WHERE C_MOBILE = ?',[MobileNo],function(error,results,fields){
    if (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error'); // Send a 500 status code if there's an error
  } else {
      console.log(results[0]);
      if (results.length > 0) {
        const customerId = results[0].C_ID; // Assuming the customer ID is retrieved from the database
        req.session.customerId = customerId; // Set customer ID in session
        res.send(results);
    } else {
        // Handle case when customer is not found
        res.status(404).send('Customer not found');
    }// Send a success response
  }
  })
})

router.post('/addCustomer', function(req, res) {
  const C_ID = req.body.C_ID;
  const C_NAME = req.body.C_NAME.toUpperCase();
  const C_MOBILE = req.body.C_MOBILE;

  connection.query('INSERT INTO CUSTOMER VALUES (?,?,?)', [C_ID, C_NAME, C_MOBILE], function(error, results, fields) {
      if (error) {
          console.log(error);
          res.status(500).send('Failed to add customer. Please try again later.'); // Sending an error response to the client
      } else {
          res.status(200).send('Customer added successfully.'); // Sending a success response to the client
      }
  });
});

router.post('/itemDetail',function(req,res){
  const skuID = req.body.skuID
  connection.query('SELECT * FROM PRODUCT WHERE PRODUCT_ID = ?',[skuID],function(error,results,fields){
    if (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error'); // Send a 500 status code if there's an error
  } else {
      console.log(results[0]);
      res.send(results); // Send a success response
  }
  })
})
router.get('/getOrderID',function(req,res){
  connection.query('SELECT ORDER_ID from ORDERS ORDER BY ORDER_ID DESC LIMIT 1',function(error,results,fields){
    res.json(results);
    
  })
  
})
router.get('/payment',function(req,res){
  const orderID = req.query.orderID;
  console.log(orderID)
  res.render('payment')
})
router.post('/addOrderDetails',function(req,res){
  const customerID = req.body.customerID;
  const amount = req.body.total
  const orderID = req.body.nextOid
  const date = req.body.date
  connection.query('INSERT INTO ORDERS VALUES (?,?,?,?)',[orderID,customerID,amount,date],function(error,results,fields){
    if (error) {
      console.error('Error inserting order:', error);
      res.status(500).send('Internal Server Error'); // Send a 500 status code if there's an error
  } else {
      res.send(results); // Send a success response
  }
  })
})

router.post('/updateProductDetails', function(req, res) {
  const newQty = req.body.newQty;
  const newPriceStr = req.body.newPrice; // Price string in the format "100$"
  const newCostStr = req.body.newCost;   // Cost string in the format "100$"
  const Pid = req.body.Pid;

  // Parse and convert price and cost strings to numbers
  const newPrice = parseFloat(newPriceStr.replace('$', ''));
  const newCost = parseFloat(newCostStr.replace('$', ''));

  const sql = `UPDATE PRODUCT 
               SET STOCK = ?, COST_PRICE = ?, SELLING_PRICE = ? 
               WHERE PRODUCT_ID = ?`;

  connection.query(sql, [newQty, newCost, newPrice, Pid], (err, result) => {
      if (err) {
          console.error('Error updating product details:', err);
          res.status(500).send('Error updating product details');
      } else {
          console.log('Product details updated successfully');
          res.sendStatus(200); // Send success status
      }
  });
});
router.post('/logout',function(req,res){
  delete req.session.userId;
  res.sendStatus(200);
})
module.exports = router;
