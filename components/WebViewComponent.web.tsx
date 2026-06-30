import React from 'react';

export const WebViewComponent = React.forwardRef<HTMLIFrameElement, {
  html: string;
  style?: any;
  onMessage?: (event: any) => void;
}>((props, ref) => {
  return (
    <iframe
      ref={ref}
      srcDoc={props.html}
      style={{ width: '100%', height: '100%', borderWidth: 0, ...props.style }}
      title="Trabzon Ortahisar Canlı Harita"
    />
  );
});

export default WebViewComponent;
