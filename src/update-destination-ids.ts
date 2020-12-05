import fs from "fs";
import path from "path";
import request from "request";
import { ENDPOINTS } from "./common";

export default () => {
  request(ENDPOINTS.getDestinationIds, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      try {
        const json = response.toJSON();
        const data = JSON.parse(json.body).data;

        const filename = path.join(__dirname, "destinationIds.json");
        fs.writeFile(filename, JSON.stringify(data), (err) => {
          if (err) {
            return console.error("Failed to update Destination Ids: ", err);
          }
          console.log("Updating Destination Ids...");
        });
      } catch (e) {
        console.error("Failed to update Destination Ids: ", e);
      }
    }
  });
};
