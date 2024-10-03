import express from 'express';
import OpenApiToJsonSchemaController from "../controllers/OpenApiToJsonSchemaController";

const routerOpenApiToJsonSchema = express.Router();

routerOpenApiToJsonSchema.post('/process', OpenApiToJsonSchemaController.downloadOpenApiFileAndConvertToJsonSchema);
routerOpenApiToJsonSchema.post('/compare', OpenApiToJsonSchemaController.compare);

export default routerOpenApiToJsonSchema;
