# Block Cleaner / ブロッククリーナー
Update date 更新日 2018.10.08  
Project name / プロジェクト名: inosyan_blockcleaner  

This is the work titled "Block Cleaner" created by inosyan.  
It contains programs to clear blocks in a wide area.  

これはイノシャンの作品「ブロッククリーナー」です。  
広範囲のブロックを消すプログラムを含んでいます。  

It uses inosyan's library.  
イノシャンのライブラリを使用しています。  
- inosyan_core_math
- inosyan_core_utils
- inosyan_core_creator

Other works, newest version, source code is on [GitHub](https://github.com/inosyan/inosyans-makecode-sources).    
その他の作品、最新版、ソースコードは [GitHub](https://github.com/inosyan/inosyans-makecode-sources) に掲載してあります。

## Clear Blocks / ブロック消去
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblock.gif)  

Clear blocks in front of player.  
First, stand in front of the place that you want to clear.  
プレイヤーの前のブロックを消します。  
まず、消したい箇所の前に立ち、たいまつを置きます。プレイヤーから１マスとなりにおいてください。  

![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/put-torch.gif)  


You can configure the clear range, whether fill ground with the blocks under the player.  
You can specify the direction to clear by putting a torch in front of player.  

Next, type 'clearblocks <size> <option>' with chat command to execute.  
Size is a number composed of 2 digit width, depth, height. For example, 070503 means width: 7, depth: 5, height: 3.  
つぎに、チャットコマンドで「clearblocks <サイズ> <オプション>」と打ち実行します。  
サイズは、幅,奥行き,高さを2桁ずつ組み合わせた数字です。例えば、070503 は 幅: 7, 奥行き: 5, 高さ: 3 を意味します。  

Option is a number composed of 1 digit optoins.  
オプションは、1桁ずつのオプション項目を組み合わせた数字です。  

- 1st digit: Fill ground / 1桁目: 地面を埋めるかどうか
    - 0: Do not fill / 埋めない  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblok-no-fill-ground.gif)  
    - 1: Fill with player's platform / プレイヤーの足元のブロックで埋める  
	![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblock.gif)  
    - 2: Fill with Air / 空気で埋める  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblock-air.gif)  

- 2nd digit: Include torch to the range / 2桁目: トーチを範囲に含めるかどうか
    - 0: Do not include / 含めない  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblock-torch-no.gif)  
    - 1: Include / 含める  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/clearblock-torch.gif)

For example, 10 means include torch and dont'fill ground.  
例えば 10 はトーチを範囲に含め、地面を埋めないことを表します。  

## Place Block Under Foot / 足元へのブロック設置
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/placeblockunderfoot.gif)  

Place a block under the player. When you want to clear blocks in the air, you can not place a torch without a platform, and you can not specify the direction to clear. In such a case, you can use this command to create a block under your foot.  
プレイヤーの足元に一つブロックを置きます。空中にあるブロックを消したい時、足場がないとたいまつを置けず、消したい方向を指定することができません。そのような時、このコマンドを使えばブロックを足元に一つ作りだすことができます。  

Move to the position where you want to place a block, type 'placeblockunderfoot' with chat command to execute.  
まず、ブロックを置きたい場所まで移動し、チャットコマンドで「placeblockunderfoot」と打って実行します。  
