import browserTests from "../Frameworks/browserTests.js";

export let options = {
    stages: [
        { target: 300, duration: "20s" },
        { target: 300, duration: "2m" },
        { target: 0, duration: "20s" }
    ],
    thresholds: {
        'checks{test:login}': ['rate>0.3'],
    }
}

export  default function() {
    browserTests()
}