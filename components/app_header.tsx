import logo from "../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import ConnectorContext from "../context/connector";
import bookshelf from "../public/bookshelf.png";
import saveWebsite from "../public/save_website.png";

export const AppHeader = () => {
  const { address, blockchain } = useContext(ConnectorContext);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  return (
    <div
      className="grid grid-cols-2 pt-8 px-8"
      style={{ color: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="flex gap-8 ">
        <div className="flex justify-center content-center items-center">
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

        <div className="flex justify-center items-center content-center">
          <div className="p-[11px] border rounded-l-full border-extralightgrey border-r-0">
            <span className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search for websites by URL"
            className="input input-bordered border-extralightgrey border-l-0 rounded-r-full focus:outline-none"
          />
        </div>
      </div>
      <div className="flex justify-end content-center items-center">
        <div className="pr-4 tooltip tooltip-bottom" data-tip="Save a website">
          <Link className="flex gap-2" href={"/save"}>
            <Image
              src={saveWebsite}
              alt="logo"
              style={{ height: "24px", width: "24px" }}
            />
            <div className="hidden lg:inline">Save a Website</div>
          </Link>
        </div>
        <div
          className="pr-4 tooltip tooltip-bottom"
          data-tip="Archive all websites"
        >
          <Link className="flex gap-2" href={"/explore"}>
            <Image
              src={bookshelf}
              alt="logo"
              style={{ height: "24px", width: "24px" }}
            />
            <div className="hidden lg:inline">All archived websites</div>
          </Link>
        </div>
        <button className="btn btn-primary bg-funpurple hover:bg-funmidpurple">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};
