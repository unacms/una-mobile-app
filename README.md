# UNACMS Mobile Apps 👋

This is source code of UNA mobile apps for iOS and Android based on [Expo](https://expo.dev).
Mobile apps need to have [Nexus](https://unacms.com/view-product/nexus) UNA app installed.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create native iOS and Android project files

   ```bash
   npx expo prebuild
   ```

3. Run iOS app

   ```bash
   npm run ios
   ```
   or Android app
   ```bash
   npm run android
   ```

## Rebranding

- Edit `constants/setings.ts` to specify your domain and other settings.  
- Edit `constants/theme.ts` to specify custom colors.
- Edit images in `assets/images` to change app icons.
- Edit `app.js` to change app bundle and app name.
- Make sure to run `npx expo prebuild` after editing `app.js` file.

Automate some the of the above changes by running:

```bash
npm run rebrand
```

## Learn more

To learn more about extending this project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
