import React, { ReactNode } from 'react';

interface GolfDraftPanelProps {
  heading?: JSX.Element | string;
  height?: string;
  children?: ReactNode;
}

export function GolfDraftPanel({ heading, height, children }: GolfDraftPanelProps) {
  return (
    <div className="panel panel-default golfdraft-panel" style={{ height: height }}>
      {!heading ? null : (
        <div className="panel-heading">
          <h3 className="panel-title">{heading}</h3>
        </div>
      )}
      <div className="panel-body">{children}</div>
    </div>
  );
}
