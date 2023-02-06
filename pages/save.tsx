import Image from "next/image";
import arweave from "../public/ar.png";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import { isValidUrl, Toast } from "../components/utils";
import { useRouter } from "next/router";
import info from "../public/info.png";
import CustomIframe from "../components/iframe";
import ConnectorContext from "../context/connector";

export default function Save() {
  const router = useRouter();

  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [frequency, setFrequency] = useState(0);
  let [duration, setDuration] = useState(0);
  let [terms, setTerms] = useState("short"); // short by default for now
  let [isCheckout, setIsCheckout] = useState(false); // short by default for now
  const { contract, warp } = useContext(ConnectorContext);
  let [toastMessage, setToastMessage] = useState(<></>);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      setURL({ url: url, valid: true });
    }
  }, [router, router.query.url]);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    let valid = isValidUrl(e.currentTarget.value);

    setURL({
      url: e.currentTarget.value,
      valid,
    });
    if (valid) {
      setIsCheckout(true);
    } else {
      setIsCheckout(false);
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

    // we create a new wallet for a newcomer
    console.log("generating wallet...");
    let { jwk: wallet, address: walletAddress } = await warp.generateWallet();

    let c = await contract.connect(wallet);
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
  return (
    <Container>
      <Toast message={toastMessage} severity="error" />
      <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-8 md:mx-16 lg:mx-32 mt-16 pt-16 px-16 shadow-xl ">
        <div className="text-3xl">Save a website</div>

        <div className="text-[#0000008A] pb-3">
          Help create an open and decentralized backup of the world wide web.
        </div>

        <div className="flex flex-col justify-center content-center items-center w-full gap-4">
          <div className="btn-group  grid grid-cols-2 w-full rounded-ful border rounded-full  border-[#00000033]">
            <button className="rounded-l-full bg-[#1f94ee16] p-4 border-r border-[#00000033]">
              ✓ One Time
            </button>
            <button className="rounded-r-full bg-[#1f94ee16] disabled  ">
              Long Term
            </button>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Website</span>
            </label>
            <input
              type="text"
              value={urlInfo.url}
              onChange={handleURL}
              placeholder="https://bbc.com"
              className="input input-bordered w-full h-16"
            />
          </div>

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
            // <Image src={emptyWebpage} alt="empty webpage" />
            <></>
          )}

          {terms === "long" && (
            <>
              <div className="form-control w-full  ">
                <label className="label">
                  <span className="label-text">
                    Snapshot Frequency (in minutes)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="i.e. every 60 minutes"
                  className="input input-bordered w-full h-16 "
                />
              </div>

              <div className="form-control w-full ">
                <label className="label">
                  <span className="label-text">Duration (in days)</span>
                </label>
                <input
                  type="text"
                  placeholder="Days snapshots will be prepaid (i.e. 365 days)"
                  className="input input-bordered w-full h-16 "
                />
              </div>
            </>
          )}

          <div className="overflow-x-auto w-full border border-[#00000033] rounded-lg">
            <table className="table w-full ">
              <thead></thead>
              <tbody className="">
                {!isCheckout ? (
                  <tr className=" ">
                    <td className=" rounded-tl-lg bg-extralightgrey ">
                      Expected Price Per Snapshot
                    </td>
                    <td className=" font-bold rounded-tr-lg bg-extralightgrey text-right m-4 ">
                      USD $0.007
                    </td>
                  </tr>
                ) : (
                  <tr className="">
                    <td className="bg-extralightgrey">Total Cost</td>
                    <td className="bg-extralightgrey">-</td>
                  </tr>
                )}

                {terms === "long" && (
                  <tr className="">
                    <td className="bg-extralightgrey">Total Snapshots*</td>
                    <td className="bg-extralightgrey">-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            className="btn w-full btn-primary bg-funpurple hover:bg-funmidpurple h-16"
            onClick={handleContinueToPayment}
          >
            Continue to payment
          </button>

          <div>
            <div className="flex gap-2 p-8">
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
        </div>
      </div>
      <div className="grid grid-cols-1 border border-[#00000033] rounded-lg mx-8 md:mx-16 lg:mx-32 mt-4 px-16 py-8 shadow-xl ">
        <div className="flex gap-4 pb-1">
          <Image
            src={info}
            alt="info 1"
            style={{ width: "18px", height: "18px" }}
          />
          <div>
            <span className="text-funpurple font-bold ">
              Why do I need to pay to save a website?{" "}
            </span>{" "}
            All website snapshots are saved on Arweave, a permanent data storage
            protocol. A small fee is sent to the network to pay data storers to
            add data to the network and keep it for 200+ years. Archive the Web
            does not take a fee. Learn more here.
          </div>
        </div>
        <div className="flex gap-4 pb-1">
          <Image
            src={info}
            alt="info 2"
            style={{ width: "18px", height: "18px" }}
          />
          <div>
            <span className="text-funpurple font-bold ">
              What payment methods are accepted?{" "}
            </span>{" "}
            To archive on Arweave, the payment must be made in their native
            currency, a token called “AR.” You can think of this as a digital
            currency like Bitcoin and Ethereum. With Archive the Web, you can
            pay for archiving with AR, ETH and ERC-20 tokens on different
            blockchains (i.e. Polygon, Arbitrum, etc.).
          </div>
        </div>
        <div className="flex gap-4">
          <Image
            src={info}
            alt="info 3"
            style={{ width: "18px", height: "18px" }}
          />
          <div>
            <span className="text-funpurple font-bold ">
              Is it possible to pay with credit card?{" "}
            </span>{" "}
            Yes, you can pay for archiving with credit card. To do so, you will
            need to use Metamask. You can buy ETH and ERC-20 tokens with credit
            card there. You then will use the currency you purchased as the
            final payment method.
          </div>
        </div>
      </div>
    </Container>
  );
}
