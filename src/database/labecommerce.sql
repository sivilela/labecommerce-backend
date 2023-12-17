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

  -- SELECT * FROM products WHERE name LIKE 'Mouse%';

  DROP TABLE products;