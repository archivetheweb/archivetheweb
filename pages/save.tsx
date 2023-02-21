import Image from "next/image";
import arweave from "../public/ar.png";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import {
  AVERAGE_WEBSITE_DEPTH_0_IN_MB,
  AVERAGE_WEBSITE_DEPTH_1_IN_MB,
  getDomain,
  isValidUrl,
  isValidUrlStrict,
  MB,
  pluralize,
  Toast,
} from "../components/utils";
import { useRouter } from "next/router";
import infinity from "../public/infinity.png";
import monitor from "../public/monitor.png";
import CustomIframe from "../components/iframe";
import ConnectorContext from "../context/connector";
import { fetchPrice } from "../http/fetcher";
import { Faq } from "../components/FAQ";
import { Paywith } from "../components/PayWith";

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

enum Depth {
  PageOnly,
  PageAndLinks,
}

export default function Save() {
  const router = useRouter();

  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [terms, setTerms] = useState(Terms.None);
  let [depth, setDepth] = useState(Depth.PageOnly);
  let [steps, setSteps] = useState(Steps.WebsiteInput);
  let [toastMessage, setToastMessage] = useState(<></>);
  const { contract, getLocalAddress, warp } = useContext(ConnectorContext);
  const priceInfo = fetchPrice();
  const [arweaveFeeForMB, setarweaveFeeForMB] = useState("");
  let [costPerSnapshot, setCostPerSnapshot] = useState({
    usd: "",
    winston: "",
  });

  useEffect(() => {
    if (!priceInfo.isLoading && arweaveFeeForMB !== "") {
      let priceInAr =
        +arweaveFeeForMB *
        (depth === Depth.PageOnly
          ? AVERAGE_WEBSITE_DEPTH_0_IN_MB
          : AVERAGE_WEBSITE_DEPTH_1_IN_MB);
      let pricePerSnapshot =
        Math.round((+priceInfo.price * priceInAr * 1000) / 1000000000000) /
        1000;
      setCostPerSnapshot({
        usd: pricePerSnapshot.toString(),
        winston: priceInAr.toString(),
      });
    }
  }, [priceInfo.price, arweaveFeeForMB, depth]);

  useEffect(() => {
    (async () => {
      let res = await warp.arweave.transactions.getPrice(MB);
      setarweaveFeeForMB(res);
    })();
  }, []);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      setURL({ url: url, valid: true });
    }
  }, [router, router.query.url]);

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

  const handleConfirmArchiving = async (frequency: number, depth: number) => {
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

    console.log("here");
    // figure out frequency

    // get

    // let { jwk: wallet, address: walletAddress } = await getLocalAddress();

    // let c = await contract.connect(JSON.parse(wallet));
    // // this allows us to do a "once" only archive
    // let res = await c.requestArchiving({
    //   startTimestamp: Math.floor(Date.now() / 1000),
    //   // give an hour
    //   endTimestamp: Math.floor(Date.now() / 1000) + 3600,
    //   // freq is everyday, will never reach
    //   frequency: "0 0 */24 * * *",
    //   options: {
    //     depth: 0,
    //     domainOnly: false,
    //     urls: [urlInfo.url],
    //   },
    //   uploaderAddress: "2NbYHgsuI8uQcuErDsgoRUCyj9X2wZ6PBN6WTz9xyu0",
    // });
  };
  let toRender = <></>;
  switch (steps) {
    case Steps.WebsiteInput:
      toRender = (
        <WebsiteInput
          urlInfo={urlInfo}
          handleURL={handleURL}
          handleNext={handleNext}
          costPerSnapshot={costPerSnapshot}
        />
      );
      break;
    case Steps.ArchivingOptions:
      toRender = (
        <ArchivingOptions
          urlInfo={urlInfo}
          terms={terms}
          handleNext={handleNext}
          setTerms={setTerms}
          costPerSnapshot={costPerSnapshot}
          depth={depth}
          setDepth={setDepth}
          setToastMessage={setToastMessage}
          handleConfirmArchiving={handleConfirmArchiving}
        />
      );
  }
  return (
    <Container>
      <Toast message={toastMessage} severity="error" />
      {toRender}
      <Faq />
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
                  {props.costPerSnapshot.usd === ""
                    ? ""
                    : "USD $" + props.costPerSnapshot.usd}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16 normal-case"
          disabled={!props.urlInfo.valid}
          onClick={props.handleNext}
        >
          Next
        </button>
        <Paywith />
      </div>
    </div>
  );
}

enum ModalStep {
  Connect,
  Review,
  Pending,
  Success,
  Failure,
}

