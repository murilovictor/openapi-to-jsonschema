import {Request, Response} from 'express';
import OpenApiYAMLToJsonSchema from "../services/OpenApiYAMLToJsonSchemaService";
import {OpenapiRequestModel} from "../model/OpenapiRequestModel";

class OpenApiToJsonSchemaController {
    async downloadOpenApiFileAndConvertToJsonSchema(req: Request, res: Response): Promise<void> {
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
        res.status(200).json({message: 'Successful'});
    }
}

export default new OpenApiToJsonSchemaController();
