import React, { Component } from 'react';

export function withColorIcon (SubjectIcon, color) {
  return class ColoredIcon extends Component {
    render() {
      return <SubjectIcon color={color} {...this.props} />;
    }
  };
}

export function withBorderIcon (SubjectIcon, border) {
  return class BorderAroundIcon extends Component {
    render() {
      return <SubjectIcon border={border} {...this.props} />;
    }
  };
}

export function withClickIcon (SubjectIcon, enabled, onClick) {
  return class ClickableIcon extends Component {
    render() {
      return <SubjectIcon enabled={enabled} onClick={onClick} {...this.props} />;
    }
  };
}

