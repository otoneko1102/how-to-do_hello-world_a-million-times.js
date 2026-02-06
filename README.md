# how-to-do_hello-world_a-million-times.js

[![PR Validation](https://github.com/oto-home/how-to-do_hello-world_a-million-times.js/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/oto-home/how-to-do_hello-world_a-million-times.js/actions/workflows/pr-validation.yml)

**JavaScript系で100万回Hello, Worldl!する方法**

ループや再帰を使わずに、100万回 "Hello, World!" を出力するクリエイティブな方法を集めています。

> [!TIP]
> 元ネタ: https://youtu.be/OHOTGcQmndQ

---

## 📋 ルール

| # | ルール | 説明 |
|---|--------|------|
| 1 | ❌ ループ禁止 | `for` / `while` / `forEach` は使用不可 |
| 2 | ❌ 再帰禁止 | 関数の再帰呼び出しは使用不可 |
| 3 | 📏 1000バイト以内 | ソースコードのファイルサイズ制限 |
| 4 | 📁 単一ファイル | `src/[dirname]/main.*` のみ許可 |

---

## 🚀 実装一覧

以下の実装が例として含まれています：

| 実装名 | 言語 | 説明 |
|--------|------|------|
| [array](src/array/) | JavaScript | 配列を使った方法 |
| [bitshift](src/bitshift/) | JavaScript | ビットシフトを使った方法 |
| [coffee_array](src/coffee_array/) | CoffeeScript | CoffeeScript + 配列 |
| [coffee_x10_16](src/coffee_x10_16/) | CoffeeScript | CoffeeScript + x10メソッド |
| [map](src/map/) | JavaScript | map関数を使った方法 |
| [new_function](src/new_function/) | JavaScript | Functionコンストラクタを使った方法 |
| [repeat](src/repeat/) | JavaScript | String.repeat を使った方法 |
| [replace](src/replace/) | JavaScript | String.replace を使った方法 |
| [ts_x10_16](src/ts_x10_16/) | TypeScript | TypeScript + x10メソッド |
| [x10_16](src/x10_16/) | JavaScript | x10メソッド（10回実行を6段ネスト） |

---

## 🧪 テスト

### 対応ファイル形式

- `main.js` - JavaScript (ESM)
- `main.cjs` - JavaScript (CommonJS)
- `main.mjs` - JavaScript (ESM, 明示的)
- `main.ts` - TypeScript
- `main.coffee` - CoffeeScript

### テストの実行

```bash
# 依存関係のインストール
npm install

# 特定の実装をテスト
npm test [dirname]

# 全てのテストを実行
npm run test:all

# ウォッチモードでテストを実行
npm run test:watch
```

### テスト内容

各 `src/[dirname]/main.*` に対して以下のテストを実行します：

| チェック項目 | 内容 |
|-------------|------|
| 📁 ファイル存在 | ディレクトリ内に唯一のメインファイルが存在すること |
| 📏 サイズ制限 | コードが1000バイト以内であること |
| 🚫 禁止キーワード | `for`, `while`, `forEach` が使用されていないこと |
| 🔄 再帰チェック | 関数が自身を再帰的に呼び出していないこと |
| ✅ 出力確認 | 正確に100万回 "Hello, World!" が出力されること |

---

## 🤝 貢献

新しい実装のアイデアがありますか？ぜひ貢献してください！

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

### 貢献者

[![Contributors](https://contrib.rocks/image?repo=oto-home/how-to-do_hello-world_a-million-times.js)](https://github.com/oto-home/how-to-do_hello-world_a-million-times.js/graphs/contributors)

### クイックスタート

```bash
# 1. リポジトリをフォーク & クローン
git clone https://github.com/YOUR_USERNAME/how-to-do_hello-world_a-million-times.js.git

# 2. 新しい実装ディレクトリを作成
mkdir src/your_method_name

# 3. メインファイルを作成
# src/your_method_name/main.js (or .ts, .coffee, etc.)

# 4. テストを実行
npm test your_method_name

# 5. Pull Requestを作成！
```

> [!WARNING]
> `src/[dirname]/main.*` 以外のファイルを変更するPRは自動的にクローズされます。

---
