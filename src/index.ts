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


// deleteUserById
app.delete("/users/:id", (req: Request, res: Response) => {
  const idToDelete = req.params.id;

  const userIndex: number = users.findIndex((user) => {
    return user.id === idToDelete
  });

  if (userIndex >= 0) {
    users.splice(userIndex, 1);
  }
  res.status(200).send("User apagado com sucesso");
});

// deleteProductById
app.delete("/products/:id", (req: Request, res: Response) => {
  const idToDelete = req.params.id;

  const productIndex: number = products.findIndex((product) => product.id === idToDelete);

  if (productIndex >= 0) {
    products.splice(productIndex, 1);
  }
  res.status(200).send("Produto apagado com sucesso");
});

// editProductById
app.put ("/products/:id", (req: Request, res: Response) => {
  const idToEdit = req. params.id

  const newId = req.body.id as string | undefined
  const newName = req.body.name as string | undefined
  const newPrice = req.body.price as number | undefined
  const newDescription = req.body.description as string | undefined
  const newImageUrl = req.body.imageUrl as string | undefined

  const result = products.find((product) => product.id === idToEdit)

  if (result) {
      result.id = newId || result.id
      result.name = newName || result.name
      result.price = newPrice || result.price
      // result.price = isNaN(Number(newPrice)) ? result.price : newPrice as number
      result.description = newDescription || result.description
      result.imageUrl = newImageUrl || result.imageUrl
  }
  res.status(200).send("Produto atualizado com sucesso")
})