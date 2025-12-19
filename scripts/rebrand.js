#!/usr/bin/env node

/**
 * This script is used to rebrand the app to a different UNACMS website.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const settingsPath = path.join(root, "constants", "settings.ts");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Your UNA site URL: ",
  (answer) => {
    const userInput = answer.trim().replace(/\/$/, "").toLowerCase();

    // Simple URL validation (domain or https://...)
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}$/i;
    if (!userInput || !urlPattern.test(userInput)) {
      console.log("❌ Invalid input. Please enter a valid URL.");
      rl.close();
      return;
    }

    const newUrl = userInput.startsWith("http")
      ? userInput
      : `https://${userInput}`;

    // Read settings.ts
    fs.readFile(settingsPath, "utf8", (err, data) => {
      if (err) {
        console.error(`❌ Failed to read settings.ts: ${err.message}`);
        rl.close();
        return;
      }

      // Replace the UNA_URL line
      const updated = data.replace(
        /export const UNA_URL\s*=\s*["'`].*?["'`];/,
        `export const UNA_URL = "${newUrl}";`
      );

      fs.writeFile(settingsPath, updated, "utf8", (err) => {
        if (err) {
          console.error(`❌ Failed to write settings.ts: ${err.message}`);
        } else {
          console.log(`✅ UNA_URL updated to: ${newUrl}`);
        }
        rl.close();
      });
    });
  }
);
