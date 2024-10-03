import axios from 'axios';


class CallServicePhaseOne {

    public async callService(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error call Service from ${url}: ${error}`);
        }
    }
}

export default new CallServicePhaseOne();
