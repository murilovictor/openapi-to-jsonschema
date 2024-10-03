import {Request, Response} from 'express';
import OpenApiYAMLToJsonSchema from "../services/OpenApiYAMLToJsonSchemaService";
import {OpenapiRequestModel} from "../model/OpenapiRequestModel";
import CallServicePhaseOne from "../services/CallServicePhaseOne";
import Ajv from "ajv";
import {ValidationItem} from "../model/ValidationItem";

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

export default new OpenApiToJsonSchemaController();
