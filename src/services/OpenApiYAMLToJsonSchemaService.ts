import axios from 'axios';
import * as jsYaml from 'js-yaml';
import * as fs from "fs";
import $RefParser from "@apidevtools/json-schema-ref-parser";

import openapiSchemaToJsonSchema from 'openapi-schema-to-json-schema'

interface JsonSchemaModel {
    name?: string
    description?: string
    summary?: string
    path?: string
    method?: string
    statusCode?: string
    schema?: any
}

class OpenApiYAMLToJsonSchemaService {

    extractRefValues(openAPI: any, statuses: string[]): JsonSchemaModel[] {
        const models: JsonSchemaModel[] = [];

        statuses.forEach((status) => {
            this.extractRefValue(openAPI, status)
                .forEach((refValue) => models.push(refValue));
        });

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

    extractRefValue(openAPI: any, status: string): JsonSchemaModel[] {
        const result: JsonSchemaModel[] = [];
        for (const [pathKey, pathItem] of Object.entries(openAPI.paths)) {
            for (const [methodKey, method] of Object.entries(pathItem)) {
                const response: any = method.responses[status];
                let extractSchema = this.extractSchema(response.content, "schema");
                if (extractSchema) {
                    let jsonSchema: JsonSchemaModel = {
                        name: method.operationId,
                        summary: method.summary,
                        description: method.description,
                        statusCode: status,
                        method: methodKey,
                        path: pathKey,
                        schema: extractSchema
                    }
                    result.push(jsonSchema);
                }
            }
        }
        return result;
    }

    public async downloadOpenApiFileAndConvertToJsonSchema(url: string): Promise<void> {
        const yamlContent = await this.downloadYaml(url);
        const openApiSchema: any = await this.convertToOpenApiSchema(yamlContent);

        const openApiVersion: string = openApiSchema.info.version

        let schema = await $RefParser.dereference(openApiSchema);

        let jsonSchemaModels = this.extractRefValues(schema, ["200"]);

        console.log(`Converting OpenApi: ${openApiSchema.info.title} - Version: ${openApiVersion}`)

        for (let jsonSchemaModel of jsonSchemaModels) {
            const fileName = `${jsonSchemaModel.name}-${jsonSchemaModel.method}-${jsonSchemaModel.statusCode}-${openApiVersion}`;
            let jsonSchema = {
                "type": "object",
                "$schema": "http://json-schema.org/draft-04/schema#",
                "required": jsonSchemaModel.schema.required,
                "properties": jsonSchemaModel.schema.properties
            }
            await this.saveToFile(JSON.stringify(jsonSchema, null, 2), `${fileName}.json`);
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
