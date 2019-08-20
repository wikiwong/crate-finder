import * as vscode from 'vscode';
import * as path from 'path';
import * as Crates from './crates-api';

export function activate(context: vscode.ExtensionContext) {
  let panel = vscode.window.createWebviewPanel(
    'crateFinder',
    'Crate Finder',
    vscode.ViewColumn.Two,
    { enableScripts: true }
  );

  const jsDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'webview', 'build', 'static', 'js', 'bundle.js')
  );
  const cssDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'webview', 'build', 'static', 'css', 'main.css')
  );

  panel.webview.html = getWebviewHtml(
    jsDiskPath.with({ scheme: 'vscode-resource' }),
    cssDiskPath.with({ scheme: 'vscode-resource' })
  );

  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'search':
          Crates.search(message.query).then((crates) => {
            // post result back to webview
            console.log('passing crates back to webview', crates);
            panel.webview.postMessage({ command: 'result', results: crates });
          });
          return;
        case 'select':
          vscode.env.clipboard.writeText(message.selected)
            .then((value) => panel.webview.postMessage({
              command: 'copied',
              value: message.selected
            }));
      }
    },
    undefined,
    context.subscriptions
  );

  let disposable = vscode.commands.registerCommand('findCrate', () => {
    console.log('executed find crate');
  });
  context.subscriptions.push(disposable);
}

function getWebviewHtml(jsUri: vscode.Uri, cssUri: vscode.Uri): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link href="${cssUri.toString()}" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
      <script src="${jsUri.toString()}"></script>
    </body>
  </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() { }
