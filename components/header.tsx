import logo from "../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { fetchArweaveMarketPrice, fetchBundlrPrice } from "../http/fetcher";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Depth } from "./types";
import { calculateUploadPriceWithDepth, MB } from "./utils";

export const Header: React.FC<any> = (props) => {
  const router = useRouter();
  const priceInfo = fetchArweaveMarketPrice();
  const bundlrPriceInfo = fetchBundlrPrice();
  let [costPerSnapshot, setCostPerSnapshot] = useState({
    usd: "",
    winston: "",
  });

  useEffect(() => {
    if (!priceInfo.isLoading && !bundlrPriceInfo.isLoading) {
      (async () => {
        let arweaveFeeForMB = bundlrPriceInfo.price;
        setCostPerSnapshot(
          calculateUploadPriceWithDepth(
            +arweaveFeeForMB,
            Depth.PageOnly,
            +priceInfo.price
          )
        );
      })();
    }
  }, [
    priceInfo.price,
    priceInfo.isLoading,
    bundlrPriceInfo.price,
    bundlrPriceInfo.isLoading,
  ]);

  return (
    <div
      className={
        "grid grid-cols-2 justify-center content-center items-center md:grid-cols-3 pt-4 w-full " +
        props.className
      }
      style={{ color: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="flex gap-4 md:hidden">
        <div className="flex  md:hidden ">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="logo"
              style={{
                maxHeight: "41px",
                maxWidth: "140px",
                minHeight: "30px",
                minWidth: "100px",
              }}
            />
          </Link>
        </div>

        <ul className="menu menu-horizontal bg-base-100 rounded  md:hidden z-50">
          <li tabIndex={0}>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </span>
            <ul className="bg-base-100 border border-lightgrey ">
              <li className="border-b border-lightgrey">
                <a className=" p-6" href="#how_it_works">
                  How it works
                </a>
              </li>
              <li className="border-b border-lightgrey">
                <a className=" p-6" href="#faq">
                  FAQs
                </a>
              </li>
              <li>
                <a className=" p-6" href="#contribute">
                  Contribute
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className=" gap-8 col-span-2  hidden md:flex ">
        <div className="flex justify-center content-center items-center ">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="logo"
              style={{
                maxHeight: "41px",
                maxWidth: "140px",
                minHeight: "30px",
                minWidth: "100px",
              }}
            />
          </Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/"}>Home</Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/#how_it_works"}>How it works</Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/#faq"}>FAQs</Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/#contribute"}>Contribute</Link>
        </div>
      </div>
      <div className="flex col-span-1 justify-end content-center items-center gap-8 ">
        {costPerSnapshot.usd === "" ? (
          <></>
        ) : (
          <div className=" flex-col hidden xl:flex ">
            <div
              className="tooltip tooltip-bottom"
              data-tip="Based on a 5mb upload"
            >
              Average Snapshot Cost
            </div>
            <div className="text-funpurple">
              {" "}
              {costPerSnapshot.usd === "" ? "" : `USD $${costPerSnapshot.usd}`}
            </div>
          </div>
        )}
        <Link
          href="/explore"
          style={{ borderRadius: "5px" }}
          className=" btn bg-funpurple normal-case  text-[#FFFFFF] hover:bg-funpurple/75 border-none"
        >
          See all archived sites
        </Link>
      </div>
    </div>
  );
};
