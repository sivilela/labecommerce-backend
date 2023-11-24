import { TProducts, TUser } from "./types/types";

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

export const products: TProducts[] = [
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
