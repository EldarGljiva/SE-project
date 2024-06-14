import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class HomePage extends BasePage {
  private reservationButton = By.css("a[href='#reservation']");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async pressReservationButton() {
    await this.findElementAndClick(this.reservationButton);
  }
}
