import { useMoralis } from "react-moralis"

export default function Header() {
    const { enableWeb3, account } = useMoralis()
    return (
        <div>
            {account ? (
                <div>Logged in as {account}</div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                    }}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
