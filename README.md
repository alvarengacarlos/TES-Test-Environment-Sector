# TES - Test Environment Sector
## Descrição

O TES é uma plataforma utilizada para criação de ambientes de desenvolvimento na nuvem.

## Requisitos
Estes são os requisitos da aplicação:
- [Serverless Framework versão 3](https://www.serverless.com/framework/docs)
- [Node versão 18](https://nodejs.org/en)
- [NPM versão 9](https://nodejs.org/en)
- [AWS CLI versão 2](https://aws.amazon.com/cli/)

## Implantação
Para realizar a implantação execute o seguinte comando:
```bash
sls deploy --stage dev
```

Para realizar a remoção execute o seguinte comando:
```bash
sls remove --stage dev
```