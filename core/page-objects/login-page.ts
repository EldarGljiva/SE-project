import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class LoginPage extends BasePage {
  private emailInputField = By.id("email");
  private passwordInputField = By.id("password");
  private loginButton = By.id("loginButton");
  private logoutLink = By.xpath(
    "//a[contains(@class, 'dropdown-item') and text()='Logout']"
  );
  private profileDropdown = By.id("navbarDropdown");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async fillAllInputFields() {
    await this.fillInputField(this.emailInputField, testData.data.loginEmail);
    await this.fillInputField(
      this.passwordInputField,
      testData.data.loginPassword
    );
  }
  async submitLogin() {
    await this.findElementAndClick(this.loginButton);
  }
  async pressProfileDropdown() {
    await this.findElementAndClick(this.profileDropdown);
  }
  async logout() {
    await this.findElementAndClick(this.logoutLink);
  }
}
