module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    'react-native-reanimated/plugin',
    ['@babel/plugin-transform-private-methods', { loose: true }],
    
  ],
};

