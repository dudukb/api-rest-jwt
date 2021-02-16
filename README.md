# Descrevendo as alterações

* Primeiro, fiz a remoção da pasta node_modules;
* Tirei o middleware auth da rota de login, assim, o usuário não precisa estar autenticado;
* Alterei todas as rotas com nome 'game' para 'games;
* Rota de criação de game agora retorna o game criado;
* Alterei todas as var no backend para const;
* Coloquei a roda de autenticação como primeira rota no arquivo;
* Coloquei o html dentro da tag body;
* Removi axiosConfig da requisição de login;
* Criei função listGame e chamo ela depois da request de login;
* Adicionei .gitignore;
* Criei função updateList, usado depois de buscar a lista;
* Alterei a rota de createGame;
* Deletar item da lista de jogos depois da requisição  