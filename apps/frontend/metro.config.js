const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    moduleName === 'react-native/Libraries/Utilities/codegenNativeCommands'
  ) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(
        __dirname,
        'src/shims/react-native-codegenNativeCommands.web.ts'
      ),
    };
  }

  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/shims/react-native-maps.web.tsx'),
    };
  }

  if (
    platform === 'web' &&
    (moduleName === 'react-native' || moduleName.startsWith('react-native/'))
  ) {
    const mappedModuleName = moduleName.replace(
      /^react-native(?=\/|$)/,
      'react-native-web'
    );
    return context.resolveRequest(context, mappedModuleName, platform);
  }

  if (platform === 'web' && /Utilities\/Platform$/.test(moduleName)) {
    return context.resolveRequest(
      context,
      'react-native-web/dist/exports/Platform',
      platform
    );
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
