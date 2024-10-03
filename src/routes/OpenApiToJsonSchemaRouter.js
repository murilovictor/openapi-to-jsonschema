"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var OpenApiToJsonSchemaController_1 = __importDefault(require("../controllers/OpenApiToJsonSchemaController"));
var routerOpenApiToJsonSchema = express_1.default.Router();
routerOpenApiToJsonSchema.post('/process', OpenApiToJsonSchemaController_1.default.downloadOpenApiFileAndConvertToJsonSchema);
routerOpenApiToJsonSchema.post('/compare', OpenApiToJsonSchemaController_1.default.compare);
exports.default = routerOpenApiToJsonSchema;
