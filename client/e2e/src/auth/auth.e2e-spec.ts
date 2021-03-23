import { browser, by, element, Key, logging } from 'protractor';
import { AuthService } from '../../../src/app/shared/services/auth.service';

describe('App\'s authorization', () => {
  // let service: AuthService;
  // beforeEach(() => {
  // });

  it('shouldn\'t sign in', async () => {
    await browser.get('http://localhost:4200/login');
    element(by.css('[name="email"]')).sendKeys('user@mail.ru');
    element(by.css('[name="password"]')).sendKeys('admin');
    element(by.buttonText('Login')).click();
    await browser.sleep(5000);
    expect(await browser.getCurrentUrl()).toBe('http://localhost:4200/login');
  });

  it('should sign in as admin', async () => {
    await browser.get('http://localhost:4200/login');
    // await page.navigateTo();
    element(by.css('[name="email"]')).sendKeys('admin@mail.ru');
    element(by.css('[name="password"]')).sendKeys('admin');
    element(by.buttonText('Login')).click();
    await browser.sleep(5000);
    expect(await browser.getCurrentUrl()).toBe('http://localhost:4200/admin');
  });

  // afterEach(() => {
  // });
});
