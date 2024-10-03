"use strict";
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
var OpenApiYAMLToJsonSchemaService_1 = __importDefault(require("../services/OpenApiYAMLToJsonSchemaService"));
var CallServicePhaseOne_1 = __importDefault(require("../services/CallServicePhaseOne"));
var ajv_1 = __importDefault(require("ajv"));
var OpenApiToJsonSchemaController = /** @class */ (function () {
    function OpenApiToJsonSchemaController() {
    }
    OpenApiToJsonSchemaController.prototype.downloadOpenApiFileAndConvertToJsonSchema = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, _i, body_1, openapiRequestModel, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        _i = 0, body_1 = body;
                        _a.label = 1;
                    case 1:
                        if (!(_i < body_1.length)) return [3 /*break*/, 6];
                        openapiRequestModel = body_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        console.log("Start processing: ".concat(openapiRequestModel));
                        return [4 /*yield*/, OpenApiYAMLToJsonSchemaService_1.default.downloadOpenApiFileAndConvertToJsonSchema(openapiRequestModel)];
                    case 3:
                        _a.sent();
                        console.log("End processing: ".concat(openapiRequestModel));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error on convert openapi to jsonSchema - url: ".concat(openapiRequestModel, ":"), error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        res.status(200).json({ message: 'Successful' });
                        return [2 /*return*/];
                }
            });
        });
    };
    OpenApiToJsonSchemaController.prototype.compare = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var body, ajv, validations, _i, body_2, openapiRequestModel, validation, schema, responseService, isDataValid, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = req.body;
                        ajv = new ajv_1.default({ strictSchema: false });
                        validations = [];
                        _i = 0, body_2 = body;
                        _b.label = 1;
                    case 1:
                        if (!(_i < body_2.length)) return [3 /*break*/, 8];
                        openapiRequestModel = body_2[_i];
                        validation = {};
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        console.log("Start processing: ".concat(openapiRequestModel));
                        validation.apiName = (_a = openapiRequestModel.paths[0]) === null || _a === void 0 ? void 0 : _a.replace("/", "");
                        return [4 /*yield*/, OpenApiYAMLToJsonSchemaService_1.default.downloadOpenApiFileAndConvertToJsonSchemaAndGet(openapiRequestModel)];
                    case 3:
                        schema = _b.sent();
                        return [4 /*yield*/, CallServicePhaseOne_1.default.callService(openapiRequestModel.urlCompare)];
                    case 4:
                        responseService = _b.sent();
                        isDataValid = ajv.validate(schema, responseService);
                        if (isDataValid) {
                            console.log("The ice cream data is valid! 🍨");
                        }
                        else {
                            console.error("The ice cream data is invalid:", ajv.errors);
                        }
                        validation.success = !ajv.errors;
                        validation.errors = ajv.errors;
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        console.error("Error on convert openapi to jsonSchema - url: ".concat(openapiRequestModel, ":"), error_2);
                        validation.success = false;
                        validation.errors = String(error_2);
                        return [3 /*break*/, 6];
                    case 6:
                        validations.push(validation);
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        res.status(200).json(validations);
                        return [2 /*return*/];
                }
            });
        });
    };
    return OpenApiToJsonSchemaController;
}());
exports.default = new OpenApiToJsonSchemaController();
