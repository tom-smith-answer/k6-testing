import { check } from "k6";
import { browser } from "k6/experimental/browser";

export default async function() {
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