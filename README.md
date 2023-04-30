# epejso

![uikit](https://user-images.githubusercontent.com/53619699/117480426-8d945680-af9c-11eb-802b-63ca593a8c07.jpg)

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
npx epejso -w
```
markdownファイルを修正されるとブラウザに変更内容が反映します。

デフォルトは、nodeプロジェクト配下を監視します。起動引数でディレクトリを指定することもできます。

```
npx epejso -w c:\mdfiles
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
