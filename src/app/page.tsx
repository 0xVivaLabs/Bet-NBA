'use client'

import { Button, ButtonGroup, CircularProgress } from '@nextui-org/react'
import useSWR from 'swr'
import { useState } from 'react'
import { undefined } from 'zod'
import { useAccount, useWriteContract } from 'wagmi'
import { abi } from '@/utils'
import { bytesToHex, stringToBytes } from 'viem'

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
        address: '0x3Da40011E7679973FaA6CAeF0c9f6AB0468fc59a',
        functionName: 'sendPacket',
        args: [
          bytesToHex(stringToBytes('channel-37564'), { size: 32 }),
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        data
        ? <>
            {data.data.map((v: any) => (<div key={v.id}>
              <ButtonGroup>
                {/*{`${check(v.id)}`}*/}
                <Button onClick={() => add(v.id, true)} color="primary" variant={check(v.id) === undefined ? "ghost" : (check(v.id) ? "solid" : "ghost")} className={"w-40 h-16"}>{v.home_team.full_name}</Button>
                <Button onClick={() => add(v.id, false)} color="primary" variant={check(v.id) === undefined ? "ghost" : (check(v.id) ? "ghost" : "solid")} className={"w-40 h-16"}>{v.visitor_team.full_name}</Button>
              </ButtonGroup>
            </div>))}
            <Button onClick={() => submit()} color="primary" className={"mt-3"}>
              Submit
            </Button>
          </>
        : <CircularProgress size="lg" aria-label="Loading..."/>
      }
    </main>
  );
}
