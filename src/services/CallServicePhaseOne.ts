import axios from 'axios';
import * as https from "node:https";


class CallServicePhaseOne {

    public async callService(url: string): Promise<string> {
        try {

            const instance = axios.create({
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            });
            const response = await instance.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error call Service from ${url}: ${error}`);
        }
    }
}

export default new CallServicePhaseOne();
