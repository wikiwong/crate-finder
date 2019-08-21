import * as vscode from 'vscode';
import * as path from 'path';
import * as Crates from './crates-api';

const devJsUri = 'http://localhost:3000/static/js/bundle.js';
const devCssUri = 'http://localhost:3000/static/css/main.css';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('findCrate', () => {
    let panel = vscode.window.createWebviewPanel(
      'crateFinder',
      'Crate Finder',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );
  
    const { jsUri, cssUri } = getAssets(context, false);
    panel.webview.html = getWebviewHtml(
      jsUri,
      cssUri
    );
  
    panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'search':
            Crates.search(message.query).then((crates) => {
              panel.webview.postMessage({ command: 'result', results: crates });
            });
            return;
          case 'select':
            vscode.env.clipboard.writeText(message.selected)
              .then((_) => panel.webview.postMessage({
                command: 'copied',
                value: message.selected
              }));
        }
      },
      undefined,
      context.subscriptions
    );
  });
  context.subscriptions.push(disposable);
}

function getAssets(context: vscode.ExtensionContext, debug: boolean): { jsUri: string, cssUri: string } {
  if (debug) {
    return {
      jsUri: devJsUri,
      cssUri: devCssUri,
    };
  }
  const jsDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'webview', 'build', 'static', 'js', 'bundle.js')
  );
  const cssDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'webview', 'build', 'static', 'css', 'main.css')
  );
  return {
    jsUri: jsDiskPath.with({ scheme: 'vscode-resource' }).toString(),
    cssUri: cssDiskPath.with({ scheme: 'vscode-resource' }).toString()
  };
}

function getWebviewHtml(jsUri: string, cssUri: string): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link href="${cssUri}" rel="stylesheet">
    </head>
    <body>
      <div id="root"></div>
      <script src="${jsUri}"></script>
    </body>
  </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() { }
