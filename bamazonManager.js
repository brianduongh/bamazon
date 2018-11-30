// Declare packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazon'
});

// Prompts user questions
inquirer.prompt([
  {
    type: 'list',
    name: 'options',
    choices: [
      'View products for sale',
      'View low inventory',
      'Add to inventory',
      'Add new product'
    ]
  }
]).then(function(res) {
  let option = res.options;
  switch (option) {
    case 'View products for sale':
      viewProducts();
      break;
    case 'View low inventory':
      viewLow();
      break;
    case 'Add to inventory':
      addInventory();
      break;
    case 'Add new product':
      newProduct();
      break;
  }
})

// Show all products
const viewProducts = () => {
  connection.query('SELECT * FROM products', function(err,res) {
    if (err) throw err;
    console.log(chalk.cyanBright(`--------------BAMAZON PRODUCTS-------------`));
    console.log(chalk.cyanBright(`ID\tProduct\tPrice\tStock\tDepartment`));
    console.log(chalk.cyanBright(`-------------------------------------------`));
    res.forEach(product => {
      console.log(`${chalk.red(product.id)}\t${chalk.yellow(product.product_name)}\t$${product.price}\t${chalk.yellow(product.stock_quantity)}\t${chalk.red(product.department_name)}`)
    });
  });
  connection.end();
};

// Show products with less than 5 items in stock
const viewLow = () => {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
    if (err) throw err;
    console.log("LOW INVENTORY ITEMS");
    res.forEach(product => {
      console.log(`${chalk.red(product.id)}\t${chalk.yellow(product.product_name)}\t$${product.price}\t${chalk.yellow(product.stock_quantity)}\t${chalk.red(product.department_name)}`)
    });
  });
  connection.end();
};

// Add more stock to inventory
const addInventory = () => {
  let productList = [];
  connection.query('SELECT * FROM products', function(err, res) {
    // Create an array with products in it for choices
    res.forEach(product => {
      productList.push(product.product_name);
    });
    inquirer.prompt([
      {
        type: 'list',
        choices: productList,
        name: 'products',
        message: 'What to increase?'
      },
      {
        type: 'input',
        name: 'amount',
        message: 'How much would you like to add?'
      }
    ]).then(function(ans) {
      connection.query('SELECT * FROM products WHERE ?', { product_name: ans.products }, function(err, res) {
        let stockQuantity = res[0].stock_quantity;
        addStock(stockQuantity, ans.products, ans.amount);
      });
    })
  });
};

// Adds to stock
const addStock = (stockQuantity, product, amount) => {
  connection.query('UPDATE products SET ? WHERE ?;',
  [
    {
      stock_quantity: parseInt(stockQuantity) + parseInt(amount)
    },
    {
      product_name: product
    }
  ],
  function(err,res) {
    console.log(
`
You added ${amount} more to ${product}!
`
    );
    connection.end();
  })
}

// Create a new product
const newProduct = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'product',
      message: 'What new product would you like to add?'
    },
    {
      type: 'input',
      name: 'department',
      message: 'What department is the product in?',
    },
    {
      type: 'input',
      name: 'price',
      message: 'How much is the product?'
    }
  ]).then(function(ans) {
    connection.query('INSERT INTO products SET ?',
    {
      product_name: ans.product,
      department_name: ans.department,
      price: ans.price,
      stock_quantity: 0
    },
    function(err, res) {
      console.log(
`
You added ${ans.product} as a new product!
`
      );
      connection.end();
    });
  })
}
