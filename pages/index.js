import Head from "next/head"
import Header from "@/components/Header"

export default function Home() {
    return (
        <div>
            <Head>
                <title>Smart Lottery</title>
                <meta name="description" content="Our Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
        </div>
    )
}
