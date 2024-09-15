import MobileNav from "./MobileNav";
import RefreshButton from "./RefreshButton";
import ThemeSwitch from "./ThemeSwitch";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <nav className="flex h-[60px] items-center justify-end border-b border-slate-200 pl-4 pr-6 dark:border-zinc-900">
      <div className="flex items-center gap-4">
        <RefreshButton />
        <ThemeSwitch />
        <UserMenu />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
