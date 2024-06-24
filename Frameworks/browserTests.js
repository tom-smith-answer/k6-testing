import { check, group, sleep } from "k6";
import http from "k6/http";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { Counter, Rate, Trend } from "k6/metrics";


let successfulLogins = new Counter("successful_logins");
let successfulFlips = new Counter("successful_flips");
let checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);
let timeToLoad = new Trend("time_to_load_page", true);

export default function() {
    group("Home page", () => {
        let res = null;

        if (__ENV.URL_ALERT) {
            res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)));
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
            let res = http.batch([["GET", "http://test.k6.io/static/css/site.css", {}, { tags: { staticAsset: "yes" } }], ["GET", "http://test.k6.io/static/js/prisms.js", {}, { tags: { staticAsset: "yes" } }]]);
            let checkRes = [];
    
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
        });
    });

    sleep(2);

    group("Login", () => {
        let res = http.get("http://test.k6.io/my_messages.php");

        let checkRes = check(res, {
            "Users are unauthorised when not logged in": (r) => r.body.indexOf("Unauthorized") !== -1
        });

        let csrftoken = res
            .html()
            .find("input[name=csrftoken]")
            .first()
            .attr("value");
        
        checkFailureRate.add(!checkRes);

        let userData = JSON.parse(http.get("https://test.k6.io/static/examples/users.json").body).users;
        
        let index = Math.floor(Math.random()*userData.length);
        let login = userData[index];

        res = http.post("http://test.k6.io/login.php", {login: login.username, password: login.password, redir: '1', csrftoken: `${csrftoken}`});

        checkRes = check(res, {
            "Welcome header present when logged in": (r) => r.body.indexOf("Welcome, admin!") !== -1
        }, { test: 'login'});

        if (checkRes) {
            successfulLogins.add(1);
        };
        
        checkFailureRate.add(!checkRes, { page: "login" });
        timeToFirstByte.add(res.timings.waiting);
        timeToLoad.add(res.timings.duration);
    });

    sleep(2);

    group("Coin flip", () => {

        let res = http.get("https://test.k6.io/flip_coin.php");

        let checkRes = check(res, {
            "Page loads and user bet is heads by default": (r) => r.body.indexOf("Your bet: heads.") !== -1
        });

        checkFailureRate.add(!checkRes, {page: "coin flip"});
        
        res = http.get("https://test.k6.io/flip_coin.php?bet=tails");

        checkRes = check(res, {
            "User bet changes" : (r) => r.body.indexOf("Your bet: tails.") !== -1,
        });

        if (res.body.indexOf("Toss result: tails!") !== -1) {
            checkRes = check(res, {
                "Win result shown if tails" : (r) => r.body.indexOf("You won!")
            })
        };
        if (res.body.indexOf("Toss result: heads!") !== -1) {
            checkRes = check(res, {
                "Lose result shown if heads" : (r) => r.body.indexOf("You won!")
            })
        };
        
        if(checkRes) {
            successfulFlips.add(1);
        };
    });
}
