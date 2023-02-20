import Image from "next/image";
import arweave from "../public/ar.png";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import {
  getDomain,
  isValidUrl,
  isValidUrlStrict,
  Toast,
} from "../components/utils";
import { useRouter } from "next/router";
import info from "../public/info.png";
import infinity from "../public/infinity.png";
import monitor from "../public/monitor.png";
import questionMark from "../public/question_mark.png";
import CustomIframe from "../components/iframe";
import ConnectorContext from "../context/connector";

enum Steps {
  WebsiteInput,
  ArchivingOptions,
  Payment,
}

enum Terms {
  None,
  Once,
  Multiple,
}

enum Duration {
  Hours,
  Days,
}

export default function Save() {
  const router = useRouter();

  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [frequency, setFrequency] = useState("");
  let [duration, setDuration] = useState(Duration.Hours);
  let [terms, setTerms] = useState(Terms.None);
  let [steps, setSteps] = useState(Steps.WebsiteInput);
  let [hasBeenArchived, setHasBeenArchived] = useState(true);
  let [canMoveToPayment, setCanMoveToPayment] = useState(false);
  const { contract, warp, getLocalAddress } = useContext(ConnectorContext);
  let [toastMessage, setToastMessage] = useState(<></>);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      setURL({ url: url, valid: true });
    }
  }, [router, router.query.url]);

  useEffect(() => {
    if (urlInfo.valid) {
      (async () => {
        try {
          console.log(getDomain(urlInfo.url));
          console.log(await contract.currentState());
          let res = await contract.archivesByURL({
            url: getDomain(urlInfo.url),
            count: 1,
          });
          setHasBeenArchived(res.archives.archivedInfo.length > 0);
        } catch (e) {
          console.error(e);
          setHasBeenArchived(false);
        }
      })();
    }
  }, [urlInfo]);

  useEffect(() => {
    if (
      urlInfo.valid &&
      steps == Steps.ArchivingOptions &&
      terms === Terms.Once
    ) {
      setCanMoveToPayment(true);
    } else {
      setCanMoveToPayment(false);
    }
  }, [terms]);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    let valid = isValidUrlStrict(e.currentTarget.value);

    setURL({
      url: e.currentTarget.value,
      valid,
    });
  };

  const handleNext = async () => {
    switch (steps) {
      case Steps.WebsiteInput:
        setSteps(Steps.ArchivingOptions);
        break;
      case Steps.ArchivingOptions:
        setSteps(Steps.Payment);
        break;
    }
  };

  const handleSetDuration = (duration: number) => {
    setDuration(duration);
    // check if hours or days
    // min 1 per day for now
  };

  const handleContinueToPayment = async () => {
    // open the modal for the payment
    // for now just submit an archive request
    if (!urlInfo.valid) {
      // todo throw error
      setToastMessage(
        <span>
          <b>URL</b> is not valid
        </span>
      );
      return;
    }

    let { jwk: wallet, address: walletAddress } = await getLocalAddress();

    let c = await contract.connect(JSON.parse(wallet));
    // this allows us to do a "once" only archive
    let res = await c.requestArchiving({
      startTimestamp: Math.floor(Date.now() / 1000),
      // give an hour
      endTimestamp: Math.floor(Date.now() / 1000) + 3600,
      // freq is everyday, will never reach
      frequency: "0 0 */24 * * *",
      options: {
        depth: 0,
        domainOnly: false,
        urls: [urlInfo.url],
      },
      uploaderAddress: "2NbYHgsuI8uQcuErDsgoRUCyj9X2wZ6PBN6WTz9xyu0",
    });
  };
  let toRender = <></>;
  switch (steps) {
    case Steps.WebsiteInput:
      toRender = websiteInput(urlInfo, handleURL, handleNext, hasBeenArchived);
      break;
    case Steps.ArchivingOptions:
      toRender = archivingOptions(
        urlInfo,
        terms,
        handleNext,
        canMoveToPayment,
        setTerms,
        handleSetDuration
      );
  }
  return (
    <Container>
      <Toast message={toastMessage} severity="error" />
      {toRender}
      {faq()}
    </Container>
  );
}

