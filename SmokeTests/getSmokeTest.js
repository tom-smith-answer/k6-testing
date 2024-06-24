import { getTest } from '../Frameworks/apiTests.js';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { target: 20, duration: '5s' },
        { target: 20, duration: '25s' },
        { target: 0, duartion: '5s'}
    ],
    thresholds: {
        'checks{test:get}' : ['rate>0.9']
    }
}

export default () => {
    getTest();
}