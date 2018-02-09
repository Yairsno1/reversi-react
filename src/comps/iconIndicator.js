import React, { Component } from 'react';

class IconIndicator extends Component {
  render () {
    const text = this.props.text;
    let attrs = {};
    let style = {}

    if (this.props.elementId) {
      attrs.id = this.props.elementId;
    }
    if (this.props.elementClass) {
      attrs.className = this.props.elementClass;
    }
    if (this.props.onClick) {
      attrs.onClick = this.props.onClick;
    }

    if (this.props.color) {
      style.color = this.props.color;
    }
    if (this.props.border) {
      style.border = this.props.border;
    }
    style.cursor = this.props.enabled ? 'pointer' : 'auto';

    attrs.style = style;

    return (
      //<span id={elemId} className={elemClass} style={style}>{text}</span>
      <span {...attrs} >{text}</span>
    );
  }
}

export default IconIndicator;
