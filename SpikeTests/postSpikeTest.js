import { postTest } from '../Frameworks/apiTests.js';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { target: 300, duration: '20s' },
        { target: 300, duration: '2m' },
        { target: 0, duartion: '20s'}
    ],
};

export default () => {
  postTest();
};