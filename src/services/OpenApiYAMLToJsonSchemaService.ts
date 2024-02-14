import axios from 'axios';
import * as jsYaml from 'js-yaml';
import * as fs from "fs";

import openapiSchemaToJsonSchema from 'openapi-schema-to-json-schema'

class OpenApiYAMLToJsonSchemaService {

    public async downloadOpenApiFileAndConvertToJsonSchema(url: string): Promise<void> {
        const yamlContent = await this.downloadYaml(url);
        const openApiSchema: any = await this.convertToOpenApiSchema(yamlContent);

        const productName: string = this.getProductName(url)
        const openApiVersion: string = openApiSchema.info.version

        console.log(`Converting OpenApi: ${productName} - Version: ${openApiVersion}`)

        const patternsToFilter = [
            'ResponsePersonalCustomersIdentification',
            'ResponsePersonalCustomersQualification',
            'ResponsePersonalCustomersComplimentaryInformation',
            'ResponseBusinessCustomersIdentification',
            'ResponseBusinessCustomersQualification',
            'ResponseBusinessCustomersComplimentaryInformation',
            `ResponseInsurance${productName}`,
            `ResponseInsurance${productName}PolicyInfo`,
            `ResponseInsurance${productName}Premium`,
            `ResponseInsurance${productName}Claims`,
        ];

        const filteredObjects = this.filterObjectsByPattern(openApiSchema.components.schemas, patternsToFilter);

        for (const key of Object.keys(filteredObjects)) {
            const body = filteredObjects[key]
            let jsonSchema = {
                "type": body.type,
                "$schema": "http://json-schema.org/draft-04/schema#",
                "required": body.required,
                "properties": body.properties,
                "components": {
                    "schemas": openApiSchema.components.schemas
                }
            }
            await this.saveToFile(JSON.stringify(jsonSchema, null, 2), `${key}-${openApiVersion}.json`);
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

    private filterObjectsByPattern(obj: any, pattern: string[]): any {
        const result: any = {};

        Object.keys(obj).forEach((key) => {
            if (pattern.includes(key)) {
                result[key] = obj[key];
            }
        });

        return result;
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

    public getProductName(url: string): string {
        if (url.includes('customers')) {
            return 'customers'
        }
        const match = url.match(/\/swagger\/insurance-([a-zA-Z-]+)\.yaml$/);
        if (match && match[1]) {
            const product = match[1];
            console.log(`Value ${product} extracted from URL:`, product);
            const productCamelCase = this.toCamelCase(product)
            console.log(`Value ${product} converted to CamelCase:`, productCamelCase);
            return productCamelCase;
        } else {
            console.error('Error on extracted product name by URL.');
        }
    }

    toCamelCase(input: string): string {
        const camelCased = input.replace(/-([a-z])/g, (_, match) => match.toUpperCase());
        return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
    }
}

export default new OpenApiYAMLToJsonSchemaService();
