import * as puppeteer from "puppeteer";
import { MiddlewareHandlers } from "./types";

/**
 * Constants
 */
export const BLOCKED_RESOURCE_TYPES: Array<string> = [
  "gif",
  "image",
  "media",
  "font",
  "texttrack",
  "object",
  "beacon",
  "csp_report",
  "imageset",
  "font",
  //   "stylesheet",
];
export const SKIPPED_RESOURCE_URLS: Array<string> = [
  "quantserve",
  "adzerk",
  "doubleclick",
  "adition",
  "exelator",
  "sharethrough",
  "cdn.api.twitter",
  "google-analytics",
  "googletagmanager",
  "google",
  "fontawesome",
  "facebook",
  "analytics",
  "optimizely",
  "clicktale",
  "mixpanel",
  "zedo",
  "clicksor",
  "tiqcdn",
  "tvpixel",
  "bam-cell",
];
export const ENDPOINTS = {
  myAccount: "https://account.ikonpass.com/myaccount",
  addReservations: "https://account.ikonpass.com/myaccount/add-reservations",

  // AJAX Endpoints
  getDestinationIds: "https://account.ikonpass.com/api/v2/resorts",
};
export const SELECTORS = {
  login: {
    form: "form[class='amp-signin-form login-form']",
    email: "input[id='email']",
    password: "input[id='sign-in-password']",
    submit: "button[class='submit amp-button primary']",
  },
  addReservation: {
    items: `
    #react-autowhatever-resort-picker 
    > div 
    > div[class="react-autosuggest__section-container"] 
    > ul.react-autosuggest__suggestions-list 
    > li`,
    text: "./span",
    continueButton: "//span[text()[contains(.., 'Continue')]]",
  },
};

/**
 * Utility Functions
 */
export const checkRequiredParams = () => {
  if (!process.env.DESTINATION) {
    throw new Error(
      "You must provide a destination name! Check the README file for a list."
    );
  }
  if (
    !process.env.ALLOWED_PERSONS ||
    process.env.ALLOWED_PERSONS.length === 0
  ) {
    throw new Error("You must provide at least one person!");
  }
  if (!process.env.EMAIL) {
    throw new Error("You must provide an email!");
  }
  if (!process.env.PASSWORD) {
    throw new Error("You must provide a password");
  }
};

export const setupMiddlewares = async (
  page: puppeteer.Page,
  handlers: MiddlewareHandlers
) => {
  // 1. Allow requests to be intercepted
  await page.setRequestInterception(true);
  // 2. Prevent unnecessary requests from running
  page.on("request", (request) => {
    const requestURL = request.url().split("?")[0].split("#")[0];

    const isBlockedType =
      BLOCKED_RESOURCE_TYPES.indexOf(request.resourceType()) !== -1;
    // Convert type JS String Object to TS String
    const shoudSkip = SKIPPED_RESOURCE_URLS.some(
      (resource) => requestURL.indexOf(String(resource)) !== -1
    );

    if (isBlockedType || shoudSkip) {
      request.abort();
    } else {
      request.continue();
    }
  });

  page.on("requestfinished", (request) => {
    const urlRef = request.url();

    const getUserURL = "/api/v2/me/group";
    const getAvailability = "/api/v2/reservation-availability";

    if (
      urlRef.indexOf(getUserURL) !== -1 &&
      typeof handlers.getUsers !== "undefined"
    ) {
      handlers.getUsers(request);
    } else if (
      urlRef.indexOf(getAvailability) !== -1 &&
      typeof handlers.getDestinationAvailability !== "undefined"
    ) {
      handlers.getDestinationAvailability(request);
    }
  });
};
