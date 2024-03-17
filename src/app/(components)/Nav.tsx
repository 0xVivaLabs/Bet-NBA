import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

export function Nav() {
  return (
    <Navbar className={"bg-black/70"}>
    <NavbarBrand>
      <p className="font-bold text-inherit">Bet NBA</p>
    </NavbarBrand>
    <NavbarContent justify="end">
      <NavbarItem>
        <Button color="primary" href="#" variant="flat">
          Login
        </Button>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
  )
}
