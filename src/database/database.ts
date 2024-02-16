import { TProduct, TUser } from "../types/types";

export const users: TUser[] = [
  {
    id: "u001",
    name: "Joãp",
    email: "joao@email.com",
    password: "joao123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u002",
    name: "Maria",
    email: "maria@email.com",
    password: "maria123",
    createdAt: new Date().toISOString(),
  },
];

export const products: TProduct[] = [
  {
    id: "prod001",
    name: "Mouse",
    price: 100,
    description: "Melhor mouse",
    imageUrl: "www",
  },
  {
    id: "prod002",
    name: "Monitor",
    price: 1200,
    description: "Monitor full hd",
    imageUrl: "www",
  },
];