import express from 'express';
import OpenApiToJsonSchemaController from "../controllers/OpenApiToJsonSchemaController";

const routerOpenApiToJsonSchema = express.Router();

routerOpenApiToJsonSchema.post('/convert-and-download', OpenApiToJsonSchemaController.downloadOpenApiFileAndConvertToJsonSchema);
routerOpenApiToJsonSchema.post('/validate-data', OpenApiToJsonSchemaController.validateData);

export default routerOpenApiToJsonSchema;
