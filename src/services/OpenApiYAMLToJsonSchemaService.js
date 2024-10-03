"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var jsYaml = __importStar(require("js-yaml"));
var fs = __importStar(require("fs"));
var json_schema_ref_parser_1 = __importDefault(require("@apidevtools/json-schema-ref-parser"));
var openapi_schema_to_json_schema_1 = __importDefault(require("openapi-schema-to-json-schema"));
var OpenApiYAMLToJsonSchemaService = /** @class */ (function () {
    function OpenApiYAMLToJsonSchemaService() {
    }
    OpenApiYAMLToJsonSchemaService.prototype.extractRefValues = function (openAPI, openapiRequestModel) {
        var models = [];
        this.extractRefValue(openAPI, openapiRequestModel)
            .forEach(function (refValue) { return models.push(refValue); });
        return models;
    };
    OpenApiYAMLToJsonSchemaService.prototype.extractSchema = function (obj, fieldName) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === fieldName) {
                    return obj[key];
                }
                else if (typeof obj[key] === "object") {
                    var result = this.extractSchema(obj[key], fieldName);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return null;
    };
    OpenApiYAMLToJsonSchemaService.prototype.extractRefValue = function (openAPI, openapiRequestModel) {
        var result = [];
        var paths = this.getPathAndApplyFilter(openAPI, openapiRequestModel);
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var _a = paths_1[_i], pathKey = _a[0], pathItem = _a[1];
            var methods = this.getMethodsAndApplyFilter(pathItem, openapiRequestModel);
            for (var _b = 0, methods_1 = methods; _b < methods_1.length; _b++) {
                var _c = methods_1[_b], methodKey = _c[0], method = _c[1];
                var responses = this.getResponseAndApplyFilter(method, openapiRequestModel);
                for (var _d = 0, responses_1 = responses; _d < responses_1.length; _d++) {
                    var _e = responses_1[_d], responseKey = _e[0], response = _e[1];
                    var extractSchema = this.extractSchema(response.content, "schema");
                    if (extractSchema) {
                        var jsonSchema = {
                            name: method.operationId,
                            summary: method.summary,
                            description: method.description,
                            statusCode: responseKey,
                            method: methodKey,
                            path: pathKey,
                            schema: extractSchema
                        };
                        result.push(jsonSchema);
                    }
                }
            }
        }
        return result;
    };
    OpenApiYAMLToJsonSchemaService.prototype.getResponseAndApplyFilter = function (method, openapiRequestModel) {
        return Object.entries(method.responses).filter(function (_a) {
            var responseKey = _a[0];
            if (openapiRequestModel.status) {
                return openapiRequestModel.status.includes(responseKey);
            }
            return true;
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.getMethodsAndApplyFilter = function (pathItem, openapiRequestModel) {
        return Object.entries(pathItem).filter(function (_a) {
            var methodKey = _a[0];
            if (openapiRequestModel.methods) {
                return openapiRequestModel.methods.includes(methodKey);
            }
            return true;
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.getPathAndApplyFilter = function (openAPI, openapiRequestModel) {
        return Object.entries(openAPI.paths).filter(function (_a) {
            var pathKey = _a[0];
            if (openapiRequestModel.paths) {
                return openapiRequestModel.paths.includes(pathKey);
            }
            return true;
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.downloadOpenApiFileAndConvertToJsonSchema = function (openapiRequestModel) {
        return __awaiter(this, void 0, void 0, function () {
            var yamlContent, openApiSchema, openApiVersion, schema, jsonSchemaModels, _i, jsonSchemaModels_1, jsonSchemaModel, fileName, jsonSchema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.downloadYaml(openapiRequestModel.url)];
                    case 1:
                        yamlContent = _a.sent();
                        return [4 /*yield*/, this.convertToOpenApiSchema(yamlContent)];
                    case 2:
                        openApiSchema = _a.sent();
                        openApiVersion = openApiSchema.info.version;
                        return [4 /*yield*/, json_schema_ref_parser_1.default.dereference(openApiSchema)];
                    case 3:
                        schema = _a.sent();
                        jsonSchemaModels = this.extractRefValues(schema, openapiRequestModel);
                        console.log("Converting OpenApi: ".concat(openApiSchema.info.title, " - Version: ").concat(openApiVersion));
                        _i = 0, jsonSchemaModels_1 = jsonSchemaModels;
                        _a.label = 4;
                    case 4:
                        if (!(_i < jsonSchemaModels_1.length)) return [3 /*break*/, 7];
                        jsonSchemaModel = jsonSchemaModels_1[_i];
                        fileName = "".concat(jsonSchemaModel.name, "-").concat(jsonSchemaModel.method, "-").concat(jsonSchemaModel.statusCode, "-").concat(openApiVersion, ".json");
                        jsonSchema = {
                            "type": "object",
                            "$schema": "http://json-schema.org/draft-04/schema#",
                            "required": jsonSchemaModel.schema.required,
                            "properties": jsonSchemaModel.schema.properties
                        };
                        return [4 /*yield*/, this.saveToFile(JSON.stringify(jsonSchema, null, 2), fileName)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.downloadOpenApiFileAndConvertToJsonSchemaAndGet = function (openapiRequestModel) {
        return __awaiter(this, void 0, void 0, function () {
            var yamlContent, openApiSchema, schema, jsonSchemaModels, jsonSchemaResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.downloadYaml(openapiRequestModel.url)];
                    case 1:
                        yamlContent = _a.sent();
                        return [4 /*yield*/, this.convertToOpenApiSchema(yamlContent)];
                    case 2:
                        openApiSchema = _a.sent();
                        return [4 /*yield*/, json_schema_ref_parser_1.default.dereference(openApiSchema)];
                    case 3:
                        schema = _a.sent();
                        jsonSchemaModels = this.extractRefValues(schema, openapiRequestModel);
                        jsonSchemaResponse = jsonSchemaModels[0];
                        return [2 /*return*/, {
                                "$schema": "http://json-schema.org/draft-07/schema#",
                                "type": "object",
                                "required": jsonSchemaResponse.schema.required,
                                "properties": jsonSchemaResponse.schema.properties
                            }];
                }
            });
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.convertToOpenApiSchema = function (yamlContent) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsYaml.load(yamlContent)];
                    case 1:
                        jsonContent = _a.sent();
                        return [4 /*yield*/, (0, openapi_schema_to_json_schema_1.default)(jsonContent)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.downloadYaml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Error downloading YAML from ".concat(url, ": ").concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenApiYAMLToJsonSchemaService.prototype.saveToFile = function (content, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.writeFile(fileName, content, 'utf-8', function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                console.log("Saved ".concat(fileName));
                                resolve();
                            }
                        });
                    })];
            });
        });
    };
    return OpenApiYAMLToJsonSchemaService;
}());
exports.default = new OpenApiYAMLToJsonSchemaService();
