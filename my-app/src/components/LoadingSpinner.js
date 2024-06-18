/**
 * LoadingSpinner.js
 * 
 * This file exports a LoadingSpinner component that renders a spinner.
 */

import React from "react";
import { Spinner } from "react-bootstrap";

/**
 * LoadingSpinner component for the application.
 * 
 * @returns {React.JSX.Element} The LoadingSpinner component.
 */
function LoadingSpinner({show, alt=false, opaque=false}) {
  return (
    show &&
    <div className={`loading-spinner ${alt ? 'alt-color' : ''} ${opaque ? 'opaque' : ''}`}>
      <Spinner animation="border" role="status" variant="light" />
    </div>
  );
}

export default LoadingSpinner;