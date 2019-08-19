import React from 'react';
import { Input, List, Icon, Tree } from 'antd';
import './CrateSearch.css';

// import { debounce } from 'lodash';

const vscode = acquireVsCodeApi();

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

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
      <div className="crate-input">
        <Search
          placeholder="search for a crate & hit enter"
          size="large"
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.state.results}
          className="crate-list"
          // pagination={{
          //   onChange: page => {
          //     console.log(page);
          //   },
          //   pageSize: 3,
          // }}
          renderItem={item => {
            const depString = `${item.name} = "${item.max_version}"`;
            const actions = [];
            actions.push(
              <a href={`https://crates.io/crates/${item.name}`}>
                <IconText
                  type="link"
                  text="Crates.io"
                  key="list-vertical-like-o" />
              </a>
            );
            const docIcon = <a href={item.documentation}><IconText type="info-circle" text="Docs.rs" key="list-vertical-message" /></a>;
            const repoIcon = <a href={item.repository}><IconText type="code" text="Source" key="list-vertical-message" /></a>;

            const keys = [["documentation", docIcon], ["repository", repoIcon]];
            keys.forEach((key) => {
              if (item[key[0]]) {
                actions.push(key[1]);
              }
            });

            return (
              <List.Item
                key={item.name}
                style={{ textAlign: 'left' }}
                className="list-item"
                actions={actions}
              >
                <List.Item.Meta
                  title={(
                    <a onClick={this.onTitleClick(depString)}>
                      {depString}<Icon type="copy" style={{ marginLeft: 8 }} />
                    </a>
                  )}
                  description={item.description}

                />
                <span class="download-count">All time downloads: {item.downloads.toLocaleString()}</span>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}

export default CrateSearch;