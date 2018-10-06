# Movie Camera
Update date 更新日 2018.10.06  
Project name / プロジェクト名: inosyan_moviecamera    

This is the work titled "Movie Camera" created by inosyan.  
It controls camera programmatically for movie capturing.

これはイノシャンの作品「ムービーカメラ」です。  
動画撮影に便利なカメラの動きをプログラムで制御します。

It uses inosyan's library.  
イノシャンのライブラリを使用しています。  
- inosyan_core_math

Other works, source code is on [GitHub](https://github.com/inosyan/inosyans-makecode-sources).    
その他の作品、ソースコードは [GitHub](https://github.com/inosyan/inosyans-makecode-sources) に掲載してあります。


## Orbit Camera / オービットカメラ
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/orbit.gif)  

Rotate around the target.  
First, move to the position where would be center, type 'settarget' with chat command to set it to be target.  
Move to the start position, type 'orbit <Frame Count> <Degree>' with chat command to execute.  
For example, 'orbit 360 360' means that frame count is 360 and degree is 360. It will rotate 360 degrees around the target by 1 degree to the start position.  
Negative value makes it rotate reverse direction.  

ターゲットの周りを回転します。  
まず、中心になる位置まで移動し、チャットコマンドで 「settarget」と打ち、ターゲットを設定します。  
撮影を開始したい位置まで移動し、チャットコマンド 「orbit <フレーム数> <角度>」で実行します。  
例えば「orbit 360 360」なら、フレーム数が360で、角度が360度です。つまり、1度ずつ360回動き、ターゲットを中心に1周回ってもとの位置に戻ります。  
角度をマイナスの値にしたら、逆方向に回転します。  

## Around Camera / アラウンドカメラ
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/around.gif)  

Looking around from the player's position.  
First, move to the position where would be the position at the end of line of sight, type 'settarget' with chat command to set it to be target.  
Move to the center of movie shooting, type 'around <Frame Count> <Degree>' with chat command to execute.  
For example, 'around 360 360' means that frame count is 360 and degree is 360. It will look 360 degrees around the player by 1 degree to the start position with keeping the line of sight to the height of target.  

プレイヤーを中心に周りを見渡します。  
まず、視線の先にあたる位置まで移動し、チャットコマンドで 「settarget」と打ち、ターゲットを設定します。  
撮影する中心まで移動し、チャットコマンドで「around <フレーム数> <角度>」で実行します。  
例えば「around 360 360」なら、フレーム数が360で、角度が360度です。つまり、1度ずつ360回動き、ターゲットの高さに視線を置き、プレイヤーを中心に1周回ってもとの角度に戻ります。  
角度をマイナスの値にしたら、逆方向に回転します。  

## Dolly Camera / ドリーカメラ
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/dolly.gif)  

Moving on a straight line with the direction of camera fixed.  
First, move to the end of line of sight, type 'settarget' with chat command to set it to be target.  
Nest, move to the start position, 'setstart' with chat command to set it to be start position.  
And move to the end position, 'setend' with chat command to set it to be end position.  
Finally, 'dolly <Frame Count>' with chat command to execute.  
For example, 'dolly 360' means that frame count is 360. It will move on a straight line 100 frames while loot at the target from the start position to the end position.  

ターゲットを見ながら直線上を動きます。  
まず、視線の先にあたる位置まで移動し、チャットコマンドで 「settarget」と打ち、ターゲットを設定します。  
次に、撮影の開始地点まで行き、チャットコマンドで 「settstart」と打ち、開始地点を設定します。  
そして、撮影の終了地点まで行き、チャットコマンドで 「settend」と打ち、終了地点を設定します。  
最後に、チャットコマンドで「dolly <フレーム数>」で実行します。  
例えば「dolly 360」なら、フレーム数が360です。ターゲットに視線を置き、開始地点から終了地点まで直線的に100コマ動きます。  

## Fix Dolly Camera / フィックスドリーカメラ
It is almost same as dolly camera except that the direction of camera is fixed.  
After setting 'settarget', 'setstart' and 'setend', 'fixdolly <Frame Count> <Fix Position>' with chat command to execute.  
Fix Position means the position on the timeline where you want to fix the direction of camera.  

ドリーカメラとほぼ同じですが、カメラの向きが固定されている点が違います。  
「settarget」、「setstart」、「setend」を設定したあと、チャットコマンドで「fixdolly <フレーム数> <フィックスポジション>」で実行します。  
フィックスポジションは、カメラを固定したい時間軸上の位置です。  

For example, '1' (Start) means the line of sight from the start position,  
例えば「1 (Start)」なら、開始位置からのターゲットへの視線、  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/fixdolly1.gif)  

'3' (End) means the line of sight from the end position,  
「3 (End)」なら、終了位置からのターゲットへの視線、  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/fixdolly3.gif)  

and '2' (Middle) means the line of sight from the middle position between start position and end position.  
「2 (Middle)」なら、開始位置と終了位置の中間点からのターゲットへの視線でカメラの向きを固定します。  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/moviecamera/fixdolly2.gif)  
