#!/usr/bin/env node

/**
 * This script is used to rebrand the app to a different UNACMS website.
 */

const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
const { exec } = require("child_process");

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
      const answer1 = await askQuestion("Your app bundle id or package name (for example: com.example.app): ");
      const bundleInput = answer1.trim().toLowerCase();
      const nameInput = await askQuestion("Your app name: ");

      const name = nameInput.trim();
      const bundleId = bundleInput.trim();
      const bundlePattern = /^([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+$/;
      if (!bundlePattern.test(bundleId)) {
        console.log("❌ Invalid bundle ID.");
        return;
      }

      const appJsonData = await fs.readFile(appJsonPath, "utf8");
      const appJson = JSON.parse(appJsonData);
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")          // spaces → hyphens
        .replace(/[^a-z0-9-]/g, "");   // remove invalid characters

      appJson.expo.name = name;
      appJson.expo.slug = slug;

      appJson.expo = appJson.expo || {};
      appJson.expo.android = appJson.expo.android || {};
      appJson.expo.ios = appJson.expo.ios || {};

      appJson.expo.android.package = bundleId;
      appJson.expo.ios.bundleIdentifier = bundleId;

      await fs.writeFile(appJsonPath, JSON.stringify(appJson, null, 2), "utf8");
      console.log(`✅ Bundle ID updated to: ${bundleId}`);

    })();

    // --------- recreate `ios` and `android` folders
    await (async () => {
      const answer = await askQuestion("Recreate native app folders (Y or N): ");
      const userInput = answer.trim().toLowerCase();


      if (userInput != 'y' && userInput != 'n' && userInput != '') {
        console.log("❌ Answer Y or N.");
        return;
      }


      if (userInput == 'y' || userInput == '') {
        
        // Delete android and ios folders if they exist
        const androidPath = path.join(root, "android");
        const iosPath = path.join(root, "ios");

        try {
          await fs.rm(androidPath, { recursive: true, force: true });
          await fs.rm(iosPath, { recursive: true, force: true });
          console.log("✅ Old native folders deleted");
        } catch (err) {
          console.error("❌ Failed to delete native folders:", err);
        }

        // Recreate native folders using expo prebuild
        try {
          await new Promise((resolve, reject) => {
            console.log("Recreating...");
            exec("npx expo prebuild", (err, stdout, stderr) => {
              if (err) {
                console.error("❌ Failed to run expo prebuild:", err);
                reject(err);
              } else {
                console.log(stdout);
                resolve(stdout);
              }
            });
          });
          console.log("✅ Native app folders were recreated");
        } catch (err) {
          console.error("❌ Error during prebuild:", err);
        }
        
      }

      if (userInput == 'n') {        
        console.log("⚠️ You chose not to recreate native folders. Some changes may not take effect in native builds.");
      }

    })();

  } catch (err) {
    console.error("❌ An error occurred:", err);
    const userInput = answer.trim().toLowerCase();
  } 
})();
