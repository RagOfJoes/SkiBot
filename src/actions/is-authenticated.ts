import * as cheerio from "cheerio";

/**
 * Checks HTML to make sure that we're not in the login
 * page
 */
export default (html: string | Buffer): Boolean => {
  const $ = cheerio.load(html);
  const loginForm = $("form[class='amp-signin-form login-form']");
  return !loginForm;
};
