import {
  _decorator,
  EventTarget,
  Component,
  Node,
  Enum,
  UIOpacity,
  UITransform,
  EventTouch,
  Vec3,
  Vec2,
  Size,
  CCInteger,
} from 'cc'

const { ccclass, property } = _decorator

/**
 * Global event listener instance
 */
export const instance = new EventTarget()

export const SET_JOYSTICK_TYPE = 'SET_JOYSTICK_TYPE'

/**
 * Direction type
 */
export enum DirectionType {
  FOUR,
  EIGHT,
  ALL,
}

/**
 * Speed type
 */
export enum SpeedType {
  STOP,
  NORMAL,
  FAST,
}

/**
 * Joystick type
 */
export enum JoystickType {
  FIXED,
  FOLLOW,
}

export interface JoystickDataType {
  speedType: SpeedType
  /**
   * Movement vector
   */
  moveVec: Vec3
}

/**
 * Joystick
 */
@ccclass('Joystick')
export class Joystick extends Component {
  @property({
    type: Node,
    displayName: 'Dot',
    tooltip: 'Joystick control point.',
  })
  dot: Node | null = null

  @property({
    type: Node,
    displayName: 'Ring',
    tooltip: 'Joystick background node.',
  })
  ring: Node | null = null

  @property({
    type: Enum(JoystickType),
    displayName: 'Touch Type',
    tooltip: 'Touch type.',
  })
  joystickType = JoystickType.FIXED

  @property({
    type: Enum(DirectionType),
    displayName: 'Direction Type',
    tooltip: 'Direction type.',
  })
  directionType = DirectionType.ALL

  @property({
    tooltip: 'The position of the joystick.',
  })
  _stickPos = new Vec3()

  @property({
    tooltip: 'Touch location.',
  })
  _touchLocation = new Vec2()

  @property({
    type: CCInteger,
    displayName: 'Ring Radius',
    tooltip: 'Ring radius.',
  })
  radius = 50

  onLoad() {
    if (!this.dot) {
      console.warn('Joystick Dot is null!')
      return
    }

    if (!this.ring) {
      console.warn('Joystick Ring is null!')
      return
    }

    const uiTransform = this.ring.getComponent(UITransform)
    const size = this.radius * 2
    const ringSize = new Size(size, size)
    uiTransform?.setContentSize(ringSize)
    this.ring.getChildByName('BG')!.getComponent(UITransform)?.setContentSize(ringSize)

    this._initTouchEvent()
    // hide joystick when follow
    const uiOpacity = this.node.getComponent(UIOpacity)
    if (this.joystickType === JoystickType.FOLLOW && uiOpacity) {
      uiOpacity.opacity = 0
    }
  }

  /**
   * When enabled
   */
  onEnable() {
    instance.on(SET_JOYSTICK_TYPE, this._onSetJoystickType, this)
  }

  /**
   * When disabled
   */
  onDisable() {
    instance.off(SET_JOYSTICK_TYPE, this._onSetJoystickType, this)
  }

  /**
   * Change joystick type
   * @param type
   */
  _onSetJoystickType(type: JoystickType) {
    this.joystickType = type
    const uiOpacity = this.node.getComponent(UIOpacity)
    if (uiOpacity) {
      uiOpacity.opacity = type === JoystickType.FIXED ? 255 : 0
    }
  }

  /**
   * Initialize touch events
   */
  _initTouchEvent() {
    // set the size of joystick node to control scale
    this.node.on(Node.EventType.TOUCH_START, this._touchStartEvent, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this._touchMoveEvent, this)
    this.node.on(Node.EventType.TOUCH_END, this._touchEndEvent, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this._touchEndEvent, this)
  }

  /**
   * Touch start callback function
   * @param event
   */
  _touchStartEvent(event: EventTouch) {
    if (!this.ring || !this.dot) return

    instance.emit(Node.EventType.TOUCH_START, event)

    const location = event.getUILocation()
    const touchPos = new Vec3(location.x, location.y)

    if (this.joystickType === JoystickType.FIXED) {
      this._stickPos = this.ring.getPosition()

      // Vector relative to center
      const moveVec = touchPos.subtract(this.ring.getPosition())
      // The distance between the touch point and the center of the circle
      const distance = moveVec.length()

      // The finger touches inside the circle, the joystick follows the touch point
      if (this.radius > distance) {
        this.dot.setPosition(moveVec)
      }
    } else if (this.joystickType === JoystickType.FOLLOW) {
      // Record the joystick position and use it for touch move
      this._stickPos = touchPos
      this.node.getComponent(UIOpacity)!.opacity = 255
      this._touchLocation = event.getUILocation()
      // Change the position of the joystick
      this.ring.setPosition(touchPos)
      this.dot.setPosition(new Vec3())
    }
  }

  /**
   * Touch move callback function
   * @param event
   */
  _touchMoveEvent(event: EventTouch) {
    if (!this.dot || !this.ring) return

    // If the touch start position is the same as touch move, move is prohibited
    if (this.joystickType === JoystickType.FOLLOW && this._touchLocation === event.getUILocation()) {
      return
    }

    // Get touch coordinates with circle as anchor
    const location = event.getUILocation()
    const touchPos = new Vec3(location.x, location.y)
    // Move vector
    const moveVec = touchPos.subtract(this.ring.getPosition())
    const distance = moveVec.length()

    let speedType = SpeedType.NORMAL
    if (this.radius > distance) {
      this.dot.setPosition(moveVec)
      speedType = SpeedType.NORMAL
    } else {
      // The joystick stays in the circle forever and follows the touch to update the angle in the circle
      this.dot.setPosition(moveVec.normalize().multiplyScalar(this.radius))
      speedType = SpeedType.FAST
    }

    instance.emit(Node.EventType.TOUCH_MOVE, event, {
      speedType,
      moveVec: moveVec.normalize(),
    })
  }

  /**
   * Touch end callback function
   * @param event
   */
  _touchEndEvent(event: EventTouch) {
    if (!this.dot || !this.ring) return

    this.dot.setPosition(new Vec3())
    if (this.joystickType === JoystickType.FOLLOW) {
      this.node.getComponent(UIOpacity)!.opacity = 0
    }

    instance.emit(Node.EventType.TOUCH_END, event, {
      speedType: SpeedType.STOP,
    })
  }
}
