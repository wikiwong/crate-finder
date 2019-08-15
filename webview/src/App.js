import React from 'react';
import './App.css';

const vscode = acquireVsCodeApi();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <input
          onChange={(event) => {
            vscode.postMessage({
              command: 'search',
              query: event.target.value
            });
        }}/>
      </header>
    </div>
  );
}

export default App;
