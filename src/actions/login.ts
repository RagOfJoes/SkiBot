import { Logger } from "../logger";
import { ENDPOINTS } from "../common";
import * as puppeteer from "puppeteer";

/**
 * Checks HTML to make sure that we're not in the login
 * page
 */
export default async (
  page: puppeteer.Page,
  email: string,
  password: string
) => {
  const logger = Logger.getInstance();

  logger.info("Not Authenticated. Staring login action...");
  const emailSelector = "input[id='email']";
  const passwordSelector = "input[id='sign-in-password']";
  const buttonSelector = "button[class='submit amp-button primary']";

  await page.type(emailSelector, email, {
    delay: 40,
  });
  await page.type(passwordSelector, password, {
    delay: 40,
  });

  logger.info("Submitting login form...");
  await Promise.all([
    page.click(buttonSelector),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  logger.info("Submitted login form.");

  logger.info("Finished login action.\n");
  await page.goto(ENDPOINTS.addReservations, { waitUntil: "networkidle2" });
};
