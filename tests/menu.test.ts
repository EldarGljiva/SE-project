import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { MenuPage } from "../core/page-objects/menu-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let menuPage: MenuPage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  menuPage = new MenuPage(driver);
}, 20000);

test.only("Check desserts section in menu page", async () => {
  await driver.sleep(2000);
  await menuPage.pressMenuLink();
  await driver.sleep(2000);
  await menuPage.selectDesserts();
  await driver.sleep(2000);
}, 30000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
