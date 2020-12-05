require("dotenv").config();
import actions from "./actions";
import puppeteer from "puppeteer";
import { Logger } from "./logger";
import { GetUsersPayload } from "./types";
import { checkRequiredParams, ENDPOINTS, setupMiddlewares } from "./common";

const StartBot = async () => {
  // 1. Launch Browser
  const WINDOW_SIZE: number = 540;
  const browser: puppeteer.Browser = await puppeteer.launch({
    slowMo: 0,
    headless: false,
    args: [`--window-size=${WINDOW_SIZE},${WINDOW_SIZE}`], // new option
  });

  // 2. Setup Logger
  const logger = Logger.getInstance();

  try {
    const foundUsers: Array<string> = [];

    const email: string | undefined = String(process.env.EMAIL);
    const password: string | undefined = String(process.env.PASSWORD);
    const destinationName: string | undefined = String(process.env.DESTINATION);
    const allowedPersons: Array<string> =
      process.env.ALLOWED_PERSONS?.split(",").map((s) => s.trim()) || [];

    // 1. Make sure the requred params were provided in
    // environment variables
    checkRequiredParams();
    logger.info("Found all required parameters.");

    const { login, isAuthenticated, findDestination } = actions;
    // 2. Setup puppeteer
    logger.info("Starting puppeteer setup...");
    const page = await browser.newPage();
    page.setViewport({ width: WINDOW_SIZE, height: WINDOW_SIZE });
    await setupMiddlewares(page, {
      /**
       * Handler function for when getUsers endpoint is intercepted
       */
      getUsers: async (req) => {
        // 1. Make sure we haven't already found
        // users
        if (foundUsers.length === 0) {
          // 2. Get JSON
          const json: GetUsersPayload = (await req
            .response()
            ?.json()) as GetUsersPayload;
          // 3. Get Group Members
          const members = json.data.group_members;
          // 4. Iterate through Group Members
          members.forEach((member) => {
            // 4a. Compare Allowed People that was provided
            // with current member
            const { profile } = member;
            const fullName = profile.first_name + " " + profile.last_name;
            const found = allowedPersons.find((v) => {
              if (v === fullName) {
                return v;
              }

              return undefined;
            });

            // 4b. Push onto foundUsers Array if Found
            if (found) {
              foundUsers.push(fullName);
            }
          });

          // 5. If not all Users were found then error out
          if (foundUsers.length !== allowedPersons.length) {
            throw new Error("You've provided invalid users!");
          }
        }
      },
      /**
       * Handler function for when getDestinationAvailability endpoint is
       * intercepted
       */
      getDestinationAvailability: async (req) => {
        console.log(req.url());
      },
    });
    logger.info("Finished puppeteer setup.");

    // 3. Navigate into /myaccount/add-reservations
    // and check if authenticated
    logger.info("Navigating to /myaccount/add-reservations...");
    await page.goto(ENDPOINTS.addReservations, {
      timeout: 0,
      waitUntil: "networkidle2",
    });
    logger.info("Successfully navigated to /myaccount/add-reservations.\n");

    // 3a. If not authenticated then login
    if (!isAuthenticated(await page.content())) {
      await login(page, email, password);
    }

    // 4. Find Destination
    const destination = await findDestination(page, destinationName);
  } catch (e) {
    logger.error("Program exited due to error: " + e);
    await browser.close();
  }
};
StartBot();
