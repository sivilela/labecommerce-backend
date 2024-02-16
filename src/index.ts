import express, { Request, Response } from "express";
import cors from "cors";
import { TProduct, TUser, TPurchase } from "./types/types";
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

// ENDPOINTS USERS

// getAllUsers
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

// createUsers
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

// deleteUsers
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

// editUsers
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
      res.status(500); 
    }

    if (error instanceof Error) {
      
      res.send(error.message); 
    } else {
      
      res.send("Erro inesperado"); 
    }
  }
});

// ENDPOINTS PRODUCTS

// getAllProducts
app.get("/products", async (req: Request, res: Response) => {
  try {
    const nameToFind = req.query.name as string;

    if (nameToFind === undefined) {
      const result = await db("products");
      return res.status(200).send(result);
    } else {
      if (nameToFind.length < 1) {
        res.status(400);
        throw new Error("'name' inválido. Deve ter no mínimo 1 caractere");
      }
      const result: TProduct[] | undefined[] = await db("products")
        .where("name", "LIKE", `%${nameToFind}%`);
        // .orWhere("description", "LIKE", `%${nameToFind}%`);

      
      return res.status(200).send(result);
    }

    const products: TProduct[] = await db("products");
    res.status(200).send(products);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// createProducts
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

// deleteProducts
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

// editProdutcts
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

// ENDPOINTS PURCHASES 

// getAllPurchases
app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const purchase: Array<TUser> = await db("purchases");
    res.status(200).send(purchase);
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado!");
    }
  }
});

// getPurchaseById
app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const idToSearch = req.params.id;

    if (idToSearch[0] !== "p") {
      res.status(400);
      throw new Error("'id' deve iniciar com 'p'");
    }

    const [purchaseIdAlreadyExists]: TPurchase[] | undefined[] = await db(
      "purchases"
    ).where({ id: idToSearch });

    if (!purchaseIdAlreadyExists) {
      res.status(404);
      throw new Error("'id' não localizado!");
    }

    if (purchaseIdAlreadyExists) {
      const [purchase] = await db
        .select(
          "purchases.id AS purchaseId",
          "users.id AS buyerId",
          "users.name AS buyerName",
          "users.email AS buyerEmail",
          "purchases.total_price AS totalPrice",
          "purchases.created_at AS createdAt"
        )
        .from("purchases")
        .join("users", "purchases.buyer", "=", "users.id")
        .where({ "purchases.id": idToSearch });

      const purchasesProducts = await db
        .select(
          "purchases_products.product_id AS id",
          "products.name AS name",
          "products.price AS price",
          "products.description AS description",
          "products.image_url AS imageUrl",
          "purchases_products.quantity AS quantity"
        )
        .from("purchases_products")
        .join("products", "purchases_products.product_id", "=", "products.id")
        .where({ "purchases_products.purchase_id": idToSearch });

      const purchaseInfo = {
        purchaseId: purchase.purchaseId,
        buyerId: purchase.buyerId,
        buyerName: purchase.buyerName,
        buyerEmail: purchase.buyerEmail,
        totalPrice: purchase.totalPrice,
        createdAt: purchase.createdAt,
        products: purchasesProducts,
      };

      res.status(200).send(purchaseInfo);
      return;
    }
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado!");
    }
  }
});

// deletePurchaseById 
app.delete("/purchases/:id", async (req: Request, res: Response) =>{
  try{
    const idToDelete:string = req.params.id;
    if(!idToDelete){
      res.statusCode = 404;
      throw new Error("'id' é obrigatório!");
    }

    const [compra] = await db("purchases").where({id: idToDelete});

    if(!compra){
      res.statusCode = 404;
      throw new Error("'id' - compra inexistente, verifique o 'id' digitado!");
    }

    await db("purchases").del().where({id: idToDelete});

    res.status(200).send("Pedido deletado com sucesso!");
  }catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado!");
    }
  }
});


