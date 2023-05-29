import Image from "next/image";
import arweave from "../public/ar.png";
import floppy from "../public/floppy.webp";
import dance from "../public/success_dance.gif";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import {
  AVERAGE_WEBSITE_DEPTH_0_IN_MB,
  AVERAGE_WEBSITE_DEPTH_1_IN_MB,
  calculateUploadPriceWithDepth,
  durationToSeconds,
  getDomain,
  isValidUrl,
  pluralize,
  processURL,
  shortenAddress,
  Toast,
  translateToCronFrequency,
  UPLOADER,
} from "../components/utils";
import { useRouter } from "next/router";
import infinity from "../public/infinity.png";
import monitor from "../public/monitor.png";
import CustomIframe from "../components/iframe";
import ConnectorContext from "../context/connector";
import { fetchArweaveMarketPrice, fetchBundlrPrice } from "../http/fetcher";
import { Faq } from "../components/FAQ";
import { Paywith } from "../components/PayWith";
import {
  Depth,
  TimeUnit,
  ModalStep,
  Steps,
  Terms,
  CrawlTypes,
} from "../components/types";

export default function Save() {
  const router = useRouter();

  let [urlInfo, setURL] = useState({ url: "", valid: false, domain: "" });
  let [terms, setTerms] = useState(Terms.Once);
  let [depth, setDepth] = useState(Depth.PageOnly);
  let [steps, setSteps] = useState(Steps.WebsiteInput);
  let [toastMessage, setToastMessage] = useState(<></>);
  const priceInfo = fetchArweaveMarketPrice();
  const bundlrPriceInfo = fetchBundlrPrice();
  let [costPerSnapshot, setCostPerSnapshot] = useState({
    usd: "",
    winston: "",
  });

  useEffect(() => {
    if (!priceInfo.isLoading && !bundlrPriceInfo.isLoading) {
      let arweaveFeeForMB = bundlrPriceInfo.price;
      setCostPerSnapshot(
        calculateUploadPriceWithDepth(+arweaveFeeForMB, depth, +priceInfo.price)
      );
    }
  }, [
    priceInfo.price,
    priceInfo.isLoading,
    bundlrPriceInfo.isLoading,
    bundlrPriceInfo.price,
    depth,
  ]);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      url = processURL(url);
      setURL({ url: url, valid: true, domain: getDomain(url) });
    }
  }, [router, router.query.url]);

  useEffect(() => {
    let clear = router.query.clear as string;
    if (clear) {
      setURL({ url: "", valid: false, domain: "" });
      setTerms(Terms.Once);
      setDepth(Depth.PageOnly);
      setSteps(Steps.WebsiteInput);
      router.push("/save");
    }
  }, [router, router.query.clear]);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    let url = e.currentTarget.value;
    let valid = isValidUrl(url);

    if (valid) {
      url = processURL(url);
    }

    setURL({
      url: url,
      valid,
      domain: getDomain(url),
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

  let toRender = <></>;
  switch (steps) {
    case Steps.WebsiteInput:
      toRender = (
        <WebsiteInput
          urlInfo={urlInfo}
          handleURL={handleURL}
          handleNext={handleNext}
          costPerSnapshot={costPerSnapshot}
          depth={depth}
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
  let [hasBeenArchived, setHasBeenArchived] = useState({
    isLoading: false,
    result: false,
  });
  const { contract } = useContext(ConnectorContext);

  useEffect(() => {
    if (props.urlInfo.valid) {
      (async () => {
        setHasBeenArchived({ isLoading: true, result: false });
        try {
          let res = await contract.archivesByURL({
            url: getDomain(props.urlInfo.url),
            count: 1,
          });
          setHasBeenArchived({
            isLoading: false,
            result: res.archives.archivedInfo.length > 0,
          });
        } catch (e) {
          console.error(e);
          setHasBeenArchived({ isLoading: false, result: false });
        }
      })();
    }
  }, [props.urlInfo, contract]);

  return (
    <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-4 md:mx-8 lg:mx-16 mt-16 pt-16 px-8 md:px-16 shadow-xl ">
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
            placeholder="Enter a website to save (ex. https://bbc.com)"
            className="input input-bordered w-full h-16"
          />
        </div>

        {props.urlInfo.valid &&
        !hasBeenArchived.isLoading &&
        !hasBeenArchived.result ? (
          <div
            className="w-full flex items-center justify-center rounded-lg p-6 text-lg  text-[#FFFFFF]"
            style={{
              fontWeight: 700,
              background:
                "linear-gradient(89.94deg, #5EEAA7 -0.81%, #7CACF5 23.02%, #A186F8 43.06%, #FC79D5 59.85%, #F8A170 79.89%, #E3F95C 102.09%)",
            }}
          >
            You&apos;ll be the first person to archive this site 🎉
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
                  <div
                    className="tooltip tooltip-right"
                    data-tip={`Based on a ${
                      props.depth === Depth.PageOnly
                        ? AVERAGE_WEBSITE_DEPTH_0_IN_MB
                        : AVERAGE_WEBSITE_DEPTH_1_IN_MB
                    }mb upload`}
                  >
                    Average price per snapshot
                  </div>
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

function ArchivingOptions(props: any) {
  let [frequency, setFrequency] = useState({
    value: 0,
    unit: TimeUnit.Hours,
  });
  let [numberOfSnapshots, setNumberOfSnapshots] = useState(0);
  let [duration, setDuration] = useState({
    value: "",
    unit: TimeUnit.Days,
  });
  let [totalCost, setTotalCost] = useState("");
  let [canMoveToPayment, setCanMoveToPayment] = useState(false);
  let [openModal, setOpenModal] = useState(false);
  let [modalStep, setModalStep] = useState(ModalStep.Connect);
  const { contract, warp, getLocalAddress } = useContext(ConnectorContext);
  let [paymentTxID, setPaymentTxID] = useState("");
  let [advancedOptions, setAdvancedOptions] = useState(false);
  let [crawlType, setCrawlType] = useState(CrawlTypes.DomainWithPageLinks);

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
        break;
    }
  }, [props.terms, props.costPerSnapshot, numberOfSnapshots]);

  useEffect(() => {
    let timeMultiplier = 24;
    switch (frequency.unit) {
      case TimeUnit.Hours:
        timeMultiplier = 1;
        break;
      case TimeUnit.Days:
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
        unit: TimeUnit.Hours,
      });
    } else {
      setDuration({ value: `${duration}`, unit: TimeUnit.Days });
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
      await arweaveWallet.connect([
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

  const handleConfirmArchiving = async () => {
    if (!props.urlInfo.valid) {
      props.setToastMessage(
        <span>
          <b>URL</b> is not valid
        </span>
      );
      console.error("url is not valid");
      return;
    }

    try {
      let cronFreq = translateToCronFrequency(frequency.value, frequency.unit);

      let costInWinston =
        numberOfSnapshots === 0
          ? +props.costPerSnapshot.winston
          : numberOfSnapshots * +props.costPerSnapshot.winston;

      let secondsToAdd = durationToSeconds(duration);

      let c = await contract.connect("use_wallet");
      let res = await c.requestArchiving({
        startTimestamp: Math.floor(Date.now() / 1000),
        // TODO calculate this
        endTimestamp: Math.floor(Date.now() / 1000) + secondsToAdd,
        frequency: cronFreq,
        options: {
          depth: props.depth,
          crawlType: crawlType,
          urls: [props.urlInfo.url],
        },
        uploaderAddress: UPLOADER,
      });

      let interactionTxID = res?.originalTxId || "";
      let bundlrID = res?.bundlrResponse?.id || "";
      console.debug("Interaction result", res);
      console.debug("Interaction tx", interactionTxID);

      let tx = await warp.arweave.createTransaction({
        target: UPLOADER,
        quantity: costInWinston.toString(),
      });
      tx.addTag("App-Name", "atw_frontend");
      tx.addTag("App-Name", "0.0.1_beta");
      tx.addTag("Reason", "archive_request_payment");
      tx.addTag("Interaction-Id", interactionTxID);
      tx.addTag("Bundlr-Id", bundlrID);
      tx.addTag("Domain", props.urlInfo.domain);
      await warp.arweave.transactions.sign(tx);
      let paymentTxStatus = await warp.arweave.transactions.post(tx);
      console.debug("Payment status", paymentTxStatus);

      let paymentTxID = tx.id;
      setPaymentTxID(paymentTxID);
      console.log("Payment ID", paymentTxID);

      let local = await getLocalAddress();
      c.connect(JSON.parse(local?.jwk || "{}"));

      setModalStep(ModalStep.Pending);
      setTimeout(() => {
        setModalStep(ModalStep.Success);
      }, 6000);
    } catch (e: any) {
      console.error("Could not confirm archiving", e);
    }
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
          handleConfirmArchiving={handleConfirmArchiving}
        />
      );
      break;
    case ModalStep.Pending:
      modalToRender = (
        <PendingModal urlInfo={props.urlInfo} txID={paymentTxID} />
      );
      break;
    case ModalStep.Success:
      modalToRender = (
        <SuccessModal txID={paymentTxID} urlInfo={props.urlInfo} />
      );
      break;
    case ModalStep.Failure:
      break;
  }

  return (
    <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-4 md:mx-8 lg:mx-16 mt-16 pt-16 px-16 shadow-xl gap-3 ">
      <div className="text-3xl">Set up Archiving</div>
      <div className="flex w-full p-4 items-center gap-1 bg-extralightgrey rounded-lg">
        <Image
          src={monitor}
          alt="monitor"
          style={{ width: "24px", height: "24px" }}
        />
        {props.urlInfo.url}
      </div>
      <div className=" w-full p-4 items-center gap-1 bg-funlightpurple rounded-lg hidden sm:flex">
        <Image
          src={infinity}
          alt="infinity"
          style={{ width: "24px", height: "24px" }}
        />
        Snapshots are saved for <b className="">200+ years</b> on Arweave.
      </div>
      <div>Take a snapshot:</div>
      <div className="flex flex-col justify-center content-center items-center w-full gap-4">
        <div className="btn-group  grid grid-cols-2 w-full border rounded-lg  shadow-xl border-[#00000033]">
          <button
            onClick={() => props.setTerms(Terms.Once)}
            className={
              props.terms === Terms.Once
                ? "p-4 border-r border-[#00000033] bg-funpurple text-[#FFFFFF]"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>One Time</b>
          </button>
          <button
            onClick={() => props.setTerms(Terms.Multiple)}
            className={
              props.terms === Terms.Multiple
                ? "p-4 border-r border-[#00000033] bg-funpurple text-[#FFFFFF]"
                : "p-4 border-r border-[#00000033]"
            }
          >
            <b>Long Term</b>
          </button>
        </div>
        {!advancedOptions && (
          <div className="btn-group  grid grid-cols-2 w-full border rounded-lg  shadow-xl border-[#00000033]">
            <button
              onClick={() => props.setDepth(Depth.PageOnly)}
              className={
                props.depth === Depth.PageOnly
                  ? "p-4 border-r border-[#00000033] bg-funpurple text-[#FFFFFF]"
                  : "p-4 border-r border-[#00000033]"
              }
            >
              <b>This page only</b>
            </button>
            <button
              onClick={() => props.setDepth(Depth.PageAndLinks)}
              className={
                props.depth === Depth.PageAndLinks
                  ? "p-4 border-r border-[#00000033] bg-funpurple text-[#FFFFFF]"
                  : "p-4 border-r border-[#00000033]"
              }
            >
              <b>This page and linked pages</b>
            </button>
          </div>
        )}

        <div className="flex w-full justify-end gap-3">
          <span>Advanced</span>
          <input
            type="checkbox"
            className="toggle bg-funpurple"
            checked={advancedOptions}
            onClick={() => setAdvancedOptions(!advancedOptions)}
          />
        </div>

        {advancedOptions && (
          <>
            <div className="flex form-control w-full items-center flex-col sm:flex-row gap-0 sm:gap-4   ">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Crawl Depth:</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter a number"
                  value={props.depth}
                  onChange={(e: any) => {
                    // TODO remove this in the future
                    let depth = +e.target.value;
                    if (+depth > 3) {
                      depth = 3;
                    }
                    props.setDepth(depth);
                  }}
                  className="input input-bordered w-full h-16 "
                />
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">
                    <span className="label-text">Crawl type:</span>
                  </span>
                </label>
                <select
                  className="select select-bordered w-full h-16"
                  value={crawlType}
                  defaultValue={CrawlTypes.DomainWithPageLinks}
                  onChange={(e: any) => {
                    setCrawlType(e.target.value);
                  }}
                >
                  <option key={1} value={CrawlTypes.DomainWithPageLinks}>
                    Domain with page links
                  </option>
                  <option key={2} value={CrawlTypes.DomainOnly}>
                    Domain Only
                  </option>
                  <option key={3} value={CrawlTypes.DomainAndLinks}>
                    Full
                  </option>
                </select>
              </div>
            </div>
          </>
        )}
        {props.terms === Terms.Multiple && (
          <>
            <div className="flex form-control w-full items-center flex-col sm:flex-row gap-0 sm:gap-4   ">
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
                      unit: frequency.unit,
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
                  value={frequency.unit}
                  defaultValue={TimeUnit.Hours}
                  onChange={(e: any) => {
                    setFrequency({
                      value: frequency.value,
                      unit: +e.target.value,
                    });
                  }}
                >
                  <option key={TimeUnit.Hours} value={TimeUnit.Hours}>
                    Hours
                  </option>
                  <option key={TimeUnit.Days} value={TimeUnit.Days}>
                    Days
                  </option>
                </select>
              </div>
            </div>

            <div className="flex form-control w-full items-center flex-col sm:flex-row gap-0 sm:gap-4">
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
                    duration.unit === TimeUnit.Days
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
            (+duration.value > 3 && duration.unit === TimeUnit.Days)
          }
        >
          {+duration.value > 3 && duration.unit === TimeUnit.Days
            ? "Please limit your archiving to less than 3 days"
            : "Next"}
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
        {/* <button
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
        </button> */}
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
               props.frequency.unit === TimeUnit.Hours
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
        <div className="flex items-center justify-between p-2">
          <div>Depth</div>
          <div>
            <b>
              {props.depth === Depth.PageOnly
                ? "Page only"
                : "Page and links included"}
            </b>
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
                  (props.duration.unit === TimeUnit.Days
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
        onClick={props.handleConfirmArchiving}
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

function PendingModal(props: any) {
  return (
    <div className="flex flex-col  gap-4">
      <div className="font-bold text-xl">Archiving in progress</div>

      <div className="flex flex-col gap-4 items-center">
        <Image src={floppy} alt="floppy" />
      </div>
      <div>
        Setting up the archiving of <b>{props.urlInfo.url}</b>. This may take
        some time.
      </div>
      <div className="flex items-center justify-between p-4 border border-[#00000033] rounded-lg bg-extralightgrey">
        <div>Tx ID</div>
        <Link
          className="text-[#1F94EE]"
          href={"https://viewblock.io/arweave/tx/" + props.txID}
        >
          <b>{shortenAddress(props.txID)}</b>
        </Link>
      </div>
    </div>
  );
}

function SuccessModal(props: any) {
  const router = useRouter();

  return (
    <div className="flex flex-col  gap-4">
      <div className="font-bold text-xl">Success!</div>

      <div className="flex flex-col gap-4 items-center">
        <Image src={dance} alt="dance" />
      </div>
      <div>
        Your archive request is being processed! Thank you for contributing to
        Archive the Web!
      </div>
      <div className="flex items-center justify-between p-4 border border-[#00000033] rounded-lg bg-extralightgrey">
        <div>Tx ID</div>
        <Link
          className="text-[#1F94EE]"
          href={"https://viewblock.io/arweave/tx/" + props.txID}
        >
          <b>{shortenAddress(props.txID)}</b>
        </Link>
      </div>
      <button
        className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16 normal-case"
        onClick={() => {
          router.push(`/url?url=${props.urlInfo.domain}`);
        }}
      >
        Go to {props.urlInfo.url} Archive
      </button>
    </div>
  );
}
