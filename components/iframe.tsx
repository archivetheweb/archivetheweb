import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

// @ts-ignore
const CustomIframe = ({ children, ...props }) => {
  const [loading, setIsLoading] = useState(true);
  const gridIframe = useRef(null as any);

  function handleIframe() {
    setIsLoading(false);
    // const iframeItem = gridIframe.current as HTMLIFrameElement;
  }

  return (
    <iframe {...props} ref={gridIframe} onLoad={handleIframe} sandbox="">
      {/* {mountNode && createPortal(children, mountNode)} */}
    </iframe>
  );
};

export default CustomIframe;
