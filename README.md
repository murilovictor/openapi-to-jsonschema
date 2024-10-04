# Openapi to jsonSchema

O **Openapi to jsonSchema** é uma aplicação desenvolvida em Node.js projetada para baixar os arquivos OpenAPI YAML a
partir de uma URL e converter o responde de cada path em JsonSchema draft 04. Os schemas resultantes serão salvos no
diretório raiz do projeto. Inicialmente, esta aplicação atenderá exclusivamente à conversão de OpenAPIs provenientes do
projeto regulatório Open Insurance Brasil.

## Como Executar

Siga os passos abaixo para executar o projeto:

1. **Baixar as Dependências:**
   ```bash
   npm install

2. **Executar o Serviço:**
   ```bash
   npm run dev

3. **Enviar Requisição cURL:** <br>
   Utilize o cURL para enviar uma requisição POST ao endpoint api/convert-and-download. Certifique-se de fornecer o corpo da
   requisição com a lista de URLs desejadas.
   ```bash
   curl --location --request POST 'localhost:3000/api/convert-and-download' \
   --header 'Content-Type: application/json' \
   --data '[
       {
          "url": "https://raw.githubusercontent.com/br-openinsurance/areadesenvolvedor/main/documentation/source/files/swagger/data_channels.yaml",
          "paths": ["/branches"],
          "methods": ["get"],
          "status": ["200"]
       }
   ]'

4. **Explicação do Request** <br>

| Propriedade | Descrição                                                                       |
|-------------|---------------------------------------------------------------------------------|
| `url`       | URL onde o arquivo Openapi YAML está localizado.                                |
| `paths`     | Paths que deseja extrair. Se for `null`, todos os paths serão considerados.     |
| `methods`   | Métodos que deseja extrair. Se for `null`, todos os métodos serão considerados. |
| `status`    | Status que deseja extrair. Se for `null`, todos os status serão considerados.   |

Exemplo de Request:

```json
[
   {
      "url": "https://raw.githubusercontent.com/br-openinsurance/areadesenvolvedor/main/documentation/source/files/swagger/data_channels.yaml",
      "paths": ["/branches"],
      "methods": ["get"],
      "status": ["200"]
   }
]
```

5. **Faça o donwload do arquivo zip**

## Informações de Contato <br>

Para entrar em contato ou relatar problemas, envie um e-mail
para [murilovictor63@gmail.com](mailto:murilovictor63@gmail.com).

