import React from 'react';
import './App.css';
import axios from 'axios';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={(e) => {
          const vscode = acquireVsCodeApi();
          vscode.postMessage({
            command: 'search',
            query: 'hyper'
          });
        }}>
          Click here to have some fun.
        </p>
      </header>
    </div>
  );
}

export default App;
