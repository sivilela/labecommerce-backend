"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProdutcsByName = exports.getAllProducts = exports.createProduct = exports.products = exports.getAllUsers = exports.createUser = exports.users = void 0;
exports.users = [];
const createUser = (id, name, email, password) => {
    const newUser = {
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    exports.users.push(newUser);
    return "Cadastro realizado com sucesso";
};
exports.createUser = createUser;
const getAllUsers = () => {
    return exports.users;
};
exports.getAllUsers = getAllUsers;
// getAllUsers()
exports.products = [];
const createProduct = (id, name, price, description, imageUrl) => {
    const newProduct = {
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl
    };
    exports.products.push(newProduct);
    return "Cadastro realizado com sucesso";
};
exports.createProduct = createProduct;
const getAllProducts = () => {
    return exports.products;
};
exports.getAllProducts = getAllProducts;
// getAllProducts()
const searchProdutcsByName = (name) => {
    return exports.products.filter((product) => {
        return product.name.toLowerCase().includes(name.toLowerCase());
    });
};
exports.searchProdutcsByName = searchProdutcsByName;
// export const users: TUser[] = [
//   {
//     id: "u001",
//     name: "Fulano",
//     email: "fulano@email.com",
//     password: "senha123",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "u002",
//     name: "Maria",
//     email: "maria@email.com",
//     password: "senhadamaria123",
//     createdAt: new Date().toISOString(),
//   },
// ];
// export const products: TProducts[] = [
//   {
//     id: "prod001",
//     name: "Mouse",
//     price: 250,
//     description: "Melhor mouse do mercado!",
//     imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400"
//   },
//   {
//     id: "prod002",
//     name: "Monitor",
//     price: 900,
//     description: "Monitor LED Full HD 24 polegadas",
//     imageUrl: "https://picsum.photos/seed/Monitor/400"
//   },
// ];
