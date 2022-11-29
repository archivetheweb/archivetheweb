import logo from "../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { fetchPrice } from "../http/fetcher";
import { useRouter } from "next/router";

export const Header: React.FC<any> = (props) => {
  const router = useRouter();
  const { price, isLoading } = fetchPrice();

  return (
    <div
      className={"grid grid-cols-3 pt-4 " + props.className}
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
      <div className="flex col-span-1 justify-end content-center items-center gap-8">
        {/* <div className="flex flex-col">
          <div>Average Snapshot Cost</div>
          <div className="text-funpurple">
            USD ${isLoading ? "loading..." : Math.round(+price * 100) / 100}
          </div>
        </div> */}
        <button
          onClick={() => window.open("https://twitter.com/archive_the_web")}
          className="btn bg-funpurple text-[#FFFFFF] hover:bg-funpurple/75 border-none"
        >
          Follow us on Twitter
        </button>
        {/* <button
          onClick={() => router.push("/save")}
          className="btn bg-funpurple text-[#FFFFFF] hover:bg-funpurple/75 border-none"
        >
          Save a Website
        </button> */}
      </div>
    </div>
  );
};
