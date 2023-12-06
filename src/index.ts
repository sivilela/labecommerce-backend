import { log } from "console";
import { createProduct, createUser, getAllProducts, getAllUsers, products, searchProdutcsByName, users } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct } from "./types/types";

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('PongPong!')
})

// Get All Users
app.get("/users", (req: Request, res: Response) => {
  res.send(users);
});

// Get All Products
// app.get("/products", (req: Request, res: Response) => {
//     res.send(products)
// })

// Get All Products com query
app.get("/products", (req: Request, res: Response) => {
  const nameToFind = req.query.name as string;
  console.log(nameToFind);

  if (nameToFind) {
    const result: TProduct[] = products.filter((product) => {
      return product.name.toLowerCase().includes(nameToFind.toLowerCase());
    });
    res.status(200).send(result);
  } else {
    res.status(200).send(products);
  }
});

// Create User
app.post("/users", (req: Request, res: Response) => {
  const id = req.body.id as string;
  const name = req.body.name as string;
  const email = req.body.email as string;
  const password = req.body.password as string;

  const newUser = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser)
  res.status(201).send("Cadastro realizado com sucesso");
});

// Create Product
app.post("/products", (req: Request, res: Response) => {
  const id = req.body.id as string;
  const name = req.body.name as string;
  const price = req.body.pricce as number;
  const description = req.body.description as string;
  const imageUrl = req.body.imageUrl as string

  const newProduct = {
    id,
    name,
    price,
    description,
    imageUrl
  };

  products.push(newProduct)
  res.status(201).send("Produto cadastrado com sucesso");
});

// createUser("u001", "Maria", "maria@email.com", "00000")
// createUser("u002", "Zé", "ze@email.com", "111")
// createUser("u003", "Mario", "mario@email.com", "546546")

// createProduct("p001", "PC", 1000, "Esse é do bom", "www.google.com")
// createProduct("p002", "monitor", 500, "Esse também é do bom", "www.google.com")
// createProduct("p002", "PC", 100, "Esse é o melhor", "www.google.com")

// console.log(searchProdutcsByName("PC"));

// getAllUsers()
// getAllProducts()

// console.table(users);
// console.log("\n\n");

// console.table(products);
