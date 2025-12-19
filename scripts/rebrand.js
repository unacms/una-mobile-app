#!/usr/bin/env node

/**
 * This script is used to rebrand the app to a different UNACMS website.
 */

const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const settingsPath = path.join(root, "constants", "settings.ts");
const appJsonPath = path.join(root, "app.json");

// Helper to ask questions with async/await
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

(async () => {
  try {
    // --------- replace UNA URL
    await (async () => {
      const answer = await askQuestion("Your UNA site URL: ");
      const userInput = answer.trim().replace(/\/$/, "").toLowerCase();

      // Simple URL validation (domain or https://...)
      const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
      if (!userInput || !urlPattern.test(userInput)) {
        console.log("❌ Invalid input. Please enter a valid URL.");
        return;
      }
      
      const newUrl = userInput.startsWith("http") ? userInput : `https://${userInput}`;

      let settingsData = await fs.readFile(settingsPath, "utf8");
      settingsData = settingsData.replace(
        /export const UNA_URL\s*=\s*["'`].*?["'`];/,
        `export const UNA_URL = "${newUrl}";`
      );
      await fs.writeFile(settingsPath, settingsData, "utf8");
      console.log(`✅ UNA_URL updated to: ${newUrl}`);

    })();

    // --------- replace Bundle ID
    await (async () => {
      const answer = await askQuestion("Your app bundle id or package name (for example: com.example.app): ");
      const userInput = answer.trim().toLowerCase();

      const bundleId = userInput.trim();
      const bundlePattern = /^([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+$/;
      if (!bundlePattern.test(bundleId)) {
        console.log("❌ Invalid bundle ID.");
        return;
      }

      const appJsonData = await fs.readFile(appJsonPath, "utf8");
      const appJson = JSON.parse(appJsonData);

      appJson.expo = appJson.expo || {};
      appJson.expo.android = appJson.expo.android || {};
      appJson.expo.ios = appJson.expo.ios || {};

      appJson.expo.android.package = bundleId;
      appJson.expo.ios.bundleIdentifier = bundleId;

      await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2), "utf8");
      console.log(`✅ Bundle ID updated to: ${bundleId}`);

    })();

  } catch (err) {
    console.error("❌ An error occurred:", err);
    const userInput = answer.trim().toLowerCase();
  } 
})();
