import UIKit
import Capacitor
import DvsaCapacitorPluginMsauth

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene else { return }

    window = UIWindow(windowScene: windowScene)
    window?.rootViewController = CAPBridgeViewController()
    window?.makeKeyAndVisible()

    if containsMsAuthCallback(connectionOptions.urlContexts) {
      return
    }

    SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    if containsMsAuthCallback(URLContexts) {
      return
    }

    SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    SceneDelegateProxy.shared.scene(scene, continue: userActivity)
  }

  private func containsMsAuthCallback(_ URLContexts: Set<UIOpenURLContext>) -> Bool {
    return URLContexts.contains { urlContext in
      var options: [UIApplication.OpenURLOptionsKey: Any] = [:]
      if let sourceApplication = urlContext.options.sourceApplication {
        options[.sourceApplication] = sourceApplication
      }
      return MsAuthPlugin.checkAppOpen(url: urlContext.url, options: options)
    }
  }
}
