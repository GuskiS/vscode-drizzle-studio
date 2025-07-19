import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec, type ChildProcess } from "node:child_process";

const storage = {
  process: null as ChildProcess | null,
  panel: null as vscode.WebviewPanel | null,
};

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    const cwd = workspaceFolders[0].uri.fsPath;

    const drizzleConfig = path.join(cwd, "drizzle.config.ts");
    if (fs.existsSync(drizzleConfig)) {
      storage.process = exec(`npm exec drizzle-kit studio --config=${drizzleConfig}`, { cwd });
      vscode.commands.executeCommand("setContext", "vscode-drizzle-studio.loaded", true);
    }
  }

  const command = vscode.commands.registerCommand("vscode-drizzle-studio.open", () => {
    if (storage.panel) {
      storage.panel.reveal(vscode.ViewColumn.One);
    } else {
      storage.panel = vscode.window.createWebviewPanel(
        "vscode-drizzle-studio",
        "Drizzle Studio",
        vscode.ViewColumn.One,
        { enableScripts: true, retainContextWhenHidden: true },
      );

      storage.panel.webview.html = getWebviewContent("https://local.drizzle.studio");
      storage.panel.onDidDispose(() => (storage.panel = null), null, context.subscriptions);
    }
  });

  if (storage.process) {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -9999);
    button.text = "$(table) Drizzle Studio";
    button.tooltip = "Open Drizzle Studio";
    button.command = "vscode-drizzle-studio.open";
    button.show();

    context.subscriptions.push(button);
  }

  context.subscriptions.push(command);
}

export function deactivate() {
  if (storage.panel || storage.process) {
    vscode.commands.executeCommand("setContext", "vscode-drizzle-studio.loaded", false);
  }

  storage.panel?.dispose();
  storage.process?.kill();

  storage.panel = null;
  storage.process = null;
}

function getWebviewContent(url: string) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, iframe { height: 100%; width: 100%; margin: 0; padding: 0; border: none; diplay: block; }
        </style>
      </head>

      <body>
        <iframe src="${url}" frameborder="0"></iframe>
      </body>
    </html>
  `;
}
