# core_math
Update date 更新日 2018.09.30

This is a part of inosyan's library. It contains codes related to mathematics.  

これはinosyanのライブラリの一部です。計算に関するコードを含んでいます。  

## Classes / クラス
----
### Size2
Indicates size by width and height.   

幅と高さで大きさを表します。

#### Constructor / コンストラクタ
Size2(width: number, height: number)
- width: Width value / 幅の値
- height: Height value / 高さの値

#### Methods / メソッド
##### toString()
Return the string indicated this instance.

インスタンスの内容を表す文字列を返します。

- Return Value / 戻り値
	- string / 文字列

##### clone()
Return the copy of instance.

インスタンスの複製を返します。

- Return Value / 戻り値
	- Size2

----
### Size3
Indicates size by width, height and depth.  

幅と高さと奥行きで大きさを表します。

#### Constructor / コンストラクタ
Size3(width: number, height: number, depth: number)
- width: Width value / 幅の値
- height: Height value / 高さの値
- depth: Depth value / 奥行きの値

#### Methods / メソッド
##### toString()
Return the string indicated this instance.

インスタンスの内容を表す文字列を返します。

- Return Value / 戻り値
	- string / 文字列

##### clone()
Return the copy of instance.

インスタンスの複製を返します。

- Return Value / 戻り値
	- Size3

##### rotate(direction: FourDirection)
Rotate specify the direction Forward/Back/Left/Right.

前後左右の向きを指定して回転させます。

- Parameter / パラメータ
	- direction Forward/Back/Left/Right / 前後左右の向き
- Return Value / 戻り値
	- Size3

----
### Vector3
Indicates coodinate by X, Y and Z.  

XYZで座標を表します。

#### Constructor / コンストラクタ
Vector3(x: number, y: number, z: number)
- x: X value / X座標の値
- y: Y value / Y座標の値
- z: Z value / Z座標の値
- isWorld: Whether is absolute position of world or not. / ワールドの絶対座標かどうか

#### Methods / メソッド
##### toString()
Return the string indicated this instance.

インスタンスの内容を表す文字列を返します。

- Return Value / 戻り値
	- string / 文字列

##### clone()
Return the copy of instance.

インスタンスの複製を返します。

- Return Value / 戻り値
	- Vector3

##### rotate(direction: FourDirection)
Rotate specify the direction Forward/Back/Left/Right.

前後左右の向きを指定して回転させます。

- Parameter / パラメータ
	- direction Forward/Back/Left/Right / 前後左右の向き
- Return Value / 戻り値
	- Vector3

##### add(v: Vector3)
Add value.

値を加算します。

- Parameter / パラメータ
	- v: value to be added / 加算する値
- Return Value / 戻り値
	- Vector3

##### subtract(v: Vector3)
Subtract value.

値を減算します。

- Parameter / パラメータ
	- v: value to be subtracted / 減算する値
- Return Value / 戻り値
	- Vector3

##### addSize(size: Size3)
Add value.

値を加算します。

- Parameter / パラメータ
	- size: value to be added / 加算する値
- Return Value / 戻り値
	- Vector3

##### addValue(x: number = 0, y: number = 0, z: number = 0)
Add value.

値を加算します。

- Parameter / パラメータ
	- x: X value to be added / 加算するXの値
	- y: Y value to be added / 加算するYの値
	- z: Z value to be added / 加算するZの値
- Return Value / 戻り値
	- Vector3

##### toPosition()
Return position

ポジションを返す

- Return Value / 戻り値
	- Position

##### setPosition(value: Position, isWorld: boolean = true)
Set position.

ポジションの値をセットします。

- Parameter / パラメータ
	- value: Position value / ポジションの値
	- isWorld: Whether is absolute position of world or not. / ワールドの絶対座標かどうか
- Return Value / 戻り値
	- Vector3

----
