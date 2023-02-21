import Image from "next/image";
import questionMark from "../public/question_mark.png";
export function Faq() {
  return (
    <div className="grid grid-cols-1 mx-8 md:mx-16 lg:mx-32 mt-4 py-8 gap-3 ">
      <div className="border border-[#00000033] rounded-lg">
        <div tabIndex={0} className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title flex items-center gap-2 ">
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
        <div tabIndex={1} className="collapse collapse-arrow">
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
            currency like Bitcoin and Ethereum. With Archive the Web, you can
            pay for archiving with AR, ETH and ERC-20 tokens on different
            blockchains (i.e. Polygon, Arbitrum, etc.).
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="border border-[#00000033] rounded-lg">
          <div tabIndex={2} className="collapse collapse-arrow">
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
              Yes, you can pay for archiving with credit card. To do so, you
              will need to use Metamask. You can buy ETH and ERC-20 tokens with
              credit card there. You then will use the currency you purchased as
              the final payment method.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
