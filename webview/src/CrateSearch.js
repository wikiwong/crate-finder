import React from 'react';
import { Input, List, Icon, Tree } from 'antd';
import './CrateSearch.css';

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
    results: [],
    copied: '',
    lastCopyTimeout: 0,
  };

  componentDidMount() {
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'result':
          this.setState({ results: message.results });
        case 'copied':
          this.setState({ copied: message.value });
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
  }

  onSelect = (value) => {
    vscode.postMessage({
      command: 'select',
      selected: value[0]
    });
  }

  onTitleClick = (value) => (_) => {
    vscode.postMessage({
      command: 'select',
      selected: value
    });
  }

  showCopied = (dep) => {
    let value = 0;
    if (this.state.copied === dep) {
      clearTimeout(this.state.lastCopyTimeout);
      let id = setTimeout(() => {
        this.setState({ copied: '' });
      }, 1500);

      // showCopied is called too frequently to use setState here,
      // but it's probably OK, since it's just book-keeping the timeouts
      // so there isn't awkward jumps when a user clicks copy on 2 crates
      // in quick succession.
      this.state.lastCopyTimeout = id;

      value = 1;
    }
    return (
      <span style={{ opacity: value }}>
        <span className="green"> &#10004;</span>
        <em className="copied">copied to clipboard</em>
      </span>
    )
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
                      {this.showCopied(depString)}
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