import { log } from "console";
import { createProduct, createUser, getAllProducts, getAllUsers, products, searchProducts, users } from "./database";
import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TUser } from "./types/types";
import { db } from "./database/knex";

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('PongPong!')
})

// Endpoints users

// Get All users
app.get("/users", async (req: Request, res: Response) => {
  try {
  const usuarios: Array<TUser> = await db.raw(`SELECT * FROM users`);    
    res.status(200).send(usuarios);
    
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Create user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const {id, name, email, password} = req.body;

    //validar o body
    if(id === undefined || name === undefined || email === undefined || password === undefined){
      res.status(400);
      throw new Error ("O body precisa ter todos esses atributos: 'id', 'name', 'email' e 'password'")
    }

    if (id !== undefined){
      if(typeof id !== "string"){
        res.statusCode = 400;
        throw new Error('O atributo "id" deve ser uma string');
      }
      if(id[0] !== "u"){
        res.statusCode = 400;
        throw new Error("O 'id' do usuário deve começar com a letra 'u'");
      }
      if(typeof name !== "string"){
        res.statusCode = 400;
        throw new Error ("O 'name' do usuário deve ser uma string");
      }
      if(name.length < 2){
        res.statusCode=400;
        throw new Error("O 'name' do usuário deve conter no mínimo 2 caracteres");
      }
      if(typeof email !== "string"){
        res.statusCode = 400;
        throw new Error ("O 'email' do usuário deve ser uma 'string'");
      }
      if(typeof password !== "string"){
        res.statusCode = 400;
        throw new Error ("O 'password' do usuário deve ser uma 'string'");
      }
    }
    const data = new Date().toISOString();

    await db.raw(`
    INSERT INTO users(id, name, email, password, created_at)
    VALUES
    ("${id}", "${name}", "${email}", "${password}", '${data}');
    `);
    res.status(201).send("Cadastro do usuário realizado com sucesso!");

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Delete users
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete: string = req.params.id;

    const [user] = await db.raw(`SELECT * from users;`)
    if (!user) {
      res.status(404);
      throw new Error("Usuário não encontrado, digite um id válido!");
    }

    await db.raw(`
    DELETE FROM users
    WHERE
    id = '${idToDelete}'
    `);   
    res.status(200).send("Usuário apagado com sucesso!");

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Edit users
app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToEdit: string = req.params.id;

    const id = req.body.id as string;
    const name = req.body.name as string;
    const email = req.body.email as string;
    const password = req.body.password as string;

    const [putUser] = await db.raw(`
      SELECT * FROM users
      WHERE id = "${idToEdit}"
    `);

    if (putUser < 0) {
      res.status(404);
      throw new Error("Usuário não encontrado");
    }

    const query: Array<string> = [];

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' inválido. Deve ser uma string");
      }
      const resultUser = users.find((user) => user.id === id);
      if (resultUser) {
        res.status(400);
        throw new Error("Esse id já existe");
      }
      query.push(`id = "${id}"`);
    }

    if (name !== undefined) {
      if (typeof name !== "string") {
        res.status(400);
        throw new Error("'name' inválido. Deve ser uma string");
      }
      if (name.length < 2) {
        res.status(400);
        throw new Error("'name' inválido. Deve ter no mínimo 2 caracteres");
      }
      query.push(`name = "${name}"`);
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        res.status(400);
        throw new Error("'email' inválido. Deve ser uma string");
      }
      const resultEmail = users.find((user) => user.email === email);
      if (resultEmail) {
        res.status(400);
        throw new Error("Esse e-mail já existe");
      }
      query.push(`email =  "${email}"`);
    }

    if (password !== undefined) {
      if (typeof password !== "string") {
        res.statusCode = 400;
        throw new Error("'password' inválido. Deve ser uma string");
      }
      if (
        !password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
        )
      ) {
        res.statusCode = 400;
        throw new Error(
          "'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas, no mínimo um número e um caractere especial"
        );
      }
      query.push(`password = "${password}"`);
    }

    const newQuery: string = query.join(", ");
    console.log(newQuery);

    await db.raw(`
      UPDATE users
      SET ${newQuery}
      WHERE id = "${idToEdit}"
    `);
    res.status(201).send("Informações atualizadas com scesso!");
  } catch (error) {
    if (res.statusCode === 200) {
      // se acima der resultado o status 200 (que não deu erro), como ele vai ser pego no catch, tem que alterar de 200 para 500
      res.status(500); //erro inesperado
    }

    if (error instanceof Error) {
      //se der o erro 400
      res.send(error.message); // manda a mensagem
    } else {
      // senão for uma instância do erro 400, manda
      res.send("Erro inesperado"); // a mensagem do erro 500
    }
  }
});

