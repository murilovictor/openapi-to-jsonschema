import {Request, Response} from 'express';
import OpenApiYAMLToJsonSchema from "../services/OpenApiYAMLToJsonSchemaService";
import {OpenapiRequestModel} from "../model/OpenapiRequestModel";
import CallServicePhaseOne from "../services/CallServicePhaseOne";
import Ajv from "ajv";
import {ValidationItem} from "../model/ValidationItem";
import path from "node:path";
import * as fs from "node:fs";
import archiver from "archiver";

class OpenApiToJsonSchemaController {
    async downloadOpenApiFileAndConvertToJsonSchema(req: Request, res: Response): Promise<void> {
        const zipPath = path.join('tmp', 'output.zip');
        const body = req.body as OpenapiRequestModel[];


        for (const openapiRequestModel of body) {
            try {
                console.log(`Start processing: ${openapiRequestModel}`)
                await OpenApiYAMLToJsonSchema.downloadOpenApiFileAndConvertToJsonSchema(openapiRequestModel);
                console.log(`End processing: ${openapiRequestModel}`)
            } catch (error) {
                console.error(`Error on convert openapi to jsonSchema - url: ${openapiRequestModel}:`, error);
            }
        }

        try {
            // Cria o arquivo ZIP
            await createZip(zipPath);
            console.log("xip pah: ", zipPath)
            console.log("xxxxx: ", process.cwd())

            // Define o cabeçalho de download
            res.setHeader('Content-Disposition', 'attachment; filename="output.zip"');
            res.setHeader('Content-Type', 'application/zip');

            // Envia o arquivo ZIP para o cliente
            const zipStream = fs.createReadStream(zipPath);
            zipStream.pipe(res);

            // Após terminar o download, remove o arquivo ZIP
            zipStream.on('close', () => {
                clearTempDirectory('tmp')
            });

        } catch (error) {
            console.error('Erro ao gerar o arquivo ZIP:', error);
            res.status(500).send('Erro ao gerar o arquivo ZIP.');
        }
    }

    async compare(req: Request, res: Response): Promise<void> {
        const body = req.body as OpenapiRequestModel[];
        const ajv = new Ajv({strictSchema: false, allErrors: true});

        let validations: ValidationItem[] = [];

        for (const openapiRequestModel of body) {
            const validation: ValidationItem = {};

            try {
                console.log(`Start processing: ${openapiRequestModel}`)

                validation.apiName = openapiRequestModel.paths[0]?.replace("/", "");
                const schema = await OpenApiYAMLToJsonSchema.downloadOpenApiFileAndConvertToJsonSchemaAndGet(openapiRequestModel);

                const responseService = await CallServicePhaseOne.callService(openapiRequestModel.urlCompare)

                const isDataValid = ajv.validate(schema, responseService);

                if (isDataValid) {
                    console.log("The ice cream data is valid! 🍨");
                } else {
                    console.error("The ice cream data is invalid:", ajv.errors);
                }

                validation.success = !ajv.errors;
                validation.errors = ajv.errors
            } catch (error) {
                console.error(`Error on convert openapi to jsonSchema - url: ${openapiRequestModel}:`, error);
                validation.success = false
                validation.errors = String(error);
            }
            validations.push(validation)
        }

        res.status(200).json(validations);
    }
}

// Função para criar o arquivo ZIP com os arquivos gerados
const createZip = (outputPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: {level: 9} // Definir o nível de compressão
        });

        output.on('close', () => {
            console.log(`ZIP criado com ${archive.pointer()} bytes`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        // Inicia o processo de arquivamento
        archive.pipe(output);

        // Adiciona os arquivos ao ZIP (substitua pelos caminhos dos arquivos gerados)
        const filesDir = path.join(process.cwd(), 'tmp'); // Usando process.cwd() para acessar a raiz do projeto
        const files = fs.readdirSync(filesDir);

        files.forEach(file => {
            const filePath = path.join(filesDir, file);
            archive.file(filePath, {name: file});
        });

        // Finaliza o arquivamento
        archive.finalize();
    });
};

const clearTempDirectory = (tempDirPath: string): void => {
    try {
        // Lê todos os arquivos no diretório 'temp'
        const files = fs.readdirSync(tempDirPath);

        // Percorre os arquivos e os remove
        files.forEach(file => {
            const filePath = path.join(tempDirPath, file);
            fs.unlinkSync(filePath); // Exclui cada arquivo
        });

        console.log('Todos os arquivos no diretório "temp" foram excluídos.');
    } catch (error) {
        console.error('Erro ao limpar o diretório "temp":', error);
    }
};

export default new OpenApiToJsonSchemaController();
