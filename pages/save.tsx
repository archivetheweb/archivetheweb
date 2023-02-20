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
  let [terms, setTerms] = useState(Terms.None);
  let [steps, setSteps] = useState(Steps.WebsiteInput);
  let [canMoveToPayment, setCanMoveToPayment] = useState(false);
  let [toastMessage, setToastMessage] = useState(<></>);
  const { contract, getLocalAddress } = useContext(ConnectorContext);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      setURL({ url: url, valid: true });
    }
  }, [router, router.query.url]);

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
      toRender = (
        <WebsiteInput
          urlInfo={urlInfo}
          handleURL={handleURL}
          handleNext={handleNext}
        />
      );
      break;
    case Steps.ArchivingOptions:
      toRender = (
        <ArchivingOptions
          urlInfo={urlInfo}
          terms={terms}
          handleNext={handleNext}
          canMoveToPayment={canMoveToPayment}
          setTerms={setTerms}
        />
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

function WebsiteInput(props: any) {
  let [hasBeenArchived, setHasBeenArchived] = useState(true);
  const { contract } = useContext(ConnectorContext);

  useEffect(() => {
    if (props.urlInfo.valid) {
      (async () => {
        try {
          let res = await contract.archivesByURL({
            url: getDomain(props.urlInfo.url),
            count: 1,
          });
          setHasBeenArchived(res.archives.archivedInfo.length > 0);
        } catch (e) {
          console.error(e);
          setHasBeenArchived(false);
        }
      })();
    }
  }, [props.urlInfo]);

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
            value={props.urlInfo.url}
            onChange={props.handleURL}
            placeholder="Enter a website to save (ex. www.bbc.com)"
            className="input input-bordered w-full h-16"
          />
        </div>

        {props.urlInfo.valid && !hasBeenArchived ? (
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

        {props.urlInfo.valid ? (
          <div className="flex flex-col items-center  aspect-video  w-full">
            <CustomIframe
              className="h-5/6 shadow-2xl w-full "
              src={props.urlInfo.url}
            >
              <></>
            </CustomIframe>
            <div className="flex justify-end w-full pt-2">
              <Link
                className="link link-primary link-hover"
                href={props.urlInfo.url}
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
          disabled={!props.urlInfo.valid}
          onClick={props.handleNext}
        >
          Next
        </button>
        {payWith()}
      </div>
    </div>
  );
}

function ArchivingOptions(props: any) {
  let [frequency, setFrequency] = useState(0);
  let [numberOfSnapshots, setNumberOfSnapshots] = useState(0);
  let [duration, setDuration] = useState("");
  let [timeIncrement, setTimeIncrement] = useState(Duration.Hours);

  useEffect(() => {
    let timeMultiplier = 24;
    switch (+timeIncrement) {
      case Duration.Hours:
        timeMultiplier = 1;
        break;
      case Duration.Days:
        timeMultiplier = 24;
        break;
    }

    let duration = Math.floor(
      ((frequency * timeMultiplier) / 24) * numberOfSnapshots
    );
    if (duration === 0) {
      setDuration(
        `~ ${Math.floor(frequency * timeMultiplier * numberOfSnapshots)} hours`
      );
    } else {
      setDuration(`~ ${duration} days`);
    }
  }, [numberOfSnapshots, frequency, timeIncrement]);

  return (
    <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-8 md:mx-16 lg:mx-32 mt-16 pt-16 px-16 shadow-xl gap-3 ">
      <div className="text-3xl">Set up Archiving</div>
      <div className="flex w-full p-4 items-center gap-1 bg-extralightgrey rounded-lg">
        <Image
          src={monitor}
          alt="monitor"
          style={{ width: "24px", height: "24px" }}
        />
        {props.urlInfo.url}
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
            onClick={() => props.setTerms(Terms.Once)}
            className={
              props.terms === Terms.Once
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>One Time</b>
          </button>
          <button
            onClick={() => props.setTerms(Terms.Multiple)}
            className={
              props.terms === Terms.Multiple
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>Long Term</b>
          </button>
        </div>

        {props.terms === Terms.Multiple && (
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
                  value={frequency}
                  onChange={(e: any) => setFrequency(e.target.value)}
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
                <select
                  className="select select-bordered w-full h-16"
                  value={timeIncrement}
                  onChange={(e: any) => {
                    setTimeIncrement(e.target.value);
                  }}
                >
                  <option key={Duration.Hours} value={Duration.Hours} selected>
                    Hours
                  </option>
                  <option key={Duration.Days} value={Duration.Days}>
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
                  value={numberOfSnapshots}
                  onChange={(e: any) => setNumberOfSnapshots(e.target.value)}
                  placeholder="Enter a number"
                  className="input input-bordered h-16 w-full"
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Duration:</span>
                </label>
                <input
                  disabled={true}
                  value={duration}
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
              {props.canMoveToPayment ? (
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
          onClick={props.handleNext}
          disabled={!props.canMoveToPayment}
        >
          Next
        </button>
        {payWith()}
      </div>
    </div>
  );
}

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
