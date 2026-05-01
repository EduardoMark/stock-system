# Escopo do Sistema

Sistema de controle de estoque com autenticação e histórico de movimentações.

## Requisitos Funcionais (RF)

### Autenticação
[ ] RF01: O sistema deve permitir que os usuários se registrem com um nome, e-mail e senha.
[ ] RF02: O sistema deve permitir que os usuários façam login usando seu e-mail e senha.
[ ] RF03: Sistema deve retornar um token JWT ao autenticar.
[ ] RF04: O sistema deve proteger as rotas de estoque e movimentações, exigindo autenticação.

### Produtos
[ ] RF05: Criar produtos
[ ] RF06: Listar produtos
  - Páginação
  - Filtrar por nome
[ ] RF07: Atualizar produtos 
[ ] RF08: Excluir produtos

### Estoque
[ ] RF09: Registrar movimentações no estoque
[ ] RF10: Cada movimentação deve conter:
  - Tipo (entrada ou saída)
  - Produto
  - Quantidade
  - Data
[ ] RF11: Sistema deve calcular estoque com base nas movimentações registradas.
[ ] RF12: Não permitir estoque negativo.

### Frontend
[ ] RF13: Interface para cadastro e login de usuários.
[ ] RF14: Interface para gerenciamento de produtos (CRUD).
[ ] RF15: Interface para registrar movimentações de estoque.
[ ] RF16: Interface para visualizar o histórico de movimentações e o estoque atual.

## Tecnologias Utilizadas
- Backend: Node.js, Typescript, Fastify, Prisma, JWT
- Frontend: React, Typescript
- Banco de Dados: PostgreSQL