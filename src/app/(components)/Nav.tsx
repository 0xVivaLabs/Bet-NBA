'use client'

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { truncation } from '@/utils'

export function Nav() {
  const { open } = useWeb3Modal()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <Navbar className={"bg-black/70"}>
    <NavbarBrand>
      <p className="font-bold text-inherit">Bet NBA</p>
    </NavbarBrand>
    <NavbarContent justify="end">
      <NavbarItem>
        <Button onClick={() => address ? disconnect() : open()} color="primary" href="#" variant="flat">
          {address ? truncation(address) : 'Login'}
        </Button>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
  )
}
