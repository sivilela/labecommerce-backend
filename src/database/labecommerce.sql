-- Active: 1702853169182@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL
);

INSERT INTO users (id, name, email, password, created_at)
VALUES 
  ('u001', 'Maria Eduarda', 'eduarda@email.com', 'duda123', CURRENT_TIMESTAMP),
  ('u002', 'Paulo Henrique', 'paulinho@email.com', 'paulo123', CURRENT_TIMESTAMP),
  ('u003', 'José Carlos', 'carlao@email.com', 'car123', CURRENT_TIMESTAMP);


CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('p001', 'Mouse', 17.90, 'Muito bom', 'www'),
  ('p002', 'Teclado', 122.90, 'Básico', 'www'),
  ('p003', 'Fone', 59.90, 'Sem fio', 'www'),
  ('p004', 'Cabo HDMI', 15.90, '3m', 'www'),
  ('p005', 'Monitor', 1799.90, 'HD', 'www');

  SELECT * FROM users;
  SELECT * FROM products;


  SELECT * FROM products WHERE name LIKE '%Mouse%';

INSERT INTO users (id, name, email, password, created_at)
VALUES 
  ('u004', 'Jairo', 'jairo@email.com', 'jairo123', CURRENT_TIMESTAMP);

CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('p006', 'Controle Remoto', 50.00, 'Teclas coloridas', 'www');

DELETE FROM users
WHERE id = 'u001';

DELETE FROM products
WHERE id = 'p001';

UPDATE products
SET
	id = 'p010',
  name = 'Teclado luminoso',
  price = 199.00,
  description = 'Teclado com led',
  image_url = 'wwwwwwww'
WHERE id = 'p002';

  DROP TABLE products;

  SELECT * FROM products

  CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users (id)
  );

INSERT INTO purchases (id, buyer, total_price, created_at)
VALUES
  ('c0010', 'u002', 100.00, '09/01/2024'),
  ('c0011', 'u003', 100.00, '09/01/2024'),
  ('c0012', 'u004', 100.00, '09/01/2024'),
  ('c0013', 'u002', 500.00, '09/01/2024');

INSERT INTO purchases (id, buyer, total_price, created_at)
VALUES
  ('c0001', 'u002', 100.00, '09/01/2024'),
  ('c0002', 'u003', 100.00, '09/01/2024'),
  ('c0003', 'u004', 100.00, '09/01/2024'),
  ('c0004', 'u002', 500.00, '09/01/2024');

  DROP TABLE purchases

  INSERT INTO purchases (id, buyer, total_price, created_at)
VALUES
  ('c002', 'u001', 100.00, '09/01/2024');
 

  SELECT * FROM purchases

UPDATE purchases
SET
  total_price = 199,
WHERE id = 'c001';

SELECT
  purchases.id,
  users.id,
  users.name,
  users.email,
  purchases.total_price,
  purchases.created_at
FROM
  purchases
  INNER JOIN users ON users.id = purchases.buyer;

  -- teste INNER
  SELECT
    purchases.total_price,
    users.name
  FROM
    purchases
    INNER JOIN users on purchases.buyer = users.id;

-- RELAÇÕES SQL II

-- EXERCÍCIO 1

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

DROP TABLE purchases_products;

-- EXERCÍCIO 2

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('pur001', 'p001', 3),
    ('pur002', 'p002', 5),
    ('pur002', 'p003', 7);

SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;