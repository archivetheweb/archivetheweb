import { useEffect, useState } from "react";
import { Depth, Duration, TimeUnit } from "./types";

// An educated guess at first
export const AVERAGE_WEBSITE_DEPTH_1_IN_MB = 50;
export const AVERAGE_WEBSITE_DEPTH_0_IN_MB = 5;
export const MB = 1048576;
export const BUNDLR_URL = "https://node1.bundlr.network";

export const UPLOADER =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? "a_SDCVQa0B5QTobh5LWBzySpCdIm-3X9APrkmHZ-yV4"
    : "2NbYHgsuI8uQcuErDsgoRUCyj9X2wZ6PBN6WTz9xyu0";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? "dD1DuvgM_Vigtnv4vl2H1IYn9CgLvYuhbEWPOL-_4Mw"
    : "-27RfG2DJAI3ddQlrXkN1rmS5fBSC4eG8Zfhz8skYTU";

export const isValidUrl = (url: string) => {
  try {
    let u = url.replace("www.", "");
    u = u.replace(/^(https?:\/\/)?/, "https://");
    // if it isn't, throws an error
    new URL(u);

    // then we regexp
    var urlPattern = new RegExp(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    );

    return urlPattern.test(u);
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const isValidUrlStrict = (url: string) => {
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

export const pluralize = (word: string, amount: number): string => {
  return `${word}${amount > 1 ? "s" : ""}`;
};

export const getDomain = (url: string): string => {
  let a = document.createElement("a");
  a.setAttribute("href", url);
  return a.hostname.replace("www.", "");
};

export const calculateUploadPrice = (
  arweaveFeeForMB: number,
  depth: Depth,
  price: number
) => {
  let priceInAr =
    arweaveFeeForMB *
    (depth === Depth.PageOnly
      ? AVERAGE_WEBSITE_DEPTH_0_IN_MB
      : AVERAGE_WEBSITE_DEPTH_1_IN_MB);
  let pricePerSnapshot =
    Math.round((+price * priceInAr * 1000) / 1000000000000) / 1000;

  return {
    usd: pricePerSnapshot.toString(),
    winston: priceInAr.toString(),
  };
};

/* 
sec  min   hour   day of month   month   day of week   year
 0   30   9,12,15     1,15       May-Aug  Mon,Wed,Fri  2018/2 
*/
export const translateToCronFrequency = (
  value: number,
  unit: TimeUnit
): string => {
  let mins = new Date().getMinutes();

  // this amounts to once a day at 0 sec ${mins} mins past the hour
  let cronFrequency = `0 ${mins} */24 * * * *`;
  if (value === 0) {
    return cronFrequency;
  }
  switch (unit) {
    case TimeUnit.Days:
      // per day
      cronFrequency = `0 ${mins} 0 */${value} * * *`;

      break;
    case TimeUnit.Hours:
      // At ${mins} minutes past the hour, every ${value} hours
      cronFrequency = `0 ${mins} */${value} * * * *`;
      break;
  }

  return cronFrequency;
};

export const durationToSeconds = (duration: Duration): number => {
  // if duration is small, we assume 1 hour
  if (duration.value === "" || duration.value === "0") {
    return 60 * 60;
  }
  switch (duration.unit) {
    case TimeUnit.Days:
      return +duration.value * 24 * 60 * 60;
    case TimeUnit.Hours:
      return +duration.value * 60 * 60;
  }
};

export const shortenAddress = (address: String) => {
  if (address.length < 12) {
    return address;
  }
  return (
    address.substring(0, 5) +
    "..." +
    address.substring(address.length - 6, address.length - 1)
  );
};

export const shortenTitle = (title: String) => {
  if (title.length < 20) {
    return title;
  }
  return title.substring(0, 19) + "...";
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
