import logo from "../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import ConnectorContext from "../context/connector";

export const AppHeader = () => {
  const { address, blockchain } = useContext(ConnectorContext);

  return (
    <div
      className="grid grid-cols-3 pt-8"
      style={{ color: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="flex gap-8 col-span-2">
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
        <div className="flex justify-center content-center items-center">
          <Link href={"/save"}>Save a Website</Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/explore"}>Explore Archive</Link>
        </div>
        <div className="flex justify-center content-center items-center">
          <Link href={"/faq"}>FAQs</Link>
        </div>
      </div>
      <div className="flex col-span-1 justify-end content-center items-center">
        <button className="btn btn-primary">Connect Wallet</button>
      </div>
    </div>
  );
};
