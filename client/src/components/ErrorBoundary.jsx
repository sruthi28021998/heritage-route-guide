import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error(err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ textAlign: 'center', margin: '2rem' }}>
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.assign('/')}>Reload app</button>
        </div>
      );
    }
    return this.props.children;
  }
}