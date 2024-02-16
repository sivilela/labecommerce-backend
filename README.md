# Labecommerce Backend

Backend do LabEcommerce, trata-se de uma aplicação de e-commerce.

## Descrição

O Labecommerce é uma plataforma e-commerce para gerenciar usuários, produtos e compras. 
Estes endpoints realizam operações CRUD (Create, Read, Update, Delete) em usuários, produtos e compras.

## Documentação:
- **Postman**
- **https://documenter.getpostman.com/view/29994356/2sA2r6Y5AF**

### ENDIPOINTS

## USUÁRIOS

### Lista Todos os Usuários

- **Método:** GET
```
/users
```
- **Descrição:** Retorna a lista de todos os usuários cadastrados.

### Cria Novo Usuário

- **Método:** POST
```
/users
```
- **Descrição:** Cria um novo usuário.

### Atualiza Usuário

- **Método:** PUT
```
/users
```
- **Descrição:** Atualiza as informações do usuário correspondente ao Id fornecido.

### Deleta Usuário

- **Método:** DELETE
```
/users/:id
```
- **Descrição:** Deleta o usuário correspondente ao Id fornecido.


## PRODUTOS

### Lista Todos os Produtos

- **Método:** GET
```
/products
```
- **Descrição:** Retorna a lista de todos os produtos cadastrados.

### Cria Novo Produto

- **Método:** POST
```
/products
```
- **Descrição:** Cria um novo produto com base nos dados fornecidos.

### Atualiza Produto

- **Método:** PUT
```
/products/:id
```
- **Descrição:** Atualiza as informações do produto correspondente ao Id fornecido.

### Deleta Produto

- **Método:** DELETE
```
/products/:id
```
- **Descrição:** Deleta o produto correspondente ao ID fornecido.

## COMPRAS

### Lista Todas as compras

- **Método:** GET
```
/purchases
```
- **Descrição:** Retorna a lista de todas as compras.

### Deleta Compra

- **Método:** DELETE
```
/purchases/:id
```
- **Descrição:** Deleta a compra correspondente ao Id fornecido.


## Desenvolvido por Simone Vilela

