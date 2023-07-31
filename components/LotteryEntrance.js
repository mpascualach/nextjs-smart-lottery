import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    //moralis provides processes that simplify process behind setting up dApps
    // mr moralis and the big steppers
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() // hex edition of Chain ID
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState(0)
    const [numPlayers, setNumPlayers] = useState(0)
    const [recentWinner, setRecentWinner] = useState(0)

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()

        setEntranceFee(entranceFeeFromContract)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        try {
            await tx.wait(1)
            updateUI()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess, // checks if transaction has been sent
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter raffle"
                        )}
                    </button>
                    <div>Entrance fee: {ethers.utils.formatUnits(entranceFee)}</div>
                    <div>Number of players: {numPlayers}</div>
                    <div>Recent winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No raffle address detected</div>
            )}
        </div>
    )
}
