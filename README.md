# Openapi to jsonSchema

O **Openapi to jsonSchema**é uma aplicação Node.js projetada para baixar os arquivos OpenAPI YAML e convertê-los em JsonSchema draft 04 . Os schemas resultantes serão salvos no diretório raiz do projeto. Inicialmente, esta aplicação atenderá exclusivamente à conversão de OpenAPIs provenientes do projeto regulatório Open Insurance Brasil.

## Como Executar

Siga os passos abaixo para executar o projeto:

1. **Baixar as Dependências:**
   ```bash
   npm install
   
2. **Executar o Serviço:**
   ```bash
   npm run dev
   
3. **Enviar Requisição cURL:** <br>
   Utilize o cURL para enviar uma requisição POST ao endpoint /api/process. Certifique-se de fornecer o corpo da requisição com a lista de URLs desejadas.
   ```bash
   curl --location --request POST 'localhost:3000/api/process' \
    --header 'Content-Type: application/json' \
    --data '{
    "urls": [
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/customers.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-acceptance-and-branches-abroad.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-auto.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-financial-risk.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-housing.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-patrimonial.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-responsibility.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-rural.yaml",
    "https://br-openinsurance.github.io/areadesenvolvedor/files/swagger/insurance-transport.yaml"
    ]
    }'

4. **Os arquivos serão gerados no diretorio raiz do projeto**

## Informações de Contato <br>
Para entrar em contato ou relatar problemas, envie um e-mail para [murilovictor63@gmail.com](mailto:murilovictor63@gmail.com).

