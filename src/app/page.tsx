'use client'

import { Button, ButtonGroup, CircularProgress } from '@nextui-org/react'
import { use, useEffect, useState } from 'react'
import { undefined } from 'zod'
import { type BaseError, useWaitForTransactionReceipt, useAccount, useWriteContract } from 'wagmi'
import { abi } from '@/utils'
import { bytesToHex, stringToBytes } from 'viem'
// import { Countdown } from '@/app/(components)/Countdown'
import dynamic from 'next/dynamic'
import { config } from '@/app/config/config'
import data from './today/0318.json'

const Countdown = dynamic(() => import('./(components)/Countdown'), {
  ssr: false,
})

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export default function Home() {
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { address, isConnected } = useAccount()

  const [id, setId] = useState<number[]>([])
  const [win, setWin] = useState<(boolean | undefined)[]>([])

  const check = (checkId: number) => {
    const index = id.indexOf(checkId)
    if (index !== -1) return win[index]
    else return undefined
  }

  const add = (addId: number, addWin: boolean) => {
    console.log(addId, addWin)
    const index = id.indexOf(addId)
    if (index !== -1) {
      win[index] = addWin
      setWin(win.slice())
    } else {
      setId([...id, addId])
      setWin([...win, addWin])
    }
  }

  const submit = () => {
    console.log(id, win, address)
    if (!isConnected) {
      alert('Please connect your wallet')
      return
    }
    if (id.length !== data.length || win.length !== data.length) {
      alert('Please bet all games')
      return
    }

    writeContract(
      {
        abi,
        address: config.address as `0x${string}`,
        functionName: 'sendPacket',
        args: [bytesToHex(stringToBytes(config.channel), { size: 32 }), 36000, address, id, win],
      },
      {
        onError: (error: Error) => {
          console.warn(error)
        },
      }
    )
  }

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      setId([])
      setWin([])
      alert('Bet is confirmed')
    }
  }, [isConfirmed])

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center gap-y-3">
      <Countdown time={config.endTime} />
      {data ? (
        <>
          {data.map((v: any) => (
            <div key={v.id}>
              <ButtonGroup>
                {/*{`${check(v.id)}`}*/}
                <Button
                  onClick={() => add(v.id, false)}
                  color="primary"
                  variant={check(v.id) === undefined ? 'ghost' : check(v.id) ? 'ghost' : 'solid'}
                  className={'w-44 h-16'}
                >
                  {v.visitor_team.full_name}
                </Button>
                <Button
                  onClick={() => add(v.id, true)}
                  color="primary"
                  variant={check(v.id) === undefined ? 'ghost' : check(v.id) ? 'solid' : 'ghost'}
                  className={'w-44 h-16'}
                >
                  {v.home_team.full_name}
                </Button>
              </ButtonGroup>
            </div>
          ))}
          <Button
            onClick={() => submit()}
            color="primary"
            className={'mt-3'}
            disabled={Math.floor(Date.now() / 1000) > config.endTime || isPending}
          >
            {isPending ? 'Confirming...' : 'Submit'}
          </Button>
        </>
      ) : (
        <CircularProgress size="lg" aria-label="Loading..." />
      )}
      {error && <div className="text-red-500">Error: {(error as BaseError).shortMessage || error.message}</div>}
    </main>
  )
}
