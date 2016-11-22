import React, {Component} from 'react';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import './App.css';
import '../node_modules/graphiql/graphiql.css';

// Parse the search string to get url parameters.
var search = window.location.search;
var parameters = {};
search.substr(1).split('&').forEach(function (entry) {
  var eq = entry.indexOf('=');
  if (eq >= 0) {
    parameters[decodeURIComponent(entry.slice(0, eq))] =
      decodeURIComponent(entry.slice(eq + 1));
  }
});

// if variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables =
      JSON.stringify(JSON.parse(parameters.variables), null, 2);
  } catch (e) {
    // Do nothing, display the invalid JSON as a string, rather than present an error.
  }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'http://localhost:8083/v1',
      token: ''
    };
  }

  onEditQuery(newQuery) {
    parameters.query = newQuery;
    this.updateURL();
  }

  onEditVariables(newVariables) {
    parameters.variables = newVariables;
    this.updateURL();
  }

  updateURL() {
    var newSearch = '?' + Object.keys(parameters).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(parameters[key]);
      }).join('&');
    history.replaceState(null, null, newSearch);
  }

  fetcherFactory(url, token) {
    return function graphQLFetcher(graphQLParams) {
      return fetch(url + '/graphql', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify(graphQLParams),
      }).then(response => response.json());
    }
  }

  onUrlChange(e) {
    this.setState({url: e.target.value});
  }

  onTokenChange(e) {
    this.setState({token: e.target.value});
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <label>url
            <input type="text" id="url-input" onChange={this.onUrlChange.bind(this)}/>
          </label>
          <label>token
            <input type="text" id="token-input" onChange={this.onTokenChange.bind(this)}/>
          </label>
        </div>
        <GraphiQL fetcher={this.fetcherFactory(this.state.url, this.state.token)}
                  query={parameters.query}
                  variables={parameters.variables}
                  onEditQuery={this.onEditQuery.bind(this)}
                  onEditVariables={this.onEditVariables.bind(this)}/>
      </div>
    );
  }
}

export default App;

