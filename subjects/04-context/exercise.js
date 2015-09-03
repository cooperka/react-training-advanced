////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the Form, SubmitButton, and TextInput components
// such that:
//
// - clicking the SubmitButton submits the form
// - hitting "Enter" while in a TextInput submits the form
// - Don't use a <form/> element, we're intentionally recreating the
//   browser's built in behavior
//
// Got extra time?
//
// - send the values of all the TextInput's to the Form `onChange` handler
//   without using DOM traversal APIs to get the values.
// - Implement a ResetButton that resets the TextInputs in the Form
//
////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { render } from 'react-dom';

var Form = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    onFormSubmit: React.PropTypes.func,
    onFormReset: React.PropTypes.func
  },

  getChildContext () {
    return {
      onFormSubmit: this.props.onSubmit,
      onFormReset: this.onReset
    };
  },

  onReset () {
    // This seems like it would be a lot easier with flux...
    console.log('reset');
  },

  render () {
    return <div>{this.props.children}</div>
  }
});

var SubmitButton = React.createClass({
  contextTypes: {
    onFormSubmit: React.PropTypes.func
  },

  render () {
    return <button onClick={this.context.onFormSubmit}>{this.props.children}</button>
  }
});

var ResetButton = React.createClass({
  contextTypes: {
    onFormReset: React.PropTypes.func
  },

  render () {
    return <button onClick={this.context.onFormReset}>{this.props.children}</button>
  }
});

var TextInput = React.createClass({
  contextTypes: {
    onFormSubmit: React.PropTypes.func
  },

  handleKeyDown (event) {
    if (event.key === 'Enter' || event.key === 'Space') {
      this.context.onFormSubmit();
    }
  },

  render () {
    return <input
      type="text"
      name={this.props.name}
      placeholder={this.props.placeholder}
      onKeyDown={this.handleKeyDown} />;
  }
});

var App = React.createClass({

  handleSubmit () {
    alert('YOU WIN!')
  },

  render () {
    return (
      <div>
        <h1>This isn`t even my final <code>&lt;Form/&gt;</code>!</h1>

        <Form onSubmit={this.handleSubmit}>
          <p>
            <TextInput name="firstName" placeholder="First Name"/> {' '}
            <TextInput name="lastName" placeholder="Last Name"/>
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton>{' '}
            <ResetButton>Reset</ResetButton>
          </p>
        </Form>
      </div>
    );
  }
});

render(<App/>, document.getElementById('app'))
