import { check, group, sleep } from "k6"
import http from "k6/http";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { Counter, Rate, Trend } from "k6/metrics";

export let options = {
    stages: [
        { target: 200, duration: "2s" },
        { target: 200, duration: "10s" },
        { target: 0, duration: "2s" }
    ],
}

let successfulLogins = new Counter("successful_logins");
let checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);
let timeToLoad = new Trend("time_to_load_page", true);

export default function() {
    group("Home page", () => {
        let res = null;

        if (__ENV.URL_ALERT) {
            res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)))
        }
        else {
            res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)), { tags: { name: "http://test.k6.io/ Aggregated"}});
        };

        let checkRes = check(res, {
            "Homepage body size is 11026 bytes": (r) => r.body.length === 11278,
            "Homepage welcome header present": (r) => r.body.indexOf("test.k6.io") !== -1
        });

        checkFailureRate.add(!checkRes);
        timeToFirstByte.add(res.timings.waiting);
        timeToLoad.add(res.timings.duration);

        group("Static assests", () => {
            let res = http.batch([["GET", "http://test.k6.io/static/css/site.css", {}, { tags: { staticAsset: "yes" } }], ["GET", "http://test.k6.io/static/js/prisms.js", {}, { tags: { staticAsset: "yes" } }]])
            let checkRes = []
    
            checkRes[0] = check(res[0], {
                "Stylesheet is 4859 bytes": (r) => r.body.length === 4859,
            });
    
            checkRes[1] = check(res[1], {
                "js is 9881 bytes": (r) => r.body.length === 9881,
            });
    
            checkFailureRate.add(!checkRes[0]);
            checkFailureRate.add(!checkRes[1]);
    
            timeToFirstByte.add(res[0].timings.waiting);
            timeToFirstByte.add(res[1].timings.waiting);
    
            timeToLoad.add(res[0].timings.duration); 
            timeToLoad.add(res[1].timings.duration);
        })
    })

    sleep(2)

    group("Login", () => {
        let res = http.get("http://test.k6.io/my_messages.php");

        let checkRes = check(res, {
            "Users should be unauthorised": (r) => r.body.indexOf("Unauthorized") !== -1
        });

        const vars = {};

        vars["csrftoken"] = res
            .html()
            .find("input[name=csrftoken]")
            .first()
            .attr("value")
        
        checkFailureRate.add(!checkRes);
    })


}
