import { useEffect, useState } from "react";

export const isValidUrl = (url: string) => {
  try {
    // if it isn't, throws an error
    new URL(url);
    // then we check for HTTP/HTTPS
    var urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return !!urlPattern.test(url);
  } catch (e) {
    return false;
  }
};

export const Toast = ({ message }: { message: JSX.Element }) => {
  let [isDiplayed, setIsDisplayed] = useState(false);
  let [m, setM] = useState(<></>);

  useEffect(() => {
    let timer = setTimeout(() => {}, 0);

    if (m.type !== message.type) {
      setIsDisplayed(true);
      timer = setTimeout(() => {
        setIsDisplayed(false);
        setM(<></>);
      }, 3000);
    }
    return () => {
      setIsDisplayed(false);
      clearTimeout(timer);
    };
  }, [message.type, m.type]);

  return (
    <div className="toast" style={{ display: isDiplayed ? "" : "none" }}>
      <div className="alert alert-success">
        <div>
          <span className="text-[#FFFFFF]">{message}</span>
        </div>
      </div>
    </div>
  );
};
