const mysql = require('mysql');

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
  afterConnection();
});

const afterConnection = () => {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    // console.log("---WELCOME TO BAMAZON---");
    // res.forEach(product => {
    //   console.log(product.id);
    // })
    printProducts(res);
    connection.end();
  });
};

const printProducts = products => {
  console.log(
`
--- WELCOME TO BAMAZON ---
`
  );
  products.forEach(product => {
    console.log(product.product_name);
  })
};
