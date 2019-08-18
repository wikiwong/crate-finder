import React from 'react';
import { Input, Tree } from 'antd';
import { debounce } from 'lodash';

const vscode = acquireVsCodeApi();

const { TreeNode } = Tree;
const { Search } = Input;

class CrateSearch extends React.Component {
  state = {
    value: '',
    results: []
  };

  componentDidMount() {
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'result':
          this.setState({ results: message.results });
      }
    });

    vscode.postMessage({
      command: 'search',
      query: this.state.value
    });
  }

  onSearch = (value) => {
    vscode.postMessage({
      command: 'search',
      query: value
    });
    this.setState({ value });
  };

  onSelect = (value) => {
    vscode.postMessage({
      command: 'select',
      selected: value[0]
    });
  };

  render() {
    return (
      <div>
        <Search
          placeholder="input search text"
          size="large"
          style={{ width: '500px'}}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <Tree onSelect={this.onSelect}>
          {this.state.results.map((result) => (
            <TreeNode
              selectable={false}
              title={result.name}
              key={result.name}
            >
              {result.versions.map(({ num }) => (
                <TreeNode
                  title={num}
                  key={`${result.name} = "${num}"`} />
              ))}
            </TreeNode>
          ))}
        </Tree>
      </div>
    )
  }
}

export default CrateSearch;