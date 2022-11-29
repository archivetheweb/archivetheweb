import { Footer } from "../components/footer";
import { AppHeader } from "../components/app_header";
import emptyWebpage from "../public/empty_webpage.png";
import Image from "next/image";
import arweave from "../public/ar.png";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import { isValidUrl } from "../components/utils";
import { useRouter } from "next/router";

export default function Save() {
  const router = useRouter();

  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [frequency, setFrequency] = useState(0);
  let [duration, setDuration] = useState(0);
  let [terms, setTerms] = useState("short"); // short by default for now

  // TODO remove
  useEffect(() => {
    router.push("/");
  }, []);

  useEffect(() => {
    let url = router.query.url as string;
    if (url && isValidUrl(url)) {
      setURL({ url: url, valid: true });
    }
  }, []);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    setURL({
      url: e.currentTarget.value,
      valid: isValidUrl(e.currentTarget.value),
    });
  };
  return (
    <Container>
      <div className="text-3xl">Save a website</div>

      <div className="text-[#0000008A] pb-3">
        Help create a historical log of important websites. Each snapshot is
        stored on Arweave, a permanent data storage solution.
      </div>

      <div className="grid grid-cols-2 border border-[#00000033] rounded-lg    ">
        <div className="flex flex-col justify-center content-center items-center w-full gap-4 border-r border-[#00000033]  p-8 ">
          {/* <div className="flex justify-center content-center items-center w-full  "> */}
          <div className="btn-group  grid grid-cols-2 w-full rounded-ful border rounded-full  border-[#00000033]">
            <button className="rounded-l-full bg-[#1f94ee16] p-4 border-r border-[#00000033]">
              ✓ One Time
            </button>
            <button className="rounded-r-full bg-[#1f94ee16] disabled  ">
              Long Term
            </button>
          </div>
          {/* </div> */}

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
                <tr className="bg-[#1f94ee0a] ">
                  <td className="bg-[#1f94ee0a] rounded-tl-lg">
                    Expected Price Per Snapshot
                  </td>
                  <td className="bg-[#1f94ee0a] rounded-tr-lg ">USD $0.007</td>
                </tr>

                {terms === "long" && (
                  <tr className="bg-[#1f94ee0a]">
                    <td className="bg-[#1f94ee0a]">Total Snapshots*</td>
                    <td className="bg-[#1f94ee0a]">-</td>
                  </tr>
                )}

                <tr className="bg-[#1f94ee0a]">
                  <td className="bg-[#1f94ee0a]">Total Cost</td>
                  <td className="bg-[#1f94ee0a]">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="btn w-full btn-primary h-16">
            Connect Wallet
          </button>

          <div>
            <div className="flex gap-2">
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

        <div className="flex flex-col  items-center p-8 ">
          {urlInfo.valid ? (
            <>
              <iframe
                className=" h-5/6  shadow-2xl w-full "
                src={urlInfo.url}
              />
              <div className="flex justify-end w-full pt-2">
                <Link
                  className="link  link-primary link-hover"
                  href={urlInfo.url}
                  target="_blank"
                >
                  Open website ↗{" "}
                </Link>
              </div>
            </>
          ) : (
            <Image src={emptyWebpage} alt="empty webpage" />
          )}
        </div>
      </div>
    </Container>
  );
}