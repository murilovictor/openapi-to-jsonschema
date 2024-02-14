import {Request, Response} from 'express';
import OpenApiYAMLToJsonSchema from "../services/OpenApiYAMLToJsonSchemaService";

class OpenApiToJsonSchemaController {
    async downloadOpenApiFileAndConvertToJsonSchema(req: Request, res: Response): Promise<void> {
        const {urls} = req.body;

        for (const url of urls) {
            try {
                console.log(`Start processing: ${url}`)
                await OpenApiYAMLToJsonSchema.downloadOpenApiFileAndConvertToJsonSchema(url);
                console.log(`End processing: ${url}`)
            } catch (error) {
                console.error(`Error on convert openapi to jsonSchema - url: ${url}:`, error);
            }
        }
        res.status(200).json({message: 'Successful'});
    }
}

export default new OpenApiToJsonSchemaController();
