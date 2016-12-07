import React, {Component} from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";
import "./App.css";
import "../node_modules/graphiql/graphiql.css";

class App extends Component {

  constructor(props) {
    super(props);

    var search = window.location.search;
    var parameters = {};
    search.substr(1).split('&').forEach(function (entry) {
      var eq = entry.indexOf('=');
      if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(entry.slice(eq + 1));
      }
    });

    if (parameters.variables) {
      try {
        parameters.variables = JSON.stringify(JSON.parse(parameters.variables), null, 2);
      } catch (e) {}
    }

    this.state = {
      url: parameters.url,
      token: parameters.token,
      query: parameters.query,
      variables: parameters.variables
    };
  }

  onEditQuery(newQuery) {
    this.setState({query: newQuery});
    this.updateURL();
  }

  onEditVariables(newVariables) {
    this.setState({variables: newVariables});
    this.updateURL();
  }

  onUrlChange(e) {
    this.setState({url: e.target.value});
    this.updateURL();
  }

  onTokenChange(e) {
    this.setState({token: e.target.value});
    this.updateURL();
  }

  updateURL() {
    var newSearch = '?' + Object.keys(this.state)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(this.state[key]))
        .join('&');
    history.replaceState(null, null, newSearch);
  }

  fetcherFactory(url, token) {
    return function graphQLFetcher(graphQLParams) {
      return fetch(url + '/graphql', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(graphQLParams),
      }).then(response => response.json());
    }
  }

  render() {
    return (
      <div className="app">
        <div className="header">
          <label>url
            <input type="text" id="url-input" onChange={this.onUrlChange.bind(this)} value={this.state.url}/>
          </label>
          <label>token
            <input type="text" id="token-input" onChange={this.onTokenChange.bind(this)} value={this.state.token}/>
          </label>
        </div>
        <div className="body" key={this.state.url}>
          <GraphiQL fetcher={this.fetcherFactory(this.state.url, this.state.token)}
                    query={this.state.query}
                    variables={this.state.variables}
                    onEditQuery={this.onEditQuery.bind(this)}
                    onEditVariables={this.onEditVariables.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default App;

