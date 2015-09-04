import React, { PropTypes } from 'react';
import { render } from 'react-dom'
let { func, any } = PropTypes

let styles = {}

////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// Make this work like a normal <select><option/></select>

class Select extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultValue || null,
      showChildren: false
    };

    if (!this.isUncontrolled() && !this.props.onChange) {
      console.warn('This thing is gonna be read-only, etc. etc.');
    }
  }

  isUncontrolled() {
    return this.props.value == null;
  }

  toggle() {
    this.setState({
      showChildren: !this.state.showChildren
    });
  }

  handleSelect(value) {
    let nextState = {
      showChildren: false
    };

    if (this.isUncontrolled()) {
      nextState.value = value;
    }

    this.setState(nextState, () => {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    })
  }

  getLabel() {
    let label = null;
    React.Children.forEach(this.props.children, (child) => {
      let childValue = child.props.value;
      if (
        (this.isUncontrolled() && childValue === this.state.value) ||
        (child.props.value === this.props.value)
      ) {
        label = child.props.children;
      }
    });
    return label;
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        onSelect: (value) => this.handleSelect(value)
      });
    });
  }

  render() {
    return (
      <div style={styles.select} onClick={() => this.toggle()}>
        <div style={styles.label}>{this.getLabel()} <span style={styles.arrow}>▾</span></div>
        {this.state.showChildren && (
          <div style={styles.options}>
            {this.renderChildren()}
          </div>
        )}
      </div>
    )
  }
}

Select.propTypes = {
  onChange: func,
  value: any,
  defaultValue: any
};

class Option extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      hovering: false
    };
  }

  handleClick() {
    this.props.onSelect(this.props.value);
  }

  render() {
    return (
      <div
        style={this.state.hovering ? styles.optionHover : styles.option}
        onClick={() => this.handleClick()}
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
      >
        {this.props.children}
      </div>
    )
  }
}

Option.propTypes = {
  onSelect: func,
  value: any
};

// You can use these styles to not mess around w/ css if you'd like

styles.select = {
  border: '1px solid #ccc',
  display: 'inline-block',
  margin: '4px',
  cursor: 'pointer',
}

styles.label = {
  padding: '4px'
}

styles.arrow = {
  float: 'right',
  paddingLeft: 4
}

styles.options = {
  position: 'absolute',
  background: '#fff',
  border: '1px solid #ccc'
}

styles.option = {
  padding: '4px'
}

styles.optionHover = {
  background: '#eee',
  ...styles.option
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectValue: 'dosa'
    };
  }

  render () {
    return (
      <div>
        <h1>Select/Option</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <Select
          value={this.state.selectValue}
          onChange={(selectValue) => this.setState({ selectValue })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
