/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>

#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

static NSString *appKey = @"c1d7c1b56b05627e53c6032d";     //填写appkey
static NSString *channel = nil;    //填写channel   一般为nil
static BOOL isProduction = true;   //填写isProdurion  平时测试时为false ，生产时填写true

@interface AppDelegate : UIResponder <UIApplicationDelegate,JPUSHRegisterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
