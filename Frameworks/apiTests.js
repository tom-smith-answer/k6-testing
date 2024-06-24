import http from 'k6/http';
import { check, sleep } from 'k6';

export function getTest() {
    let res = http.get('https://k6.io/')

    let checkRes = check(res, {
        "Status is 200: Ok": (r) => r.status === 200
    }, {test: 'get'})

    sleep(1)
}

export function postTest() {
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
        'status is 201': (r) => r.status === 200
    });
    console.log(postRes.status, "<---- postRes status")

    sleep(1);

}