import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '30s', target: 300 },
        { duration: '5m', target: 300 },
        { duartion: '1ms', target: 0}
    ]
}

export default () => {

    http.get('https://k6.io/')

    sleep(1)
}