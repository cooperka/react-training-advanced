////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Write a <ListView/> that only shows the elements in the view.
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { render, findDOMNode } from 'react-dom'
import PlaceholderText from './lib/PlaceholderText'

const { array, func, string, number, object, oneOfType } = React.PropTypes

require('./styles')

class ListView extends React.Component {

  static propTypes = {
    items: array.isRequired,
    itemHeight: number.isRequired,
    children: func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.state = {
      availableHeight: 0, // Initially doesn't render any items.
      scrollTop: 0
    };
  }

  handleScroll(event) {
    this.setState({
      scrollTop: event.target.scrollTop
    });
  }

  handleWindowResize() {
    // Re-render with exactly as many items as will fit.
    this.setState({
      availableHeight: findDOMNode(this).clientHeight
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    let { children, items, itemHeight, style } = this.props;
    let { availableHeight, scrollTop } = this.state;

    let scrollBottom = scrollTop + availableHeight;

    let startIndex = Math.floor(scrollTop / itemHeight);
    let endIndex = Math.ceil(scrollBottom / itemHeight);

    return (
      <div style={{ ...style, height: '100%', overflowY: 'scroll' }} onScroll={this.handleScroll}>
        {children(items.slice(startIndex, endIndex))}
      </div>
    );
  }

}

import convertNumberToEnglish from './lib/convertNumberToEnglish'

function computeHSLRainbowColor(n, total) {
  return [ Math.round((n / total) * 360) , 1, 0.5 ]
}

class RainbowList extends React.Component {

  static propTypes = {
    length: number.isRequired
  }

  static defaultProps = {
    length: 500000
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      items: []
    }
  }

  computeItems(length) {
    let items = []

    for (let i = 0; i < length; ++i) {
      items.push({
        index: i,
        text: convertNumberToEnglish(i),
        backgroundColor: computeHSLRainbowColor(i, length)
      })
    }

    this.setState({
      items
    })
  }

  componentWillMount() {
    this.computeItems(this.props.length)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.length !== nextProps.length)
      this.computeItems(nextProps.length)
  }

  render() {
    let { items } = this.state

    let itemHeight = 30
    let totalHeight = items.length * itemHeight

    return (
      <ListView items={items} itemHeight={itemHeight}>
      {(visibleItems) =>
        <ol style={{ position: 'relative', height: totalHeight }}>
        {visibleItems.map(item =>
          <li
            key={item.text}
            style={{ position: 'absolute', width: '100%', top: item.index * itemHeight, pointerEvents: 'none' }}
          >
            <PlaceholderText {...item} height={itemHeight} />
          </li>
        )}
        </ol>
      }
      </ListView>
    )
  }

}

render(<RainbowList />, document.getElementById('app'))
