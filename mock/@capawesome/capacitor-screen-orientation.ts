import {
  GetCurrentOrientationResult,
  LockOptions,
  ScreenOrientationChangeListener,
  ScreenOrientationPlugin,
} from '@capawesome/capacitor-screen-orientation/dist/esm/definitions';
import { PluginListenerHandle } from '@capacitor/core';

export const ScreenOrientation: ScreenOrientationPlugin = {
  async lock(options: LockOptions): Promise<void> {
  },
  async unlock(): Promise<void> {
  },
  async getCurrentOrientation(): Promise<GetCurrentOrientationResult> {
    return {} as GetCurrentOrientationResult;
  },
  addListener(
    eventName: 'screenOrientationChange',
    listenerFunc: ScreenOrientationChangeListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle {
    return null;
  },
  async removeAllListeners(): Promise<void> {
  },
};

export enum OrientationType {
  /**
   * The orientation is either landscape-primary or landscape-secondary.
   */
  LANDSCAPE = 'landscape',
  /**
   * The orientation is in the primary landscape mode.
   */
  LANDSCAPE_PRIMARY = 'landscape-primary',
  /**
   * The orientation is in the secondary landscape mode.
   */
  LANDSCAPE_SECONDARY = 'landscape-secondary',
  /**
   * The orientation is either portrait-primary or portrait-secondary.
   */
  PORTRAIT = 'portrait',
  /**
   * The orientation is in the primary portrait mode.
   */
  PORTRAIT_PRIMARY = 'portrait-primary',
  /**
   * The orientation is in the secondary portrait mode.
   */
  PORTRAIT_SECONDARY = 'portrait-secondary'
}
