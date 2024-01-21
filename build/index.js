"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./database/knex");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get('/ping', (req, res) => {
    res.send('PongPong!');
});
// Get All Users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield knex_1.db.raw(`SELECT * FROM users`);
        res.status(200).send(usuarios);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        res.send("Erro inesperado");
    }
}));
// Get All Products
// app.get("/products", (req: Request, res: Response) => {
//     res.send(products)
// })
// Get All Products com query
app.get("/products", (req, res) => {
    const nameToFind = req.query.name;
    console.log(nameToFind);
    if (nameToFind) {
        const result = database_1.products.filter((product) => {
            return product.name.toLowerCase().includes(nameToFind.toLowerCase());
        });
        res.status(200).send(result);
    }
    else {
        res.status(200).send(database_1.products);
    }
});
// Create User
app.post("/users", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
    };
    database_1.users.push(newUser);
    res.status(201).send("Cadastro realizado com sucesso");
});
// Create Product
app.post("/products", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.pricce;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const newProduct = {
        id,
        name,
        price,
        description,
        imageUrl
    };
    database_1.products.push(newProduct);
    res.status(201).send("Produto cadastrado com sucesso");
});
// createUser("u001", "Maria", "maria@email.com", "00000")
// createUser("u002", "Zé", "ze@email.com", "111")
// createUser("u003", "Mario", "mario@email.com", "546546")
// createProduct("p001", "PC", 1000, "Esse é do bom", "www.google.com")
// createProduct("p002", "monitor", 500, "Esse também é do bom", "www.google.com")
// createProduct("p002", "PC", 100, "Esse é o melhor", "www.google.com")
// console.log(searchProductsByName("PC"));
// getAllUsers()
// getAllProducts()
// console.table(users);
// console.log("\n\n");
// console.table(products);
// deleteUserById
app.delete("/users/:id", (req, res) => {
    const idToDelete = req.params.id;
    const userIndex = database_1.users.findIndex((user) => {
        return user.id === idToDelete;
    });
    if (userIndex >= 0) {
        database_1.users.splice(userIndex, 1);
    }
    res.status(200).send("User apagado com sucesso");
});
// deleteProductById
app.delete("/products/:id", (req, res) => {
    const idToDelete = req.params.id;
    const productIndex = database_1.products.findIndex((product) => product.id === idToDelete);
    if (productIndex >= 0) {
        database_1.products.splice(productIndex, 1);
    }
    res.status(200).send("Produto apagado com sucesso");
});
// editProductById
app.put("/products/:id", (req, res) => {
    const idToEdit = req.params.id;
    const newId = req.body.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newDescription = req.body.description;
    const newImageUrl = req.body.imageUrl;
    const result = database_1.products.find((product) => product.id === idToEdit);
    if (result) {
        result.id = newId || result.id;
        result.name = newName || result.name;
        result.price = newPrice || result.price;
        // result.price = isNaN(Number(newPrice)) ? result.price : newPrice as number
        result.description = newDescription || result.description;
        result.imageUrl = newImageUrl || result.imageUrl;
    }
    res.status(200).send("Produto atualizado com sucesso");
});
// Fluxo de dados no Backend
// DAVI
//USERS ENDPOINTS
app.get("/users", (req, res) => {
    try {
        res.status(200).send(database_1.users);
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        // res.send(err instanceof Error) Do feedback
        res.send("Erro inesperado"); //Do texto que o Davi me mandou
    }
});
app.post("/users", (req, res) => {
    try {
        const { id, name, email, password } = req.body;
        if (id === undefined ||
            name === undefined ||
            email === undefined ||
            password === undefined) {
            res.statusCode = 400;
            throw new Error("O body deve corresponder com todos esses atributos: 'id' - 'name' - 'email' - 'password'");
        }
        //verificando se já tem usuário cadastrado com esse ID
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.statusCode = 400;
                throw new Error("'id' - Deve ser um string");
            }
            if (id[0] !== "u") {
                res.status(400);
                throw new Error("O 'id' - deve começar com a letra 'u'");
            }
            const verifyId = database_1.users.find((user) => user.id === id);
            if (verifyId) {
                res.status(400);
                throw new Error("Ja existe um usuario cadastrado com esse 'ID'");
            }
        }
        if (typeof name !== "string") {
            res.status(400);
            throw new Error("'name' - deve ser uma string");
        }
        if (name.length < 2) {
            res.status(400);
            throw new Error("'name' - deve conter mais de 2 caracteres");
        }
        if (typeof email !== "string") {
            res.status(400);
            throw new Error("'email' - deve ser uma string");
        }
        const verifyEmail = database_1.users.find((user) => user.email === email);
        if (verifyEmail !== undefined) {
            res.status(400);
            throw new Error("'email' - email ja foi cadastrado - utilize outro");
        }
        if (typeof password !== "string") {
            res.statusCode = 400;
            throw new Error("'password' - Deve ser do Tipo string");
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            res.statusCode = 400;
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
        }
        (0, database_1.createUser)(id, name, email, password);
        res.status(201).send("Usuario Cadastrado com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
});
app.delete("/users/:id", (req, res) => {
    try {
        const idToDelete = req.params.id;
        const index = database_1.users.findIndex((usuario) => usuario.id === idToDelete);
        if (index < 0) {
            res.statusCode = 404;
            throw new Error("Usuario não encontrado");
        }
        if (index >= 0) {
            database_1.users.splice(index, 1);
        }
        res.status(200).send("Usuario deletado com sucesso");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}); // ✅
app.put("/users/:id", (req, res) => {
    try {
        const idToEdit = req.params.id; // id do usuario
        if (idToEdit === undefined) {
            res.statusCode = 400;
            throw new Error("'id' - paramiters - é obrigatorio para esta operação");
        }
        const buscarUser = database_1.users.find((prod) => prod.id === idToEdit);
        if (buscarUser === undefined) {
            res.statusCode = 404;
            throw new Error("Usuario não encontrado");
        }
        const { id, name, email, password } = req.body;
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.statusCode = 400;
                throw new Error("'id' - Deve ser em formato string");
            }
        }
        if (name !== undefined) {
            if (typeof name !== "string") {
                res.statusCode = 400;
                throw new Error("'name' - Deve ser em formato string");
            }
            if (name.length < 2) {
                res.statusCode = 400;
                throw new Error("'name' - deve conter mais de 2 caracteres");
            }
        }
        if (email !== undefined) {
            if (typeof email !== "string") {
                res.statusCode = 400;
                throw new Error("'email' - Deve ser em formato string");
            }
            if (!email.includes("@")) {
                res.statusCode = 400;
                throw new Error("'email' - Deve incluir o @ ex: fulano@email.com");
            }
        }
        if (password !== undefined) {
            if (typeof password !== "string") {
                res.statusCode = 400;
                throw new Error("'password' - Deve ser em formato string");
            }
            if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
                res.statusCode = 400;
                throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
            }
        }
        const newUser = database_1.users.find((usuario) => usuario.id === idToEdit);
        if (newUser) {
            newUser.id = id || newUser.id;
            newUser.name = name || newUser.name;
            newUser.email = email || newUser.email;
            newUser.password = password || newUser.password;
        }
        res.status(201).send("Informações atualizadas com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
    }
}); // ✅
//USERS ENDPOINTS - FIM
//PRODUCTS ENDPOINTS *************** ESTÁ RETORNANDO TODOS OS PRODUTOS, QUANDO DEVERIA ENTRAR A MENSAGEM - "'name' - query params deve possuir pelo menos um caractere"
app.get("/products", (req, res) => {
    //VER TODOS OS PRODUTOS
    try {
        const name = req.query.name;
        if (name !== undefined) {
            if (name.length < 1) {
                res.statusCode = 400;
                throw new Error("'name' - query params deve possuir pelo menos um caractere");
            }
            res.status(200).send((0, database_1.searchProducts)(name));
        }
        res.status(200).send(database_1.products);
    }
    catch (err) {
        if (req.statusCode === 200) {
            req.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
});
app.post("/products", (req, res) => {
    //CADASTRO DE NOVOS PRODUTOS
    try {
        const { id, name, price, description, imageUrl } = req.body;
        if (id === undefined ||
            name === undefined ||
            price === undefined ||
            description === undefined ||
            imageUrl === undefined) {
            res.statusCode = 400;
            throw new Error("O body deve corresponder com todos esses atributos: 'id' - 'name' - 'price' - 'description' - 'imageUrl'");
        }
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.statusCode = 400;
                throw new Error("'id' - Precisa ser uma string");
            }
            if (!id.includes("prod")) {
                res.statusCode = 400;
                throw new Error("'id' - Precisa corresponder ao padrão: 'prod000'");
            }
            const duplicatedProduct = database_1.products.find((prod) => prod.id === id);
            if (duplicatedProduct !== undefined) {
                res.statusCode = 400;
                throw new Error("'id' - ja existe um produto cadastrado com esse id");
            }
        }
        if (typeof name !== "string") {
            res.statusCode = 400;
            throw new Error("'name' - Precisa ser uma string");
        }
        if (name.length < 2) {
            res.statusCode = 400;
            throw new Error("'name' - Precisa ter mais de 2 caracteres");
        }
        if (typeof price !== "number") {
            res.statusCode = 400;
            throw new Error("'price' - Deve ser enviado como um number");
        }
        if (typeof description !== "string") {
            res.statusCode = 400;
            throw new Error("'description' - Deve ser uma string");
        }
        if (typeof imageUrl !== "string") {
            res.statusCode = 400;
            throw new Error("'imageUrl' - Deve ser uma string");
        }
        (0, database_1.createProduct)(id, name, price, description, imageUrl);
        res.status(201).send("Produto cadastrado com sucesso!");
    }
    catch (err) {
        if (req.statusCode === 200) {
            req.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
});
app.delete("/products/:id", (req, res) => {
    //DELETAR PRODUTOS
    try {
        const idToDelete = req.params.id;
        const index = database_1.products.findIndex((produto) => produto.id === idToDelete);
        if (index < 0) {
            res.statusCode = 404;
            throw new Error("Produto não encontrado no sistema");
        }
        if (index >= 0) {
            database_1.products.splice(index, 1);
        }
        res.status(200).send("Produto deletado com sucesso");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
});
app.put("/products/:id", (req, res) => {
    //EDIÇÃO DE PRODUTOS
    try {
        const idToEdit = req.params.id; // id do produto
        const buscar = database_1.products.find((prod) => prod.id === idToEdit);
        if (buscar === undefined) {
            res.statusCode = 404;
            throw new Error("Produto não encontrado");
        }
        const { id, name, price, description, imageUrl } = req.body;
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.statusCode = 400;
                throw new Error("'id' - Deve ser em formato string");
            }
        }
        if (name !== undefined) {
            if (typeof name !== "string") {
                res.statusCode = 400;
                throw new Error("'name' - Deve ser em formato string");
            }
        }
        if (price !== undefined) {
            if (typeof price !== "number") {
                res.statusCode = 400;
                throw new Error("'price' - Deve ser em formato number");
            }
        }
        if (description !== undefined) {
            if (typeof description !== "string") {
                res.statusCode = 400;
                throw new Error("'description' - Deve ser em formato string");
            }
        }
        if (imageUrl !== undefined) {
            if (typeof imageUrl !== "string") {
                res.statusCode = 400;
                throw new Error("'imageUrl' - Deve ser em formato string");
            }
        }
        const novoProduto = database_1.products.find((usuario) => usuario.id === idToEdit);
        if (novoProduto) {
            novoProduto.id = id || novoProduto.id;
            novoProduto.name = name || novoProduto.name;
            novoProduto.description = description || novoProduto.description;
            novoProduto.price = price || novoProduto.price;
            novoProduto.imageUrl = imageUrl || novoProduto.imageUrl;
        }
        res.status(200).send("Informações atualizadas com sucesso!");
    }
    catch (err) {
        if (res.statusCode === 200) {
            res.statusCode = 500;
        }
        if (err instanceof Error) {
            res.send(err.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
});
//PRODUCTS ENDPOINTS - FIM
