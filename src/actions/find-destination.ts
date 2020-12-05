import { Logger } from "../logger";
import { SELECTORS } from "../common";
import * as puppeteer from "puppeteer";
import destinationIds from "../destinationIds.json";

interface Destination {
  id: Number;
  name: string;
}

/**
 * Find Correct Destination from Resort List
 */
export default async (
  page: puppeteer.Page,
  destination: string
): Promise<Destination> => {
  const logger = Logger.getInstance();
  let flag: Boolean = false;
  const { addReservation } = SELECTORS;

  logger.info("Starting findDestination action...");

  // 1. Find all Resort List Items
  logger.info("Finding all Reservation List Items...");
  const items = await page.$$(addReservation.items);
  logger.info("Found all Reservation List Items.");

  // 2. Iterate through Resort List Items
  logger.info(
    "Comparing Reservation List Items with provided Destination Name..."
  );
  await Promise.all(
    items.map(async (handle) => {
      // 2a. Find List Item text
      const spanChild = (await handle.$x(addReservation.text))[0];
      const text = await spanChild.evaluate((s) => s.textContent);

      // 2b. Compare List Item's text with provided Destination
      if (text && text.toLowerCase().includes(destination.toLowerCase())) {
        flag = true;
        // 2c. Click on List Item
        await handle.click();
        return;
      }
    })
  );

  // 3. Make sure that the destination provided was found
  if (!flag) {
    const message =
      "Destination Name provided is either invalid or no longer exists!";
    throw new Error(message);
  }
  logger.info("Destination Name found within Reservations List Items.");

  // 4. Continue Button should now appear at which point click it
  logger.info("Clicking Continue Button.");
  const continueBtn = (await page.$x(addReservation.continueButton))[0];
  await continueBtn.click();

  logger.info("Finished findDestination action.\n");
  return {
    name: destination,
    id: destinationIds.find((resort) =>
      resort.name.toLowerCase().includes(destination.toLowerCase())
    )!.id,
  };
};
