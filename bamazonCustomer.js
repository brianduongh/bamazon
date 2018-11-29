// Connect to mysql database
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  console.log('WELCOME TO BAMAZON');
  printInventory();
  // afterConnection();
});




// Prints inventory
const printInventory = () => {
  console.log('Printing Inventory...');
  let query = connection.query(
    'SELECT * FROM products',
    function(err,res) {
    if (err) throw err;
    res.forEach(product => {
      console.log(`${product.id}\t${product.product_name}\t${product.price}\t${product.stock_quantity}`)
    });
    purchaseItem();
  });
};

const purchaseItem = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'What product id would you like to buy?'
    },
    {
      type: 'input',
      name: 'amt',
      message: 'How much would you like to buy?'
    }
  ]).then(function(res) {
    updateInventory(res.id, res.amt);
  });
};

const updateInventory = (id, amount) => {
  let query = connection.query(
    'SELECT * FROM products WHERE ?',
    [
      {
        id: id
      }
    ],
    function(err, res) {
      if (err) throw err;
      let stockQuantity = res[0].stock_quantity;
      let stockLeft = stockQuantity - amount;
      let total = res[0].price * amount;
      if (stockQuantity > 0) {
        updateStock(id, stockLeft, total);
      } else {
        console.log("There's not enough items!");
        purchaseItem();
      };
    }
  )
};

const updateStock = (id, stockLeft, total) => {
  let query = connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: stockLeft
      },
      {
        id: id
      }
    ],
    function(err) {
      if (err) throw err;
      console.log("You have purchased an item");
      console.log("Your total is: " + total);
      printInventory();
    }
  );
};
