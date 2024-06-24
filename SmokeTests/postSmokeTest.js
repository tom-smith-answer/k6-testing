import { postTest } from '../Frameworks/apiTests.js';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
      { target: 20, duration: '5s' },
      { target: 20, duration: '25s' },
      { target: 0, duartion: '5s'}
    ]
};

export default () => {
  postTest();
};
