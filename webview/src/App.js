import React from 'react';
import './App.css';
import axios from 'axios';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p onClick={(e) => {
          const vscode = acquireVsCodeApi();
          axios('https://crates.io/api/v1/crates?page=1&per_page=10&q=hyper')
            .then((resp) => {
              vscode.postMessage({
                command: 'sayHi',
                text: resp.data.crates[0].name
              });
            })
        }}>
          Click here to have some fun.
        </p>
      </header>
    </div>
  );
}

export default App;
