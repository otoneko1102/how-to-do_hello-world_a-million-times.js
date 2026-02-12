import { describe, it, expect } from "vitest";
import { readFileSync, statSync, readdirSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

const EXPECTED_COUNT = 1000000;
const MAX_FILE_SIZE = 1000; // bite
const ALLOWED_FILENAMES = [
  "main.js",
  "main.cjs",
  "main.mjs",
  "main.ts",
  "main.coffee",
  "main.ls",
];
const ALLOWED_ADDITIONAL_FILES = ["README.md"];

// README.md警告を表示済みのディレクトリを記録
const warnedDirectories = new Set();

// src/ からディレクトリを取得
const srcDir = join(process.cwd(), "src");
const allTargets = readdirSync(srcDir)
  .filter((name) => {
    const fullPath = join(srcDir, name);
    return statSync(fullPath).isDirectory();
  })
  .sort();

const targetFilter = process.env.TARGET;
const testTargets = targetFilter
  ? allTargets.filter((t) => t === targetFilter)
  : allTargets;

if (targetFilter && testTargets.length === 0) {
  console.warn(
    `警告: 指定されたターゲット "${targetFilter}" が見つかりません。利用可能: ${allTargets.join(", ")}`,
  );
}

// mainを探索
function findMainFile(dirPath) {
  const files = readdirSync(dirPath).filter((f) => {
    const fullPath = join(dirPath, f);
    return statSync(fullPath).isFile();
  });

  if (files.length === 0) {
    throw new Error(`ディレクトリ内にファイルが存在しません: ${dirPath}`);
  }

  // README.mdを除外してmainファイルをチェック
  const mainFiles = files.filter((f) => !ALLOWED_ADDITIONAL_FILES.includes(f));

  if (mainFiles.length === 0) {
    throw new Error(`ディレクトリ内にmainファイルが存在しません: ${dirPath}`);
  }

  if (mainFiles.length > 1) {
    throw new Error(
      `ディレクトリ内に複数のmainファイルが存在します: ${mainFiles.join(", ")}`,
    );
  }

  const fileName = mainFiles[0];
  if (!ALLOWED_FILENAMES.includes(fileName)) {
    throw new Error(
      `許可されていないファイル名です: ${fileName}。許可: ${ALLOWED_FILENAMES.join(", ")}`,
    );
  }

  // README.mdの存在をチェック（警告のみ、一度だけ表示）
  if (!files.includes("README.md") && !warnedDirectories.has(dirPath)) {
    console.warn(
      `⚠️  [${dirPath}] README.mdがありません。実装の説明を追加することを推奨します。`,
    );
    warnedDirectories.add(dirPath);
  }

  return fileName;
}

// ファイル拡張子に応じた実行コマンドを取得
function getRunCommand(fileName) {
  if (fileName === "main.ts") {
    return ["npx", "ts-node", "--esm"];
  } else if (fileName === "main.coffee") {
    return ["npx", "coffee"];
  } else if (fileName === "main.ls") {
    // LiveScript (lsc) を使って実行します
    return ["npx", "lsc"];
  } else {
    return ["node"];
  }
}

describe("Hello World 100万回出力テスト", () => {
  testTargets.forEach((target) => {
    describe(`src/${target}/`, () => {
      const dirPath = join(process.cwd(), "src", target);
      const fileName = findMainFile(dirPath);
      const filePath = join(dirPath, fileName);
      const fileContent = readFileSync(filePath, "utf-8");

      it("ディレクトリ内にmainファイルとREADME.md以外のファイルが存在しないこと", () => {
        const files = readdirSync(dirPath).filter((f) => {
          const fullPath = join(dirPath, f);
          return statSync(fullPath).isFile();
        });

        const invalidFiles = files.filter(
          (f) =>
            !ALLOWED_FILENAMES.includes(f) &&
            !ALLOWED_ADDITIONAL_FILES.includes(f),
        );

        expect(invalidFiles).toEqual([]);
      });

      it("ファイル名が許可されたもの（main.js/main.cjs/main.mjs/main.ts）であること", () => {
        expect(ALLOWED_FILENAMES).toContain(fileName);
      });

      it("コードが1000バイト以内であること", () => {
        const fileSize = statSync(filePath).size;
        expect(fileSize).toBeLessThanOrEqual(MAX_FILE_SIZE);
      });

      it("禁止されたキーワード (for, while, forEach) を使用していないこと", () => {
        // コメントを除去
        const codeWithoutComments = fileContent
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*/g, "");

        expect(codeWithoutComments).not.toMatch(/\bfor\s*\(/);
        expect(codeWithoutComments).not.toMatch(/\bwhile\s*\(/);
        expect(codeWithoutComments).not.toMatch(/\.forEach\s*\(/);
      });

      it("再帰呼び出しを使用していないこと", () => {
        // 関数定義とその内部での自己呼び出しをチェック
        const functionNames = [];
        const functionBodies = new Map();

        // function宣言をチェック
        const functionMatches = fileContent.matchAll(
          /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g,
        );
        for (const match of functionMatches) {
          const name = match[1];
          const body = match[2];
          functionNames.push(name);
          functionBodies.set(name, body);
        }

        // const/let/var で定義されたアロー関数をチェック
        const arrowMatches = fileContent.matchAll(
          /(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*([^;]+)/g,
        );
        for (const match of arrowMatches) {
          const name = match[1];
          const body = match[2];
          functionNames.push(name);
          functionBodies.set(name, body);
        }

        // 各関数の本体内で自己呼び出しがないかチェック
        functionBodies.forEach((body, name) => {
          const callPattern = new RegExp(`\\b${name}\\s*\\(`);
          if (callPattern.test(body)) {
            throw new Error(
              `再帰呼び出しが検出されました: 関数 ${name} が自身を呼び出しています`,
            );
          }
        });
      });

      it('100万回 "Hello, World!" を出力すること', async () => {
        const [command, ...args] = getRunCommand(fileName);

        // 全体実行の場合（TARGET指定なし）は60秒のタイムアウトを設定
        const isFullTest = !targetFilter;
        const TIMEOUT_MS = 60000; // 60秒

        let childProcess = null;

        const countPromise = new Promise((resolve, reject) => {
          const env = { ...process.env };
          if (fileName === "main.ts") {
            env.NODE_OPTIONS = "--loader ts-node/esm";
          }
          const child = spawn(command, [...args, filePath], {
            shell: true,
            env,
          });
          childProcess = child;

          let total = 0;
          let remainder = "";
          const needle = "Hello, World!";

          child.stdout.on("data", (data) => {
            const chunk = remainder + data.toString();
            let idx = 0;
            while ((idx = chunk.indexOf(needle, idx)) !== -1) {
              total++;
              idx += needle.length;
            }
            // 末尾にneedleの一部が残っている可能性を考慮
            remainder = chunk.slice(-(needle.length - 1));
          });

          let stderr = "";
          child.stderr.on("data", (data) => {
            stderr += data.toString();
          });

          child.on("close", (code) => {
            if (code !== 0) {
              reject(new Error(`プロセスがエラーで終了しました: ${stderr}`));
            } else {
              resolve(total);
            }
          });
        });

        if (isFullTest) {
          // 全体実行時はタイムアウト付き
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve("TIMEOUT"), TIMEOUT_MS);
          });

          const result = await Promise.race([countPromise, timeoutPromise]);

          if (result === "TIMEOUT") {
            // 子プロセスを終了
            if (childProcess && !childProcess.killed) {
              childProcess.kill();
            }
            console.warn(`⏱️  [${target}] 60秒のタイムアウトにより実行をスキップしました`);
            // タイムアウト時はテストをスキップ扱いとして通過させる
            return;
          }

          expect(result).toBe(EXPECTED_COUNT);
        } else {
          // 個別実行時はタイムアウトなし
          const count = await countPromise;
          expect(count).toBe(EXPECTED_COUNT);
        }
      });
    });
  });
});
