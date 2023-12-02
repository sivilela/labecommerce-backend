import { log } from "console";
import { createProduct, createUser, getAllProducts, getAllUsers, products, searchProdutcsByName, users } from "./database";

createUser("u001", "Maria", "maria@email.com", "00000")
createUser("u002", "Zé", "ze@email.com", "111")
createUser("u003", "Mario", "mario@email.com", "546546")

// createProduct("p001", "PC", 1000, "Esse é do bom", "www.google.com")
// createProduct("p002", "monitor", 500, "Esse também é do bom", "www.google.com")
// createProduct("p002", "PC", 100, "Esse é o melhor", "www.google.com")

// console.log(searchProdutcsByName("PC"));

// getAllUsers()
// getAllProducts()

console.table(users);
// console.log("\n\n");

// console.table(products);
