-- Create database
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

-- Create Table
CREATE TABLE products (
	id INT(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(30) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT(10) NULL,
	PRIMARY KEY (id)
);

-- Insert dummy values
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("Spoon", "Kitchen", 2.00, 40),
	("Knife", "Kitchen", 20.00, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
	("Guitar", "Instruments", 200.00, 30),
	("Ukulele", "Instruments", 100.00, 10),
	("Banjo", "Instruments", 150.00, 25);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
	("Wrench", "Tools", 10.00, 100),
	("Hammer", "Tools", 15.00, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES
	("Chips", "Food", 1.50, 200),
	("Jalapeno", "Food", .50, 300),
	("Milk", "Food", 3.00, 100);

-- Show all products
SELECT * FROM products;
