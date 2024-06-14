import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class RegisterPage extends BasePage {
  private registerLink = By.css("a[href='#register']");
  private fNameInputField = By.id("fName");
  private lNameInputField = By.id("lName");
  private emailInputField = By.id("email");
  private phoneInputField = By.id("phone");
  private passwordInputField = By.id("password");
  private registerButton = By.id("registerButton");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async enterRegisterPage() {
    await this.findElementAndClick(this.registerLink);
  }
  async fillAllInputFields() {
    await this.fillInputField(this.fNameInputField, testData.data.fName);
    await this.fillInputField(this.lNameInputField, testData.data.lName);
    await this.fillInputField(this.phoneInputField, testData.data.phone);
    await this.fillInputField(this.emailInputField, testData.data.email);
    await this.fillInputField(this.passwordInputField, testData.data.password);
  }
  async submitRegister() {
    await this.findElementAndClick(this.registerButton);
  }
}
