module.exports = {
  mode: "production",

  module: {
    rules: [
      {
        // 対象となるファイルの拡張子
        test: /\.css/,
        use: [
          "style-loader",
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            //// オプションでCSS内のurl()メソッドの取り込みを禁止する
            options: { url: false }
          }
        ]
      }
    ]
  },
  // ES5(IE11等)向けの指定
  target: ["web", "es5"],

  entry: `./src/tailwind-default/tailwind.js`,

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "tailwind-default.js"
  }

};