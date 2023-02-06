import { useEffect, useState } from "react";

export const isValidUrl = (url: string) => {
  try {
    return isURL(url);
  } catch (e) {
    console.error(e);
    return false;
  }
};

function isURL(str: string) {
  var urlRegex =
    "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";
  var url = new RegExp(urlRegex, "i");
  return str.length < 2083 && url.test(str);
}

export const Toast = ({
  message,
  severity,
}: {
  message: JSX.Element;
  severity: string;
}) => {
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
      {severity == "war"}
      <div
        className={
          "alert " + (severity === "error" ? "alert-error" : "alert-success")
        }
      >
        <div>
          <span className="text-[#FFFFFF]">{message}</span>
        </div>
      </div>
    </div>
  );
};
