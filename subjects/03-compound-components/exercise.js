////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Implement a radio group form control with the API found in App
//
// - Clicking a <RadioOption/> should update the value of <RadioGroup/>
// - The selected <RadioOption/> should pass the correct value to RadioIcon
// - the `defaultValue` should be set on first render
//
// Got extra time?
//
// Implement a `value` prop and allow this to work like a "controlled input"
// (https://facebook.github.io/react/docs/forms.html#controlled-components)
//
// - Add a button to App whose click handler sets the radioValue state to
//   some fixed value, like 'tape'
// - make the RadioGroup update accordingly
//
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { render } from 'react-dom'

var RadioIcon = React.createClass({
  render () {
    return <div style={{
      borderColor: '#ccc',
      borderSize: '3px',
      borderStyle: this.props.isSelected ? 'inset' : 'outset',
      height: 16,
      width: 16,
      display: 'inline-block',
      cursor: 'pointer',
      background: this.props.isSelected ? 'rgba(0, 0, 0, 0.05)' : ''
    }}/>
  }
});

var RadioGroup = React.createClass({
  getInitialState () {
    return {
      value: this.props.defaultValue
    };
  },

  select (value) {
    this.setState({ value }, () => {
      this.props.onChange(this.state.value)
    })
  },

  render () {
    var children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        isSelected: child.props.value === this.state.value,
        onClick: () => this.select(child.props.value)
      });
    });
    return <div>{children}</div>
  }
});

var RadioOption = React.createClass({
  render () {
    return (
      <div onClick={this.props.onClick}>
        <RadioIcon isSelected={this.props.isSelected}/> {this.props.children}
      </div>
    )
  }
});

var App = React.createClass({
  getInitialState () {
    return {
      radioValue: 'fm'
    };
  },

  render () {
    return (
      <div>
        <h1>♬ It`s about time that we all turned off the radio ♫</h1>

        <h2>Radio Value: {this.state.radioValue}</h2>

        <RadioGroup
          defaultValue={this.state.radioValue}
          onChange={(radioValue) => this.setState({ radioValue })}
        >
          <RadioOption value="am">AM</RadioOption>
          <RadioOption value="fm">FM</RadioOption>
          <RadioOption value="tape">Tape</RadioOption>
          <RadioOption value="aux">Aux</RadioOption>
        </RadioGroup>

      </div>
    );
  }
});

render(<App/>, document.getElementById('app'))