let websiteInput = (
  urlInfo: any,
  handleURL: any,
  handleNext: any,
  hasBeenArchived: boolean
) => {
  return (
    <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-8 md:mx-16 lg:mx-32 mt-16 pt-16 px-16 shadow-xl ">
      <div className="text-3xl">Archive a website</div>
      <div className="text-[#0000008A] pb-3">
        Help create an open and decentralized backup of the world wide web.
      </div>

      <div className="flex flex-col justify-center content-center items-center w-full gap-4">
        <div className="form-control w-full">
          <input
            type="text"
            value={urlInfo.url}
            onChange={handleURL}
            placeholder="Enter a website to save (ex. www.bbc.com)"
            className="input input-bordered w-full h-16"
          />
        </div>

        {urlInfo.valid && !hasBeenArchived ? (
          <div
            className="w-full flex items-center justify-center rounded-lg p-6 text-lg  text-[#FFFFFF]"
            style={{
              fontWeight: 700,
              background:
                "linear-gradient(89.94deg, #5EEAA7 -0.81%, #7CACF5 23.02%, #A186F8 43.06%, #FC79D5 59.85%, #F8A170 79.89%, #E3F95C 102.09%)",
            }}
          >
            You'll be the first person to archive this site 🎉
          </div>
        ) : (
          <></>
        )}

        {urlInfo.valid ? (
          <div className="flex flex-col items-center  aspect-video  w-full">
            <CustomIframe
              className="h-5/6 shadow-2xl w-full "
              src={urlInfo.url}
            >
              <></>
            </CustomIframe>
            <div className="flex justify-end w-full pt-2">
              <Link
                className="link link-primary link-hover"
                href={urlInfo.url}
                target="_blank"
              >
                Open website ↗{" "}
              </Link>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="overflow-x-auto w-full border border-[#00000033] rounded-lg">
          <table className="table w-full ">
            <thead></thead>
            <tbody className="">
              <tr className=" ">
                <td className=" rounded-tl-lg bg-extralightgrey ">
                  Average price per snapshot
                </td>
                <td className=" font-bold rounded-tr-lg bg-extralightgrey text-right m-4 ">
                  USD $0.007
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16"
          disabled={!urlInfo.valid}
          onClick={handleNext}
        >
          Next
        </button>
        {payWith()}
      </div>
    </div>
  );
};
let archivingOptions = (
  urlInfo: any,
  terms: Terms,
  handleNext: any,
  canMoveToPayment: boolean,
  setTerms: any,
  handleSetDuration: any
) => {
  return (
    <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-8 md:mx-16 lg:mx-32 mt-16 pt-16 px-16 shadow-xl gap-3 ">
      <div className="text-3xl">Set up Archiving</div>
      <div className="flex w-full p-4 items-center gap-1 bg-extralightgrey rounded-lg">
        <Image
          src={monitor}
          alt="monitor"
          style={{ width: "24px", height: "24px" }}
        />
        {urlInfo.url}
      </div>
      <div className="flex w-full p-4 items-center gap-1 bg-funlightpurple rounded-lg">
        <Image
          src={infinity}
          alt="infinity"
          style={{ width: "24px", height: "24px" }}
        />
        Snapshot are saved for <b>200+ years</b> on Arweave.
      </div>
      <div>Take a snapshot:</div>
      <div className="flex flex-col justify-center content-center items-center w-full gap-4">
        <div className="btn-group  grid grid-cols-2 w-full border rounded-lg  shadow-xl border-[#00000033]">
          <button
            onClick={() => setTerms(Terms.Once)}
            className={
              terms === Terms.Once
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>One Time</b>
          </button>
          <button
            onClick={() => setTerms(Terms.Multiple)}
            className={
              terms === Terms.Multiple
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>Long Term</b>
          </button>
        </div>

        {terms === Terms.Multiple && (
          <>
            <div className="flex form-control w-full flex-row gap-4   ">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">
                    Archive this website every:
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Enter a number"
                  className="input input-bordered w-full h-16 "
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">
                    {" "}
                    <br></br>
                  </span>
                </label>
                <select className="select select-bordered w-full  h-16">
                  <option
                    selected
                    onClick={() => handleSetDuration(Duration.Hours)}
                  >
                    Hours
                  </option>
                  <option onClick={() => handleSetDuration(Duration.Days)}>
                    Days
                  </option>
                </select>
              </div>
            </div>

            <div className="flex form-control w-full flex-row gap-4  ">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Total number of snapshots:</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter a number"
                  className="input input-bordered h-16 w-full  "
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Duration:</span>
                </label>
                <input
                  type="number"
                  disabled={true}
                  className="input input-bordered h-16 w-full "
                />
              </div>
            </div>
          </>
        )}

        <div className="overflow-x-auto w-full border border-[#00000033] rounded-lg">
          <table className="table w-full ">
            <thead></thead>
            <tbody className="">
              {canMoveToPayment ? (
                <tr className="">
                  <td className="bg-extralightgrey">Total Cost</td>
                  <td className="bg-extralightgrey">-</td>
                </tr>
              ) : (
                <tr className=" ">
                  <td className=" rounded-tl-lg bg-extralightgrey ">
                    Average price per snapshot
                  </td>
                  <td className=" font-bold rounded-tr-lg bg-extralightgrey text-right m-4 ">
                    USD $0.007
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16"
          onClick={handleNext}
          disabled={!canMoveToPayment}
        >
          Next
        </button>
        {payWith()}
      </div>
    </div>
  );
};

let payWith = () => (
  <div>
    <div className="flex gap-2 p-8 grayscale">
      Pay for archiving with
      <Image
        src={arweave}
        style={{ height: "25px", width: "25px" }}
        alt="arweave"
      />
      <Image
        src={mm}
        style={{ height: "25px", width: "25px" }}
        alt="metamask"
      />
      <Image
        src={wc}
        style={{ height: "23px", width: "41px" }}
        alt="walletconnect"
      />
    </div>
  </div>
);

const faq = () => (
  <div className="grid grid-cols-1 mx-8 md:mx-16 lg:mx-32 mt-4 py-8 gap-3 ">
    <div className="border border-[#00000033] rounded-lg">
      <div tabIndex={0} className="collapse">
        <input type="checkbox" />
        <div className="collapse-title flex items-center gap-2">
          <Image
            src={questionMark}
            alt="info 1"
            style={{ width: "18px", height: "18px" }}
          />
          <span className="text-funpurple font-bold ">
            Why do I need to pay to save a website?{" "}
          </span>{" "}
        </div>
        <div className="collapse-content">
          All website snapshots are saved on Arweave, a permanent data storage
          protocol. A small fee is sent to the network to pay data storers to
          add data to the network and keep it for 200+ years. Archive the Web
          does not take a fee. Learn more here.
        </div>
      </div>
    </div>
    <div className="border border-[#00000033] rounded-lg">
      <div tabIndex={1} className="collapse">
        <input type="checkbox" />
        <div className="collapse-title flex items-center gap-2">
          <Image
            src={questionMark}
            alt="info 2"
            style={{ width: "18px", height: "18px" }}
          />
          <span className="text-funpurple font-bold ">
            What payment methods are accepted?{" "}
          </span>{" "}
        </div>
        <div className="collapse-content">
          To archive on Arweave, the payment must be made in their native
          currency, a token called “AR.” You can think of this as a digital
          currency like Bitcoin and Ethereum. With Archive the Web, you can pay
          for archiving with AR, ETH and ERC-20 tokens on different blockchains
          (i.e. Polygon, Arbitrum, etc.).
        </div>
      </div>
    </div>
    <div className="flex gap-4">
      <div className="border border-[#00000033] rounded-lg">
        <div tabIndex={2} className="collapse">
          <input type="checkbox" />
          <div className="collapse-title flex items-center gap-2">
            <Image
              src={questionMark}
              alt="info 3"
              style={{ width: "18px", height: "18px" }}
            />
            <span className="text-funpurple font-bold ">
              Is it possible to pay with credit card?{" "}
            </span>{" "}
          </div>
          <div className="collapse-content">
            Yes, you can pay for archiving with credit card. To do so, you will
            need to use Metamask. You can buy ETH and ERC-20 tokens with credit
            card there. You then will use the currency you purchased as the
            final payment method.
          </div>
        </div>
      </div>
    </div>
  </div>
);
