import browserTests from "../Frameworks/browserTests.js";

export let options = {
    stages: [
        { target: 20, duration: "2s" },
        { target: 20, duration: "10s" },
        { target: 0, duration: "2s" }
    ],
    thresholds: {
        'checks{test:login}': ['rate>0.3'],
    }
}

export default function() {
    browserTests()
}
