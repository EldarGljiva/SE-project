import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class AboutUsPage extends BasePage {
  private aboutUsLink = By.css("a[href='#aboutUs']");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async pressAboutUsLink() {
    await this.findElementAndClick(this.aboutUsLink);
  }
}
