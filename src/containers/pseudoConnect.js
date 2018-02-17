/**
 * Redundant temporary code.
 * I keep it just as yet another React's HOC example.
 */

import React, { Component } from 'react';

function withPresentation (PresentationComp) {
  return class extends Component {
    render() {
      return <PresentationComp {...this.props} />;
    }
  };
}

export default withPresentation;
