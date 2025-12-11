#!/bin/bash

echo "Chrome拡張機能のビルドを開始します..."

# distディレクトリをクリーンアップ
echo "クリーンアップ中..."
rm -rf dist

# ビルドの実行
echo "ビルド中..."
npm run build

# manifest.jsonとアイコンをコピー
echo "静的ファイルをコピー中..."
cp public/manifest.json dist/
cp -r public/icons dist/

# HTMLファイルがdistに出力されているか確認
if [ ! -f dist/popup.html ] || [ ! -f dist/options.html ]; then
  echo "HTMLファイルが見つかりません。HTMLファイルをコピーします..."
  cp popup.html dist/
  cp options.html dist/
fi

echo "ビルドが完了しました!"
echo "Chrome拡張機能は 'dist' ディレクトリに出力されました。"
echo ""
echo "拡張機能をChromeにインストールする方法:"
echo "1. Chrome で chrome://extensions/ を開く"
echo "2. 右上の「デベロッパーモード」をオンにする"
echo "3. 「パッケージ化されていない拡張機能を読み込む」をクリック"
echo "4. 'dist' ディレクトリを選択"