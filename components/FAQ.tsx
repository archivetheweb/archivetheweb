import Image from "next/image";
import Link from "next/link";
import questionMark from "../public/question_mark.png";
export function Faq() {
  return (
    <div className="grid grid-cols-1 mx-4 md:mx-8 lg:mx-16 mt-4 py-8 gap-3 ">
      {faq.map((item, index) => (
        <div key={index} className="border border-[#00000033] rounded-lg">
          <div tabIndex={0} className="collapse collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-2 ">
              <Image
                src={questionMark}
                alt="info 1"
                style={{ width: "18px", height: "18px" }}
              />
              {item.question}
            </div>
            <div className="collapse-content">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const faq = [
  {
    question: (
      <>
        {" "}
        <span className="text-funpurple font-bold ">
          What is the difference between &quot;This page only&quot; and
          &quot;This page and linked pages&quot;?{" "}
        </span>{" "}
      </>
    ),
    answer: (
      <>
        {" "}
        <b>This page only</b> means the archive will consist only of the content
        on the page whose URL you enter.
        <br />
        <br />
        <b>This page and linked pages</b> means the archiver will archive the
        submitted URL, collect <b>all</b> links within that page and archive
        them too. For example, if your page has a link to your Twitter page,
        that twitter page will be archived too, but it won&apos;t go deeper than
        that.
      </>
    ),
  },
  {
    question: (
      <>
        <span className="text-funpurple font-bold ">
          Why do I need to pay to save a website?{" "}
        </span>{" "}
      </>
    ),
    answer: (
      <>
        All website snapshots are saved on Arweave, a permanent data storage
        protocol. A small fee is sent to the network to pay data storers to add
        data to the network and keep it for 200+ years. Archive the Web does not
        take a fee. Learn more{" "}
        <Link
          className="underline"
          href={
            "https://ardrive.io/topic/arweave-economics/#:~:text=Arweave%20Endowment&text=Arweave%20designed%20the%20system%20so,a%20University%20or%20non%2Dprofit"
          }
          target="_blank"
          rel={"noreferrer"}
        >
          here
        </Link>
        .
      </>
    ),
  },
  {
    question: (
      <>
        {" "}
        <span className="text-funpurple font-bold ">
          What are the &quot;Advanced&quot; options?{" "}
        </span>{" "}
      </>
    ),
    answer: (
      <>
        {" "}
        <b>Depth</b> refers to the depth of the crawl. 0 means the page you
        entered, 1 means the page and links on that page, 2 means the page,
        links on that page, and links on those pages, and so on.
        <br />
        <br />
        <b>Crawl Type</b> refers to the type of crawl:
        <ol>
          <li>
            <br />
            <b>Domain only</b> means the crawl will only crawl the domain you
            entered. i.e if the url is https://bbc.com, the crawler will only
            access any URL with bbc.com as domain.
          </li>
          <li>
            <br />
            <b>Domain with page links</b> means the crawl will crawl the domain
            you entered and all links on the page you entered.
          </li>
          <br />
          <li>
            <b>Full</b> means the crawl will crawl the domain you entered and
            all links on the page you entered and all links on those pages.
          </li>
        </ol>
      </>
    ),
  },
  {
    question: (
      <>
        <span className="text-funpurple font-bold ">
          What payment methods are accepted?{" "}
        </span>{" "}
      </>
    ),
    answer: (
      <>
        To archive on Arweave, the payment must be made in their native
        currency, a token called “AR.” You can think of this as a digital
        currency like Bitcoin and Ethereum. With Archive the Web, you can
        currently pay for archiving with AR. Soon, ETH and ERC-20 tokens on
        different blockchains (i.e. Polygon, Arbitrum, etc.) will be added.
      </>
    ),
  },
  // {
  //   question: (
  //     <>
  //  <span className="text-funpurple font-bold ">
  //               Is it possible to pay with credit card?{" "}
  //             </span>{" "}
  //     </>
  //   ),
  //   answer: (
  //     <>
  //           Yes, you will be able to pay for archiving with a credit card as
  //             soon as we integrate with Metamask. To do so, you will need to use
  //             Metamask. You can buy ETH and ERC-20 tokens with credit card
  //             there. You then will use the currency you purchased as the final
  //             payment method.
  //     </>
  //   ),
  // },
];
