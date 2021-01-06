import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {
    error: null
  }
  static getDerivedStateFromError(error) {
    console.error(error)
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-page">
          <h1>Sorry, an error was encountered.</h1>
          <h4>Try again later or try refreshing the page.</h4>
        </main>
      )
    }
    return this.props.children;
  }
}