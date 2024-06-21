import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '5s', target: 20 },
        { duration: '25s', target: 20 },
        { duartion: '5s', target: 0}
    ]
}

export default () => {
    const getRes = http.get('https://localhost:7135/api/Players')

    check(getRes, {
        'status is 200': (r) => r.status === 200
      });

    sleep(1)
}