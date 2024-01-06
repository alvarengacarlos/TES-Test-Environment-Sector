# TES - Test Environment Sector
# Backend
## Descrição

O TES é uma plataforma utilizada para criação de ambientes de desenvolvimento na nuvem.

## Requisitos
Estes são os requisitos da aplicação:
- [Serverless Framework versão 3](https://www.serverless.com/framework/docs)
- [Node versão 18](https://nodejs.org/en)
- [NPM versão 9](https://nodejs.org/en)
- [AWS CLI versão 2](https://aws.amazon.com/cli/)
- Linux

## Implantação
Para realizar a implantação siga os seguintes passos:
- Execute o comando abaixo para configurar a variável de ambiente `DATABASE_URL`. Lembre-se de substituir os valores `USERNAME`, `PASSWORD`, `HOST` e `DATABASE_NAME`:
```bash
export DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE_NAME
# exemplo: 'mongodb+srv://root:rootpw@mongo-atlas.com/tes'
```

- Execute o comando abaixo para criar as migrações no banco de dados:
```bash
rm -r node_modules && \
npm install && \
npm run migrate
```

- Execute o comando abaixo para implantar a aplicação. Não se esqueça de configurar o parâmetro `databaseUrl` com o mesmo valor utilizado na variável de ambiente `DATABASE_URL`:
```bash
rm -r dist && \
npm run build && \
sls deploy --stage dev --param="databaseUrl=mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE_NAME"
# exemplo de databaseUrl: "databaseUrl=mongodb+srv://root:rootpw@mongo-atlas.com/tes"
```

Para realizar a remoção execute o seguinte comando:
```bash
sls remove --stage dev --param="databaseUrl=mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE_NAME"
```
