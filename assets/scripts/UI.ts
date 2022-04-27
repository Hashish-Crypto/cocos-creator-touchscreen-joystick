import { _decorator, Component } from 'cc'
import { JoystickType, instance, SET_JOYSTICK_TYPE } from './Joystick'

const { ccclass } = _decorator

@ccclass('UI')
export class UI extends Component {
  /**
   * Use the fixed joystick
   */
  useFixedType() {
    instance.emit(SET_JOYSTICK_TYPE, JoystickType.FIXED)
  }

  /**
   * Use the follow joystick
   */
  useFollowType() {
    instance.emit(SET_JOYSTICK_TYPE, JoystickType.FOLLOW)
  }
}
