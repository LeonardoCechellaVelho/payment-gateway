# Leonardo Cechella Velho

Projeto para ser aplicado no teste da Doutbox, é uma API de um gateway de pagamentos REST feita em NodeJS, requisições autenticadas com JWT, com o armazenamento de dados feito pelo PostgreSql, tudo isso com o auxílio da biblioteca HerbsJS.

# API de Pagamentos

Um cliente Doutbox requisitou a construção de um gateway de pagamentos, diversas lojas e plaicativos irão integrar seus backends para processar os pagamentos dos seus clientes.

## Rodando o projeto

    $ npm install
    $ npm run knex:migrate
    $ npm start

Você receberá essa mensagem -> 🚀 Server UP and 🌪️  - http://localhost:3000/

# Perguntas Técnicas

### O que é o NPM e sua aplicação dentro do projeto?
NPM é um gerenciador de pacotes, ele é aplicado para instalação de bibliotecas que auxiliam no desenvolvimento do projeto.

### Quais as principais bibliotecas JavaScript que você já trabalhou?
Por possuir mais contato com Angular, as principais foram @angular/material, @angular/router, @angular/forms, porém tive muito contato com rxjs, jquery, moment, express, mongoose e jwt

### Qual a função da biblioteca express?
Ela auxilia com a criação de rotas do sistema, permitindo trabalhar com requisições HTTP

### O que você entende como rotas da aplicação?
Um sistema é composto por rotas, sendo que cada rota tem uma função, retornando uma informação e recebendo uma informação, dependendo do método HTTP, elas possuirão um caminho único, porém cada caminho pode receber vários métodos HTTP. 

### Quando é recomendado utilizar desestruturação?
Desestruturação é bom para criar multiplas variáveis a partir de propriedades de um objeto, auxilia evitando que referências temporárias desse objeto sejam criadas.

### Explique o funcionamento do Babel para aplicação.
Babel permite utilizar os recursos mais atualizados da linguagem mesmo com os navegadores sendo incompatíveis, além de transformar a sintaxe de código.

### Porque devemos utilizar o webpack para aplicações em produção?
Pois é possível organizar o projeto em arquivos separados e gerar um arquivo só de forma automatizada.

### Defina Clean Architecture e sua aplicação no projeto.
Clean Architecture tem como objetivo organizar o código em camadas de modo que a regra de negócio fique separada das outras, separando essas camadas facilita na manutenção da aplicação.

### O que é uma API REST?
API REST é um conjunto de regras da arquitetura para a construção de uma API.

## Licença

- [MIT License](https://github.com/herbsjs/todolist-on-herbs/blob/master/LICENSE)
