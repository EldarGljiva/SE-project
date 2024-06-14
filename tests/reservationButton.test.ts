import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { LoginPage } from "../core/page-objects/login-page";
import { HomePage } from "../core/page-objects/home-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let loginPage: LoginPage;
let homePage: HomePage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  loginPage = new LoginPage(driver);
  homePage = new HomePage(driver);
}, 20000);

test.only("Press a reservation button in a home page", async () => {
  await loginPage.fillAllInputFields();
  await loginPage.submitLogin();
  await driver.sleep(5000);
  await homePage.pressReservationButton();
  await driver.sleep(2000);
}, 30000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
