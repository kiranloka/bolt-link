import {
  Navbar,
  NavBody,
  NavbarButton,
  NavbarLogo,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { GridBackgroundDemo } from "@/components/ui/grid-background";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { products } from "@/lib/constant";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/features" },
    { name: "Pricing", link: "/pricing" },
    { name: "Contact", link: "/contact" },
  ];
  const features = [
    {
      Icon: FileTextIcon,
      name: "Automate Tasks Easily",
      description:
        "Connect your apps and automate repetitive tasks with just a few clicks.",
      href: "/",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "Drag & Drop Builder",
      description:
        "Design automation workflows without writing a single line of code.",
      href: "/",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      ),

      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Third-party Integrations",
      description:
        "Supports popular services like Slack, Notion, Google, Discord, and more.",
      href: "/",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Scheduled Triggers",
      description:
        "Set up workflows to run automatically at specific times or intervals.",
      href: "/",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Real-time Alerts",
      description: "Get instant notifications when your workflows run or fail.",
      href: "/",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <div>
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton href="/login">Login</NavbarButton>
        </NavBody>
      </Navbar>
      <div className="flex flex-col items-center justify-center text-white h-screen">
        <GridBackgroundDemo />
      </div>
      <div className="w-[70%] mx-auto px-10">
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>

      <HeroParallax products={products} />
    </div>
  );
}
