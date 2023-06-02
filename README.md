# epejso

![uikit](https://user-images.githubusercontent.com/53619699/242761828-fd968c77-3278-4a9d-bbc0-260858f06bd2.png)

----

markdownおよび参照されている画像から1枚のhtmlを生成します。


----

# Install

```
npm install git+https://github.com/mittya6/epejso.git
```

# Usage

## 監視モード
```
npx epejso -o
```
markdownファイルを修正されるとブラウザに変更内容が反映します。

デフォルトは、nodeプロジェクト配下を監視します。起動引数でディレクトリを指定することもできます。

```
npx epejso -o c:\mdfiles
```

## 出力モード
```
npx epejso -e
```
htmlを出力します。デフォルトは./targetフォルダに出力します。

起動引数でディレクトリを指定することもできます。

```
npx epejso -w c:\htmlfiles
```
