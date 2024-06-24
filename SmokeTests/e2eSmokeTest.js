import e2eUiTests from "../Frameworks/e2eUiTests.js";

export const options = {
    scenarios: {
      ui : {
        executor: 'constant-vus',
        exec: 'uiTest',
        vus: 5,
        duration: '20s',
        options: {
          browser: {
            type: 'chromium',
          }
        }
      }
    }
}

export async function uiTest() {
  e2eUiTests()
}