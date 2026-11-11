// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v17)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.6.0"),
        .package(name: "CapacitorCommunityKeepAwake", path: "../../../node_modules/@capacitor-community/keep-awake"),
        .package(name: "CapacitorApp", path: "../../../node_modules/@capacitor/app"),
        .package(name: "CapacitorAppLauncher", path: "../../../node_modules/@capacitor/app-launcher"),
        .package(name: "CapacitorBrowser", path: "../../../node_modules/@capacitor/browser"),
        .package(name: "CapacitorDevice", path: "../../../node_modules/@capacitor/device"),
        .package(name: "CapacitorNetwork", path: "../../../node_modules/@capacitor/network"),
        .package(name: "CapacitorSplashScreen", path: "../../../node_modules/@capacitor/splash-screen"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/@capacitor/status-bar"),
        .package(name: "CapacitorTextZoom", path: "../../../node_modules/@capacitor/text-zoom"),
        .package(name: "CapawesomeCapacitorManagedConfigurations", path: "../../../node_modules/@capawesome/capacitor-managed-configurations"),
        .package(name: "CapawesomeCapacitorScreenOrientation", path: "../../../node_modules/@capawesome/capacitor-screen-orientation"),
        .package(name: "CapgoCapacitorNativeBiometric", path: "../../../node_modules/@capgo/capacitor-native-biometric"),
        .package(name: "DvsaCapacitorPluginAsam", path: "../../../node_modules/@dvsa/capacitor-plugin-asam"),
        .package(name: "DvsaCapacitorPluginMsauth", path: "../../../node_modules/@dvsa/capacitor-plugin-msauth"),
        .package(name: "SentryCapacitor", path: "../../../node_modules/@sentry/capacitor"),
        .package(name: "CordovaPluginIosDisableshaketoedit", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginIosDisableshaketoedit"),
        .package(name: "CordovaPluginIsDebug", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginIsDebug"),
        .package(name: "CordovaPluginSecureStorageEcho", path: "../../capacitor-cordova-ios-plugins/sources/CordovaPluginSecureStorageEcho"),
        .package(name: "CordovaSqliteStorage", path: "../../capacitor-cordova-ios-plugins/sources/CordovaSqliteStorage")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorCommunityKeepAwake", package: "CapacitorCommunityKeepAwake"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorAppLauncher", package: "CapacitorAppLauncher"),
                .product(name: "CapacitorBrowser", package: "CapacitorBrowser"),
                .product(name: "CapacitorDevice", package: "CapacitorDevice"),
                .product(name: "CapacitorNetwork", package: "CapacitorNetwork"),
                .product(name: "CapacitorSplashScreen", package: "CapacitorSplashScreen"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CapacitorTextZoom", package: "CapacitorTextZoom"),
                .product(name: "CapawesomeCapacitorManagedConfigurations", package: "CapawesomeCapacitorManagedConfigurations"),
                .product(name: "CapawesomeCapacitorScreenOrientation", package: "CapawesomeCapacitorScreenOrientation"),
                .product(name: "CapgoCapacitorNativeBiometric", package: "CapgoCapacitorNativeBiometric"),
                .product(name: "DvsaCapacitorPluginAsam", package: "DvsaCapacitorPluginAsam"),
                .product(name: "DvsaCapacitorPluginMsauth", package: "DvsaCapacitorPluginMsauth"),
                .product(name: "SentryCapacitor", package: "SentryCapacitor"),
                .product(name: "CordovaPluginIosDisableshaketoedit", package: "CordovaPluginIosDisableshaketoedit"),
                .product(name: "CordovaPluginIsDebug", package: "CordovaPluginIsDebug"),
                .product(name: "CordovaPluginSecureStorageEcho", package: "CordovaPluginSecureStorageEcho"),
                .product(name: "CordovaSqliteStorage", package: "CordovaSqliteStorage")
            ]
        )
    ]
)
