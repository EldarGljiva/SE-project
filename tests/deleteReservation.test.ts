import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { LoginPage } from "../core/page-objects/login-page";
import { ReservationsPage } from "../core/page-objects/reservations-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let loginPage: LoginPage;
let reservationsPage: ReservationsPage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  reservationsPage = new ReservationsPage(driver);
  loginPage = new LoginPage(driver);
}, 20000);

test.only("Delete a reservation as an admin", async () => {
  await loginPage.fillAllInputFields();
  await loginPage.submitLogin();
  await driver.sleep(5000);
  await reservationsPage.pressAdminDashboardDropdown();
  await reservationsPage.pressManageReservationsLink();
  await reservationsPage.deleteReservation();
  await driver.sleep(2000);
}, 40000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
