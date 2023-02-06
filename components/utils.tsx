import { useEffect, useState } from "react";

export const isValidUrl = (url: string) => {
  try {
    let u = url.replace("www.", "");
    u = u.replace(/^(https?:\/\/)?/, "https://");
    // if it isn't, throws an error
    new URL(u);

    // then we regexp
    var urlPattern = new RegExp(
      "^(https?://)?(([da-z.-]+).)?([da-z.-]+).([a-z.]{2,6})([/w .-]*)*/?$"
    );
    return urlPattern.test(u);
  } catch (e) {
    console.error(e);
    return false;
  }
};

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
