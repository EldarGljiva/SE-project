import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { AboutUsPage } from "../core/page-objects/aboutus-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let aboutusPage: AboutUsPage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  aboutusPage = new AboutUsPage(driver);
}, 20000);

test.only("Press a reservation button in a home page", async () => {
  await driver.sleep(2000);
  await aboutusPage.pressAboutUsLink();
  await driver.sleep(2000);
}, 30000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
