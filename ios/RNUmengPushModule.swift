//
//  RNUmengPushModule.swift
//  RNUmengPushModule
//
//  Copyright © 2021 jerloo. All rights reserved.
//

import Foundation

@objc(RNUmengPushModule)
class RNUmengPushModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
