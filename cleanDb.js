import { check } from "k6";
import http from "k6/http";

export const options = {
    insecureSkipTLSVerify: true,
}

export default() => {
  const url = 'https://localhost:7135/api/Players';
  
    let getRes = http.get(url);
    let splitResponse = getRes.body.split("}")
    
    for (let i = 13; i <= splitResponse.length; i++) {
      const delRes = http.del(`${url}/${i}`);
      check(delRes, {
        'status is 204': (r) => r.status === 204
      });
      console.log(delRes.status, "<---- delRes status")
    }
}