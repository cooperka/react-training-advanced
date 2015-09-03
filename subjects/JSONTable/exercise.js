////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// - fetch the src with `getJSON`
// - render the content of the th's from the field names (hint: use
//   the field names from the first record)
// - render each result as a row in tbody

import 'purecss/build/pure.css'
import React from 'react'
import { render } from 'react-dom'
import getJSON from './lib/getJSON'

class JSONTableCell extends React.Component {
  static propTypes = {
    data: React.PropTypes.string.isRequired
  }

  render() {
    let { data } = this.props;

    if (isImage(data))
      return <img src={data} width={64} />;

    if (isURL(data))
      return <a href={data}>{data}</a>;

    return <span>{data}</span>;
  }
}

class JSONTable extends React.Component {
  static propTypes: {
    src: React.PropTypes.string.isRequired,
    parse: React.PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      data: null
    }
  }

  componentDidMount() {
    getJSON(this.props.src, (error, data) => {
      this.setState({ data: this.props.parse(data) });
    });
  }

  render() {
    let { data } = this.state;

    if (data == null) return null;

    // return <pre>{JSON.stringify(this.state, null, 2)}</pre>

    // Lecture was way too fast to actually modify this to use JSONTableCell
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>id</th>
            <th>first name</th>
            <th>last name</th>
            <th>pic</th>
          </tr>
        </thead>
        <tbody>
        {data.map(contact =>
          <tr key={contact.id}>
            <td>{contact.id}</td>
            <td>{contact.first}</td>
            <td>{contact.last}</td>
            <td><img height="64" src={contact.avatar} /></td>
          </tr>
        )}
        </tbody>
      </table>
    );
  }
}

class App extends React.Component {
  render () {
    return (
      <div>
        <h1>JSONTable</h1>
        <JSONTable
          src="https://addressbook-api.herokuapp.com/contacts"
          parse={(res) => res.contacts}
        />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
