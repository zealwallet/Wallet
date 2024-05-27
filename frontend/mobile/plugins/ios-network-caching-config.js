const { withAppDelegate } = require('@expo/config-plugins')

const modifyAppDelegate = (contents) => {
    const header = `#import <React/RCTHTTPRequestHandler.h>\n`

    if (!contents.includes(header.trim())) {
        contents = contents.replace(
            /#import <React\/RCTLinkingManager.h>\n/,
            `$&${header}`
        )
    }

    const cachingCode = `
// Set up custom caching for network requests
NSURLCache *URLCache = [[NSURLCache alloc] initWithMemoryCapacity:100 * 1024 * 1024
                                                         diskCapacity:200 * 1024 * 1024
                                                             diskPath:nil];
[NSURLCache setSharedURLCache:URLCache];

RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
      NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
      sessionConfiguration.requestCachePolicy = NSURLRequestUseProtocolCachePolicy;
      sessionConfiguration.URLCache = URLCache;
    return sessionConfiguration;
});
// End custom caching
    `
    if (!contents.includes('// Set up custom caching for network requests')) {
        const didFinishLaunchingWithOptionsIndex = contents.indexOf(
            '- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions'
        )
        if (didFinishLaunchingWithOptionsIndex !== -1) {
            const insertionPoint =
                contents.indexOf('{', didFinishLaunchingWithOptionsIndex) + 1
            contents =
                contents.slice(0, insertionPoint) +
                cachingCode +
                contents.slice(insertionPoint)
        }
    }

    return contents
}

module.exports = function withNetworkConfig(config) {
    return withAppDelegate(config, async (config) => {
        if (config.modResults.language === 'objcpp') {
            config.modResults.contents = modifyAppDelegate(
                config.modResults.contents
            )
        }
        return config
    })
}
