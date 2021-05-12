/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // resolver: {
  //  blacklistRE: blacklist([
  //    /ios\/Pods\/JitsiMeetSDK\/Frameworks\/JitsiMeet.framework\/assets\/node_modules\/react-native\/.*/,
  //  ]),
  // },
};

