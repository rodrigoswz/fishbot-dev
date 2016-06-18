![](http://i.imgur.com/RyhRoqK.png)
## FISHBOT

> Projeto de um aquário semi-automatizado com controle e monitoramento remoto

### Possui atualmente as seguintes funções

* Agendamento de horário para os quatro dispositivos, iluminação e alimentação
* Upload dos dados para o [Firebase](https://fishbot.firebaseio.com)
* Tabela com auto-update de acordo com os dados do banco de dados
* Controle manual de todos os dispositivos
* Painel com temperatura e nível da água nos dois recipientes

### Para fazer o programa funcionar

```sh
npm install -g gulp bower && npm install && bower install
```

### Ambiente de desenvolvimento

#### Serve / watch

```sh
gulp serve
```

#### Build & Vulcanize

```sh
gulp
```

Dê esse comando para construir o arquivo de distribuição
