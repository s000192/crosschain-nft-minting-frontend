import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import NFTonPolygonBalance from '../components/NFTonPolygonBalance';
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import addresses from "../constants/addresses.json";

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>Crosschain NFT minting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <h1>
          Crosschain NFT minting
        </h1>

        <h3>
          0. Switch your network to Goerli testnet
        </h3>

        <h3>
          <a href="https://goerlifaucet.com/">
            1. Get your Goerli ETH here
          </a>
        </h3>
        {isConnected && (
          <section>
            <ETHBalance />
          </section>
        )}

        <h3>2. Get mock ERC20 tokens for testing</h3>
        {isConnected && (
          <section>
            <TokenBalance tokenAddress={addresses.mockToken} symbol="MOCK" />
          </section>
        )}

        <h3>3. Mint NFT on Polygon Mumbai with mock ERC20 tokens</h3>
        {isConnected && (
          <section>
            <NFTonPolygonBalance />
          </section>
        )}

        <h3>
          4. Wait for confirmation on Polygon Mumbai.
        </h3>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
