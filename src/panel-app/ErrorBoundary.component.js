import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { caughtError: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { caughtError: error };
  }

  render() {
    if (this.state.caughtError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            padding: "16px",
          }}
        >
          <h1>single-spa Inspector broke!</h1>
          <p>
            Please close and repopen the devtools to get this working again.
          </p>
          <p>
            Also, report this error{" "}
            <a
              href={`https://github.com/single-spa/single-spa-inspector/issues/new?title=Inspector%20bug%20report&body=${encodeURIComponent(
                this.state.caughtError.message
              )}%0A%0A%60%60%60%0A${encodeURIComponent(
                this.state.caughtError.stack
              )}%60%60%60`}
            >
              here
            </a>{" "}
            if you don't mind, and copy the information below into that report:
          </p>
          <p>
            Error message: <em>{this.state.caughtError.message}</em>
            <br />
            <pre>{this.state.caughtError.stack}</pre>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