// Endpoints products

// Get All Products
// Deve possuir pelo menos um caractere
app.get("/products", async (req: Request, res: Response) => {
  try {
    const productToFind = req.query.name as string;

    if (productToFind !== undefined) {
      if (productToFind.length < 1) {
        res.status(400);
        throw new Error ("A busca deve ter ao menos um caractere")
      }

      const search: Array<TProduct> | undefined = await db.raw(`SELECT * FROM products WHERE name LIKE '%${productToFind}%'`);

       return res.status(200).send(search);
    }

    const products: Array<TProduct> | undefined = await db.raw(`SELECT * FROM products`);
    res.status(200).send(products);
    
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Create Product
app.post("/products", async (req: Request, res: Response) => {
  try {
    const {id, name, price,description, imageUrl} = req.body;

    const newProduct: TProduct = {
      id,
      name,
      price,
      description,
      imageUrl
    };

    if(id === undefined || name === undefined || price === undefined || description === undefined || imageUrl === undefined) {
      res.status(400);
      throw new Error("O body do product precisa ter todos esses atributos: 'id', 'name', 'price', 'description', 'imageUrl'");
    }

    if(id !== undefined){
      if(typeof id !== "string"){
        res.status(400)
        throw new Error ("'Id' precisa ser uma string")
      }

      if(!id.includes("prod")){
        res.status(400)
        throw new Error("O id deve começar com a letra 'p'")
      }
      const idProductsExist = await db.raw(`SELECT * FROM products WHERE id = '${id}'`);

    if (idProductsExist) {
      res.status(400);
      throw new Error(
        "Já existe um product com esse id. Cadastre com outro id."
      );
    }
    } 

    if(typeof name !== 'string'){
      res.status(400)
      throw new Error("'name' deve ser do tipo string")
    }

    if(name.length<2) {
      res.status(400);
      throw new Error("Nome deve ter mais de 2 caracteres");
    }

    if(typeof price !== 'number'){
      res.status(400);
      throw new Error("'price' deve ser do tipo number")
    }
    if(typeof description !== 'string'){
      res.status(400);
      throw new Error("'description' deve ser do tipo string")
    }

    if(typeof imageUrl !== 'string'){
      res.status(400);
      throw new Error("'imageUrl' deve ser do tipo string")
    }

    await db.raw(`
    INSERT INTO products(id, name, price, description, imageUrl)
    VALUES
    ("${newProduct}');
    `);
    res.status(201).send("Produto cadastrado com sucesso!");

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Delete product
app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const productToDelete: string = req.params.id;

    const [product] = await db.raw(`SELECT * from products;`)

    if (!product) {
      res.status(404);
      throw new Error("Produto não encontrado, digite um id válido!");
    }

    await db.raw(`
    DELETE FROM products
    WHERE
    id = '${productToDelete}'
    `);   
    res.status(200).send("Produto apagado com sucesso!");

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// Edit produtct
app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const productToEdit = req.params.id;

    const {id, name, price, description, imageUrl} = req.body;
    
    //Verificando a existência do usuário
    const product = await db.raw(`SELECT * FROM products WHERE id ='${productToEdit}'`)

    if (product === undefined) {
      res.status(404);
      throw new Error("Não foi possível editar o produto, ID não encontrado");
    } 
    
    if(id !== undefined){
      if(typeof id !== 'string'){
        res.status(400);
        throw new Error("'id' deve ser do tipo string")
      }
    }
    if(name !== undefined){
      if(typeof name !== 'string'){
        res.status(400);
        throw new Error("'name' deve ser do tipo string")
      }
    }
    if(price !== undefined){
      if(typeof price !== 'number'){
        res.status(400);
        throw new Error("'price' deve ser do tipo number")
      }
    }
    if(description !== undefined){
      if(typeof description !== 'string'){
        res.status(400);
        throw new Error("'description' deve ser do tipo string")
      }
    }
    if(imageUrl !== undefined){
      if(typeof imageUrl !== 'string'){
        res.status(400);
        throw new Error("'imageUrl' deve ser do tipo string")
      }
    }  
    
    if (product) {
      product.id = id || product.id;
      product.name = name || product.name;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.price = price || product.price;
    }

    res.status(200).send("Atualização dos dados realizada com sucesso!");

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});


