import axios from 'axios';
import * as jsYaml from 'js-yaml';
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";

import openapiSchemaToJsonSchema from 'openapi-schema-to-json-schema'
import {JsonSchemaModel} from "../model/JsonSchemaModel";
import {OpenapiRequestModel} from "../model/OpenapiRequestModel";


class OpenApiYAMLToJsonSchemaService {

    extractRefValues(openAPI: any, openapiRequestModel: OpenapiRequestModel): JsonSchemaModel[] {
        const models: JsonSchemaModel[] = [];

        this.extractRefValue(openAPI, openapiRequestModel)
            .forEach((refValue) => models.push(refValue));

        return models;
    }

    extractSchema(obj: any, fieldName: string): any {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === fieldName) {
                    return obj[key];
                } else if (typeof obj[key] === "object") {
                    const result = this.extractSchema(obj[key], fieldName);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return null;
    }

    extractRefValue(openAPI: any, openapiRequestModel: OpenapiRequestModel): JsonSchemaModel[] {
        const result: JsonSchemaModel[] = [];

        const paths = this.getPathAndApplyFilter(openAPI, openapiRequestModel);

        for (const [pathKey, pathItem] of paths) {
            const methods = this.getMethodsAndApplyFilter(pathItem, openapiRequestModel);
            for (const [methodKey, method] of methods) {
                const responses = this.getResponseAndApplyFilter(method, openapiRequestModel);
                for (const [responseKey, response] of responses) {
                    let extractSchema = this.extractSchema(response.content, "schema");
                    if (extractSchema) {
                        let jsonSchema: JsonSchemaModel = {
                            name: method.operationId,
                            summary: method.summary,
                            description: method.description,
                            statusCode: responseKey,
                            method: methodKey,
                            path: pathKey,
                            schema: extractSchema
                        }
                        result.push(jsonSchema);
                    }
                }
            }
        }
        return result;
    }

    private getResponseAndApplyFilter(method, openapiRequestModel: OpenapiRequestModel): any {
        return Object.entries(method.responses).filter(([responseKey]) => {
            if (openapiRequestModel.status) {
                return openapiRequestModel.status.includes(responseKey);
            }
            return true;
        });
    }

    private getMethodsAndApplyFilter(pathItem, openapiRequestModel: OpenapiRequestModel): any {
        return Object.entries(pathItem).filter(([methodKey]) => {
            if (openapiRequestModel.methods) {
                return openapiRequestModel.methods.includes(methodKey);
            }
            return true;
        });
    }

    private getPathAndApplyFilter(openAPI: any, openapiRequestModel: OpenapiRequestModel): any {
        return Object.entries(openAPI.paths).filter(([pathKey]) => {
            if (openapiRequestModel.paths) {
                return openapiRequestModel.paths.includes(pathKey);
            }
            return true;
        });
    }

    public async downloadOpenApiFileAndConvertToJsonSchema(openapiRequestModel: OpenapiRequestModel): Promise<void> {
        const yamlContent = await this.downloadYaml(openapiRequestModel.url);
        const openApiSchema: any = await this.convertToOpenApiSchema(yamlContent);

        const openApiVersion: string = openApiSchema.info.version

        let schema = await $RefParser.dereference(openApiSchema);

        let jsonSchemaModels = this.extractRefValues(schema, openapiRequestModel);

        console.log(`Converting OpenApi: ${openApiSchema.info.title} - Version: ${openApiVersion}`)

        for (let jsonSchemaModel of jsonSchemaModels) {
            const fileName = `${jsonSchemaModel.name}-${jsonSchemaModel.method}-${jsonSchemaModel.statusCode}-${openApiVersion}.json`;
            let jsonSchema = {
                "type": "object",
                "$schema": "http://json-schema.org/draft-04/schema#",
                "required": jsonSchemaModel.schema.required,
                "properties": jsonSchemaModel.schema.properties
            }
            await this.saveToFile(JSON.stringify(jsonSchema, null, 2), fileName);
        }
    }

    private async convertToOpenApiSchema(yamlContent: string): Promise<any> {
        const jsonContent = await jsYaml.load(yamlContent);
        return await openapiSchemaToJsonSchema(jsonContent)
    }

    private async downloadYaml(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error downloading YAML from ${url}: ${error.message}`);
        }
    }

    private async saveToFile(content: string, fileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, content, 'utf-8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Saved ${fileName}`);
                    resolve();
                }
            });
        });
    }
}

export default new OpenApiYAMLToJsonSchemaService();
