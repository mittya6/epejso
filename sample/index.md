---
Title: MarkDownから手順書を作成しました。
CreateDate: 2021/07/15
UpdateDate: 2021/08/15
---

# MarkdownからHTMLが作成されました。
* * *

1. First item
2. Second item
3. Third item


- First item
- Second item
- Third item

| Header | Header | Right  |
| ------ | ------ | -----: |
|  Cell  |  Cell  |   $10  |
|  Cell  |  Cell  |   $20  |

![エビフライトライアングル](ea60f30b.png "MarkdownからHTMLが作成されました。")

1. asd

```javascript:hogehoge.js
function test(){
  console.log('hello');
}
```
# 使い方
## 本当の使い方

1. まずはコマンド実行

```dos:testです。
cp ./test ./test/oge
mv /tmp/hoge /hoge
```

2. 休憩する。

使い方は簡単。staticメソッドを呼び出すだけ。

```java
import org.apache.commons.text.StringEscapeUtils;

public class Main {

  public static void main(String[] args) {
    
    String tarStr;
    
    //htmlをエスケープ
    System.out.println("・HTMLをエスケープ");
    tarStr = "<Franï¿½ais>";
    System.out.println("変換前：" + tarStr);
    System.out.println("変換後：" + StringEscapeUtils.escapeHtml4(tarStr));
    
    System.out.println();
    
    //JSONをエスケープ
    System.out.println("・JSONをエスケープ");
    tarStr = "He didn't say, \"Stop!\"";
    System.out.println("変換前：" + tarStr);
    System.out.println("変換後：" + StringEscapeUtils.escapeJson(tarStr));
    
    System.out.println();
    
    //CSVをエスケープ
    System.out.println("・CSVをエスケープ");
    tarStr = "\",";
    System.out.println("変換前：" + tarStr);
    System.out.println("変換後：" + StringEscapeUtils.escapeCsv(tarStr));
  }
}
```
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5

# Markdown plus h2 with a custom ID ##         {#id-goes-here}
[Link back to H2](#id-goes-here)

This is a paragraph, which is text surrounded by whitespace. Paragraphs can be on one 
line (or many), and can drone on for hours.  

Here is a Markdown link to [Warped](https://warpedvisions.org), and a literal <http://link.com/>. 
Now some SimpleLinks, like one to [google] (automagically links to are-you-
feeling-lucky), a [wiki: test] link to a Wikipedia page, and a link to 
[foldoc: CPU]s at foldoc.  

Now some inline markup like _italics_,  **bold**, and `code()`. Note that underscores in 
words are ignored in Markdown Extra.

> Blockquotes are like quoted text in email replies
>> And, they can be nested

* Bullet lists are easy too
- Another one
+ Another one

1. A numbered list
2. Which is numbered
3. With periods and a space

- hoge
- hoghogege

And now some code:

    // Code is just text indented a bit
    which(is_easy) to_remember();

```javascript
// Markdown extra adds un-indented code blocks too

if (this_is_more_code == true && !indented) {
    // tild wrapped code blocks, also not indented
}
```

Text with  
two trailing spaces  
(on the right)  
can be used  
for things like poems  

#### Horizontal rules

--------------------------

This is a div wrapping some Markdown plus.  Without the DIV attribute, it ignores the 
block. 


### Markdown plus tables ##

| Header | Header | Right  |
| ------ | ------ | -----: |
|  Cell  |  Cell  |   $10  |
|  Cell  |  Cell  |   $20  |

* Outer pipes on tables are optional
* Colon used for alignment (right versus left)

### Markdown plus definition lists ##

Bottled water
: $ 1.25
: $ 1.55 (Large)

Milk
Pop
: $ 1.75

* Multiple definitions and terms are possible
* Definitions can include multiple paragraphs too

*[ABBR]: Markdown plus abbreviations (produces an <abbr> tag)