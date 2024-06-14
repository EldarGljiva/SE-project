import BasePage from "./base-page";
import { WebDriver, By, until } from "selenium-webdriver";
import { Key } from "selenium-webdriver";

import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class ReservationsPage extends BasePage {
  private profileDropdown = By.id("navbarDropdown");
  private reservationsLink = By.css("a.dropdown-item[href='#reservations']");
  private manageReservationsLink = By.css(
    "a.dropdown-item[href='#adminReservations']"
  );
  private adminDashboardDropdown = By.id("adminDropdown");
  private deleteButton = By.css("button.delete-btn");
  private deleteButtonConfirm = By.css("button[data-action='delete']");

  constructor(driver: WebDriver) {
    super(driver);
  }
  async pressProfileDropdown() {
    await this.findElementAndClick(this.profileDropdown);
  }
  async pressReservationsLink() {
    await this.findElementAndClick(this.reservationsLink);
  }
  async pressAdminDashboardDropdown() {
    await this.findElementAndClick(this.adminDashboardDropdown);
  }
  async pressManageReservationsLink() {
    await this.findElementAndClick(this.manageReservationsLink);
  }
  async deleteReservation() {
    await this.findElementAndClick(this.deleteButton);
    await this.findElementAndClick(this.deleteButtonConfirm);
  }
}
