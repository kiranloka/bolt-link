import {
  Navbar,
  NavBody,
  NavbarButton,
  NavbarLogo,
  NavItems,
} from "@/components/ui/resizable-navbar";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/features" },
    { name: "Pricing", link: "/pricing" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div>
      <Navbar className="top-0">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton href="/login">Login</NavbarButton>
        </NavBody>
      </Navbar>
      <div className="text-white text-2xl">hello this is kiran </div>
    </div>
  );
}
