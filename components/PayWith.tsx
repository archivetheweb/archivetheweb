import Image from "next/image";
import arweave from "../public/ar.png";
import mm from "../public/mm.png";
import wc from "../public/wc.png";
export function Paywith() {
  return (
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
}
