import * as vscode from 'vscode';
import * as path from 'path';
import * as Crates from './crates-api';

export function activate(context: vscode.ExtensionContext) {
  let panel = vscode.window.createWebviewPanel(
    'crateFinder',
    'Crate Finder',
    vscode.ViewColumn.One,
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
          Crates.search(message.query).then(({ data }) => {
            vscode.window.showInformationMessage(data.crates[0].name);
          })
          return;
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
  </html>`
}

// this method is called when your extension is deactivated
export function deactivate() {}
