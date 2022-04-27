# cocos-creator-touchscreen-joystick

> Cocos Creator 3.4.2 Touchscreen Joystick Demo

### This project is highly inspired on [github.com/YunYouJun/cocos-creator-joystick](https://github.com/YunYouJun/cocos-creator-joystick).

## Usage

```sh
git clone https://github.com/Hashish-Crypto/cocos-creator-touchscreen-joystick.git
cd cocos-creator-touchscreen-joystick
npm install
```

Open with `Cocos Creator 3.4.2` and VS Code.

You can see it in `demo.fire` scene.

## Function

- Joystick Type
  - [x] Fixed
  - [x] Follow
- Player
  - [x] rotation
  - [x] move
- Touch Place (custom Joystick width and height)
  - [x] Full Screen
  - [x] Half Screen
- Decoupling between nodes (only need to monitor Touch events, without mounting the Player node to Joystick, can control
  many Players)

### Joystick

| Argument     | Type                                     | Default            | Description              | Customizable |
| ------------ | ---------------------------------------- | ------------------ | ------------------------ | ------------ |
| joystickType | JoystickType.FIXED / JoystickType.FOLLOW | JoystickType.FIXED | types of joystick        | √            |
| ring         | cc.Node                                  | -                  | joystick background node | √            |
| dot          | cc.Node                                  | -                  | joystick control node    | √            |

### Player

| Argument    | Type                                               | Default                    | Description                   | Controlled by Joystick | Customizable |
| ----------- | -------------------------------------------------- | -------------------------- | ----------------------------- | ---------------------- | ------------ |
| rigidBody   | boolean                                            | false                      | RigidBody (Physics) mode      | ×                      | x            |
| moveDir     | Vec2                                               | cc.v2(0, 1) // straight up | initial direction of movement | √                      | √            |
| \_speedType | SpeedType.STOP / SpeedType.NORMAL / SpeedType.FAST | SpeedType.NORMAL           | speed type                    | √                      | ×            |
| \_moveSpeed | cc.Integer                                         | 0                          | speed of movement             | ×                      | ×            |
| stopSpeed   | cc.Integer                                         | 0                          | speed when stop               | ×                      | √            |
| normalSpeed | cc.Integer                                         | 100                        | normal speed                  | ×                      | √            |
| fastSpeed   | cc.Integer                                         | 200                        | fast speed                    | ×                      | √            |

## Structure

> assets/script

| Filename    | Description     | Function                                                                                                     |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| Joystick.js | Joystick Script | store joystick main logic (include some type definitions and global events listen)                           |
| Player.js   | Player Script   | listen events emitted by Joystick (You can customize it.)                                                    |
| UI.js       | UI              | provide switch joystick type function for online preview（You can delete it directly if you don't need it.） |
