import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { LoginPage } from "../core/page-objects/login-page";
import { MenuPage } from "../core/page-objects/menu-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let loginPage: LoginPage;
let menuPage: MenuPage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  menuPage = new MenuPage(driver);
  loginPage = new LoginPage(driver);
}, 20000);

test.only("Delete a menu item as an admin", async () => {
  await loginPage.fillAllInputFields();
  await loginPage.submitLogin();
  await driver.sleep(5000);
  await menuPage.pressAdminDashboardDropdown();
  await menuPage.pressManageMenuItemsLink();
  await menuPage.deleteMenuItem();
  await driver.sleep(2000);
}, 40000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
