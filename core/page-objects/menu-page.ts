import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class MenuPage extends BasePage {
  private menuLink = By.css("a[href='#menu']");
  private dessertsSection = By.id("desserts");
  private adminDashboardDropdown = By.id("adminDropdown");
  private manageMenuItemsLink = By.css("a.dropdown-item[href='#adminMenu']");
  private deleteButton = By.css("button.delete-btn");
  private deleteButtonConfirm = By.css("button[data-action='delete']");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async pressMenuLink() {
    await this.findElementAndClick(this.menuLink);
  }
  async selectDesserts() {
    await this.findElementAndClick(this.dessertsSection);
  }
  async pressAdminDashboardDropdown() {
    await this.findElementAndClick(this.adminDashboardDropdown);
  }
  async pressManageMenuItemsLink() {
    await this.findElementAndClick(this.manageMenuItemsLink);
  }
  async deleteMenuItem() {
    await this.findElementAndClick(this.deleteButton);
    await this.findElementAndClick(this.deleteButtonConfirm);
  }
}
