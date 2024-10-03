import express, {NextFunction, Request, Response} from "express";
import processRouter from "./routes/OpenApiToJsonSchemaRouter";

import dotenv from "dotenv";

dotenv.config()

const app = express();
app.use(express.json());

app.use('/api', processRouter);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
        return response.status(500).json({
            status: "Internal Server Error",
            message: err.message,
            stack: err.stack
        });
    }
);

app.listen(process.env.PORT, () => {
    console.log("Server is running. Port: " + process.env.PORT);
});
