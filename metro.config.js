const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// tflite සහ txt ෆයිල්ස් Assets විදිහට හඳුන්වා දීම
config.resolver.assetExts.push('tflite');
config.resolver.assetExts.push('txt');

module.exports = config;