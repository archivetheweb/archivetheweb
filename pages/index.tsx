import { Web3Button } from "@web3modal/react";
import { Footer } from "../components/footer";
import styles from "../styles/Home.module.css";
import { Header } from "../components/header";

export default function Home() {
  return (
    <div className="container mx-auto px-4 h-screen ">
      <main className={"h-full " + styles.main}></main>
      <Footer passedClass={styles.footer} />
    </div>
  );
}
