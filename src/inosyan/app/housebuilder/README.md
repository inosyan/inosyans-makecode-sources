# House Builder
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/housebuilder.gif)  
Update date 更新日 2018.10.08  
Project name / プロジェクト名: inosyan_housebuilder  

This is the work titled "House Builder" created by inosyan.  
It contains programs to build houses.  
これはイノシャンの作品「ハウスビルダー」です。  
家を建てるプログラムを含んでいます。  
[[Youtube]](https://youtu.be/MyUZA6bOkoo)  

It uses inosyan's library.  
イノシャンのライブラリを使用しています。  
- inosyan_core_math
- inosyan_core_utils
- inosyan_core_creator

Other works, newest version, source code is on [GitHub](https://github.com/inosyan/inosyans-makecode-sources).    
その他の作品、最新版、ソースコードは [GitHub](https://github.com/inosyan/inosyans-makecode-sources) に掲載してあります。

## buildHouse
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/housebuilder.gif)  

This is program to build houses.  
First, stand in front of the place that you want to build.  
家を建てるプログラムです。  
まず、建てたい箇所の前に立ち、たいまつを置きます。プレイヤーから１マスとなりにおいてください。  

![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/blockcleaner/put-torch.gif)  

Next, type 'buildhouse <size> <house type> <option>' with chat command to execute.  
Size is a number composed of 2 digit width, depth, height. For example, 070503 means width: 7, depth: 5, height: 3.  
つぎに、チャットコマンドで「buildhouse <サイズ> <ハウスタイプ> <オプション>」と打ち実行します。  
サイズは、幅,奥行き,高さを2桁ずつ組み合わせた数字です。例えば、070503 は 幅: 7, 奥行き: 5, 高さ: 3 を意味します。  

House type is a number that specifies the appearance of house.  
ハウスタイプは、家の見た目を指定する数字です。  
- 1: WoodenDark / 暗い木造の家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type1.gif)  
- 2: WoodenLight / 明るい木造の家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type2.gif)  
- 3: Stone / 石の家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type3.gif)  
- 4: Quartz / 水晶の家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type4.gif)  
- 5: Brick / レンガの家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type5.gif)  
- 6: Sand / 砂の家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type6.gif)  
- 7: DarkOak / ダークオークの家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type7.gif)  
- 8: Oak / オークの家  
![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/house-type8.gif)  

Option is a number composed of 1 digit optoins.  
オプションは、1桁ずつのオプション項目を組み合わせた数字です。  

Option is a number composed of 1 digit optoins.  
オプションは、1桁ずつのオプション項目を組み合わせた数字です。  
- Inward open door / 内開きかどうか  
    - 0: Outward / 外開き  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/door-outer.gif)  
    - 1: Inward / 内開き  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/door-inner.gif)  
- Without furniture / 家具を置かないかどうか
    - 0: 置く  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/furniture-with.gif)  
    - 1: 置かない  
    ![](https://raw.githubusercontent.com/inosyan/inosyans-makecode-sources/master/img/housebuilder/furniture-without.gif)  
