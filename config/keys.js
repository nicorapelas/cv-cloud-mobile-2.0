// Environment-based configuration for React Native/Expo
// This file switches between dev and prod configs based on __DEV__

let keys

if (__DEV__) {
  // Development mode (Expo dev server, npx expo start)
  keys = require('./keys_dev').keys
} else {
  // Production mode (Expo production build, EAS Build)
  keys = require('./keys_prod').keys
}

module.exports = keys








