import { sleep, check } from 'k6';
import http from 'k6/http';

export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '5s', target: 20 },
        { duration: '25s', target: 20 },
        { duartion: '5s', target: 0}
    ]
};

export default () => {
    const url = 'https://localhost:7135/api/Players';

    const payload = JSON.stringify({
        Id: 0,
        FirstName: "Harvey",
        MiddleName: "The Power",
        LastName: "Sembhy",
        DateOfBirth: "1066-06-06T14:30:23.234Z",
        SquadNumber: 69,
        Position: "Everywhere",
        AbbrPosition: "EW",
        Team:  "Ninja Warriors",
        League: "Answer under 1100s",
        Starting11: false
      });

    const params = {
        headers:{
          'Content-Type': 'application/json'
        } 
      };

    let postRes = http.post(url, payload, params)

    check(postRes, {
        'status is 200': (r) => r.status === 200
    });
    console.log(postRes.status, "<---- postRes status")

    sleep(1);

};
