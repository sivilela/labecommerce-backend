export type TUser = {
  id: string | number,
  name: string,
  email: string,
  password: string,
  createdAt: string
}

export type TProduct = {
  id: string | number,
  name: string,
  price: number,
  description: string,
  imageUrl: string
}

export type TPurchase = {
  id: string,
  buyer: string,
  totalPrice: number,
  createdAt: string
}

export type TPurchasesProducts = {
  purchase: string,
  productId: string,
  quantity: number
}