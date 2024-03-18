'use client'

import { Button, ButtonGroup, CircularProgress } from '@nextui-org/react'
import useSWR from 'swr'
import { useState } from 'react'
import { undefined } from 'zod'
import { useAccount, useWriteContract } from 'wagmi'
import { abi } from '@/utils'
import { bytesToHex, stringToBytes } from 'viem'
// import { Countdown } from '@/app/(components)/Countdown'
import dynamic from 'next/dynamic'
import { config } from '@/app/config/config'

const Countdown = dynamic(
  () => import("./(components)/Countdown"),
  { ssr: false }
)

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

export default function Home () {
  const { data, error, isLoading } = useSWR('/today', fetcher)
  const { writeContract } = useWriteContract()
  const { address, isConnecting, isDisconnected } = useAccount()
  // const [ state, setState ] = useState<{id: number; win: boolean}[]>(
  //   [],
  // )
  //
  // useEffect(() => {
  //   if(data && data.data.length > 0) {
  //     setState(data.data.map(v => {
  //       return {
  //         id: v.id,
  //         win: undefined
  //       }
  //     }))
  //   }
  // }, [data])
  //
  // const check = (id: number) => {
  //   if (state && state.length > 0) {
  //     return state.find(v => v.id === id).win
  //   }
  // }
  //
  // const set = (id:number, win: boolean) => {
  //
  // }
  const [ id, setId ] = useState<number[]>([])
  const [ win, setWin ] = useState<boolean[]>([])

  const check = (checkId: number) => {
    const index = id.indexOf(checkId)
    if(index !== -1) return win[index]
    else return undefined
  }

  const add = (addId: number, addWin: boolean) => {
    console.log(addId, addWin)
    const index = id.indexOf(addId)
    if(index !== -1) {
      win[index] = addWin
      setWin(win.slice())
    } else {
      setId([...id, addId])
      setWin([...win, addWin])
    }
  }

  const submit = () => {
    console.log(id, win, address)
    // if(address) {
      writeContract({
        abi,
        address: config.address as `0x${string}`,
        functionName: 'sendPacket',
        args: [
          bytesToHex(stringToBytes(config.channel), { size: 32 }),
          36000,
          address,
          id,
          win
        ]
      }, {
        onError: (error) => console.log(error)
      })
    // }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4">
      <Countdown time={config.endTime} />
      {
        data
        ? <>
            {data.data.map((v: any) => (<div key={v.id}>
              <ButtonGroup>
                {/*{`${check(v.id)}`}*/}
                <Button onClick={() => add(v.id, true)} color="primary" variant={check(v.id) === undefined ? "ghost" : (check(v.id) ? "solid" : "ghost")} className={"w-44 h-16"}>{v.home_team.full_name}</Button>
                <Button onClick={() => add(v.id, false)} color="primary" variant={check(v.id) === undefined ? "ghost" : (check(v.id) ? "ghost" : "solid")} className={"w-44 h-16"}>{v.visitor_team.full_name}</Button>
              </ButtonGroup>
            </div>))}
            <Button onClick={() => submit()} color="primary" className={"mt-3"} disabled={Math.floor(Date.now() / 1000) > config.endTime}>
              Submit
            </Button>
          </>
        : <CircularProgress size="lg" aria-label="Loading..."/>
      }
    </main>
  );
}
