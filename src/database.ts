import { TProduct, TUser } from "./types/types";

export const users: TUser[] = [
  {
    id: "u001",
    name: "Fulano",
    email: "fulano@email.com",
    password: "senha123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u002",
    name: "Maria",
    email: "maria@email.com",
    password: "senhadamaria123",
    createdAt: new Date().toISOString(),
  },
];

export const products: TProduct[] = [
  {
    id: "prod001",
    name: "Mouse",
    price: 250,
    description: "Melhor mouse do mercado!",
    imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400"
  },
  {
    id: "prod002",
    name: "Monitor",
    price: 900,
    description: "Monitor LED Full HD 24 polegadas",
    imageUrl: "https://picsum.photos/seed/Monitor/400"
  },
];

export const createUser = (id: string, name: string, email: string, password: string): string =>{
  const newUser: TUser = {
    id: id,
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  return "Cadastro realizado com sucesso"
} 


export const getAllUsers = (): TUser[] => {
  return users
}

// getAllUsers()
export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string) => {
  const newProduct: TProduct = {
    id: id,
    name: name,
    price: price,
    description: description,
    imageUrl: imageUrl
  }
  products.push(newProduct)
  return "Cadastro realizado com sucesso"
}

export const getAllProducts = (): TProduct[] => {
  return products
}

// getAllProducts()
export const searchProducts = (name: string): TProduct[] => {
  return products.filter((product) =>{
    return product.name.toLowerCase().includes(name.toLowerCase())
    })
  };