function ArchivingOptions(props: any) {
  let [frequency, setFrequency] = useState({
    value: 0,
    timeIncrement: Duration.Hours,
  });
  let [numberOfSnapshots, setNumberOfSnapshots] = useState(0);
  let [duration, setDuration] = useState({
    value: "",
    timeIncrement: Duration.Days,
  });
  let [totalCost, setTotalCost] = useState("");
  let [canMoveToPayment, setCanMoveToPayment] = useState(false);
  let [openModal, setOpenModal] = useState(true);
  let [modalStep, setModalStep] = useState(ModalStep.Connect);

  useEffect(() => {
    if (props.urlInfo.valid && props.terms === Terms.Once) {
      setCanMoveToPayment(true);
    } else if (
      props.urlInfo.valid &&
      props.terms === Terms.Multiple &&
      duration.value != ""
    ) {
      setCanMoveToPayment(true);
    } else {
      setCanMoveToPayment(true);
    }
  }, [props.terms, props.urlInfo, duration]);

  useEffect(() => {
    switch (props.terms) {
      case Terms.Once:
        setTotalCost(props.costPerSnapshot.usd);
        break;
      case Terms.Multiple:
        setTotalCost(
          (
            Math.floor(+props.costPerSnapshot.usd * numberOfSnapshots * 1000) /
            1000
          ).toString()
        );
    }
  }, [props.terms, props.costPerSnapshot, numberOfSnapshots]);

  useEffect(() => {
    let timeMultiplier = 24;
    console.log("hi");
    switch (frequency.timeIncrement) {
      case Duration.Hours:
        timeMultiplier = 1;
        break;
      case Duration.Days:
        timeMultiplier = 24;
        break;
    }

    let duration = Math.floor(
      ((frequency.value * timeMultiplier) / 24) * numberOfSnapshots
    );
    if (duration === 0) {
      setDuration({
        value: `${Math.floor(
          frequency.value * timeMultiplier * numberOfSnapshots
        )}`,
        timeIncrement: Duration.Hours,
      });
    } else {
      setDuration({ value: `${duration}`, timeIncrement: Duration.Days });
    }
  }, [numberOfSnapshots, frequency]);

  const handleConnectArweave = async () => {
    if (!window.arweaveWallet) {
      props.setToastMessage(
        <div>No Arweave Wallet injected into the page</div>
      );
      return;
    }

    let arweaveWallet = window.arweaveWallet;

    try {
      let res = await arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "DISPATCH",
      ]);
    } catch (e) {
      console.error("did not allow the connection " + e);
      props.setToastMessage(<div>Connection to Arweave wallet refused</div>);
    }
    // we move on to the next step in the modal
    setModalStep(ModalStep.Review);
  };

  let modalToRender = <></>;
  switch (modalStep) {
    case ModalStep.Connect:
      modalToRender = (
        <ConnectModal handleConnectArweave={handleConnectArweave} />
      );
      break;
    case ModalStep.Review:
      modalToRender = (
        <ReviewModal
          urlInfo={props.urlInfo}
          duration={duration}
          numberOfSnapshots={numberOfSnapshots}
          totalCost={totalCost}
          depth={props.depth}
          frequency={frequency}
          handleConfirmArchiving={props.handleConfirmArchiving}
        />
      );
      break;
    case ModalStep.Pending:
      break;
    case ModalStep.Success:
      break;
    case ModalStep.Failure:
      break;
  }

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
        <div className="btn-group  grid grid-cols-2 w-full border rounded-lg  shadow-xl border-[#00000033]">
          <button
            onClick={() => props.setDepth(Depth.PageOnly)}
            className={
              props.depth === Depth.PageOnly
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>This page only</b>
          </button>
          <button
            onClick={() => props.setDepth(Depth.PageAndLinks)}
            className={
              props.depth === Depth.PageAndLinks
                ? "p-4 border-r border-[#00000033] bg-funpurple"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>This page and linked pages</b>
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
                  value={frequency.value}
                  onChange={(e: any) =>
                    setFrequency({
                      value: e.target.value,
                      timeIncrement: frequency.timeIncrement,
                    })
                  }
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
                  value={frequency.timeIncrement}
                  onChange={(e: any) => {
                    setFrequency({
                      value: frequency.value,
                      timeIncrement: +e.target.value,
                    });
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
                  value={`~ ${duration.value} ${
                    duration.timeIncrement === Duration.Days
                      ? pluralize("day", +duration.value)
                      : pluralize("hour", +duration.value)
                  }`}
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
                  <td className=" font-bold rounded-tr-lg bg-extralightgrey text-right m-4 ">
                    {totalCost === "" ? "" : "USD $" + totalCost}
                  </td>
                </tr>
              ) : (
                <tr className=" ">
                  <td className=" rounded-tl-lg bg-extralightgrey ">
                    Average price per snapshot
                  </td>
                  <td className=" font-bold rounded-tr-lg bg-extralightgrey text-right m-4 ">
                    {props.costPerSnapshot.usd === ""
                      ? ""
                      : "USD $" + props.costPerSnapshot.usd}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16"
          onClick={() => setOpenModal(true)}
          disabled={
            !canMoveToPayment ||
            (+duration.value > 3 && duration.timeIncrement === Duration.Days)
          }
        >
          Next
        </button>
        <Paywith />
      </div>

      <div
        className={
          `modal modal-bottom sm:modal-middle ` +
          (openModal ? `modal-open` : "")
        }
      >
        <div className="modal-box relative p-8 ">
          <label
            htmlFor="payment-modal"
            onClick={() => setOpenModal(false)}
            className="btn btn-sm btn-ghost absolute right-2 top-2"
          >
            X
          </label>
          {modalToRender}
        </div>
      </div>
    </div>
  );
}

function ConnectModal(props: any) {
  return (
    <div>
      <div className="font-bold text-xl">Connect a wallet</div>
      <p className="py-4 text-sm">
        Connecting a wallet to Archive the Web is our version of signing in to
        the service. Your wallet is your account and payment method.
      </p>
      <div className="flex flex-col gap-4">
        <button
          onClick={props.handleConnectArweave}
          className="flex gap-4 items-center p-4 bg-extralightgrey rounded-lg hover:bg-funpurple hover:text-[#FFFFFF] "
        >
          <Image
            src={arweave}
            style={{ height: "25px", width: "25px" }}
            alt="arweave"
          />
          <div>
            <b>Arweave</b>
          </div>
        </button>
        <button
          disabled
          className="flex gap-4 items-center p-4 bg-extralightgrey rounded-lg hover:bg-funpurple hover:text-[#FFFFFF] "
        >
          <Image
            src={mm}
            style={{ height: "25px", width: "25px" }}
            alt="metamask"
          />
          <div>
            <b>Metamask</b> (coming soon)
          </div>
        </button>
        <button
          disabled
          className="flex gap-4 items-center p-4 bg-extralightgrey rounded-lg hover:bg-funpurple  hover:text-[#FFFFFF] "
        >
          <Image
            src={wc}
            style={{ height: "17px", width: "25px" }}
            alt="walletconnect"
          />
          <div>
            <b>WalletConnect</b> (coming soon)
          </div>
        </button>
      </div>
    </div>
  );
}

function ReviewModal(props: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold text-xl">Confirm Archiving</div>

      <div className="flex flex-col gap-4 border border-[#00000033] rounded-lg">
        <div className="flex items-center justify-between p-2">
          <div>URL</div>
          <div>
            <b>{props.urlInfo.url}</b>
          </div>
        </div>
        <div className="flex items-center justify-between p-2">
          <div>Snapshot frequency</div>
          <div>
            <b>
              {props.frequency.value === 0
                ? "Once"
                : `Every ${props.frequency.value}
             ${
               props.frequency.timeIncrement === Duration.Hours
                 ? pluralize("hour", props.frequency.value)
                 : pluralize("day", props.frequency.value)
             }`}
            </b>
          </div>
        </div>
        <div className="flex items-center justify-between p-2">
          <div>Total snapshots</div>
          <div>
            <b>{props.numberOfSnapshots === 0 ? 1 : props.numberOfSnapshots}</b>
          </div>
        </div>
        {props.numberOfSnapshots === 0 ? (
          <></>
        ) : (
          <div className="flex items-center justify-between p-2">
            <div>Duration*</div>
            <div>
              <b>
                ~
                {props.duration.value +
                  " " +
                  (props.duration.timeIncrement === Duration.Days
                    ? pluralize("day", props.duration.value)
                    : pluralize("hour", props.duration.value))}
              </b>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border border-[#00000033] rounded-lg bg-extralightgrey">
        <div>Total cost</div>
        <div>
          <b>USD ${props.totalCost}</b>
        </div>
      </div>

      <button
        className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16 normal-case"
        onClick={() =>
          props.handleConfirmArchiving(props.frequency, props.depth)
        }
      >
        Confirm Archiving
      </button>
      <div className="text-sm text-lightgrey">
        The actual duration and final total number of snapshots may vary
        depending on the market value of AR.
      </div>
    </div>
  );
}
