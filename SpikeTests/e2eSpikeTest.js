import { check } from "k6";
import { browser } from "k6/experimental/browser";

export const options = {
    scenarios: {
      browser : {
        executor: 'shared-iterations',
        exec: 'browserTest',
        startTime: '10s',
        gracefulStop: '5s',
        vus: 10,
        maxDuration: '1m',
        options: {
          browser : {
            type: 'chromium'
          }
        }
      }
    }
}

export async function browserTest() {
    const page = browser.newPage();
  
    try {
      await page.goto('https://test.k6.io/my_messages.php');
  
      page.locator('input[name="login"]').type('admin');
      page.locator('input[name="password"]').type('123');
  
      const submitButton = page.locator('input[type="submit"]');
  
      await Promise.all([
        page.waitForNavigation(),
        submitButton.click(),
      ]);
  
      check(page, {
        'header': page.locator('h2').textContent() == 'Welcome, admin!',
      });
    } finally {
      page.close();
    }
  }