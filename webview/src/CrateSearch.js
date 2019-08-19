import React from 'react';
import { Input, List, Icon, Tree } from 'antd';
// import { debounce } from 'lodash';

const vscode = acquireVsCodeApi();

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

// const { TreeNode } = Tree;
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

  onTitleClick = (value) => (_) => {
    vscode.postMessage({
      command: 'select',
      selected: value
    });
    console.log(e);
    //href={item.repository}
  }

  render() {
    return (
      <>
        <Search
          placeholder="search for a crate"
          size="large"
          style={{ width: '500px'}}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.state.results}
          // pagination={{
          //   onChange: page => {
          //     console.log(page);
          //   },
          //   pageSize: 3,
          // }}
          renderItem={item => {
            const depString = `${item.name} = "${item.max_version}"`;
            return (
              <List.Item
                key={item.name}
                style={{ textAlign: 'left' }}
              >
                <List.Item.Meta
                  title={(
                    <a onClick={this.onTitleClick(depString)}>
                      {depString}<Icon type="copy" style={{ marginLeft: 8 }} />
                    </a>
                  )}
                  description={item.description}
                />
                <span style={{ fontStyle: 'italic'}}>All time downloads: {item.downloads}</span>
              </List.Item>
            );
          }}
        />
      </>
    );
  }
}

export default CrateSearch;