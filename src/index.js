"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var OpenApiToJsonSchemaRouter_1 = __importDefault(require("./routes/OpenApiToJsonSchemaRouter"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', OpenApiToJsonSchemaRouter_1.default);
app.use(function (err, request, response, next) {
    return response.status(500).json({
        status: "Internal Server Error",
        message: err.message,
        stack: err.stack
    });
});
app.listen(3000, function () {
    console.log("Server is running. Port: 3000");
});
