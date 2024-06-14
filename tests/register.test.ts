import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { RegisterPage } from "../core/page-objects/register-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let registerPage: RegisterPage;

beforeAll(async () => {
  driver = await createDriver(testData.url.base_page);
  registerPage = new RegisterPage(driver);
}, 20000);

test.only("Registering customer", async () => {
  await registerPage.enterRegisterPage();
  await registerPage.fillAllInputFields();
  await registerPage.submitRegister();
  await driver.sleep(3000);
}, 30000);

afterAll(async () => {
  await driver.sleep(2000);
  await quitDriver(driver);
}, 10000);
