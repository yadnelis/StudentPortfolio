import type { FC } from "react";
import { AddStudentButton } from "./AddStudentButton";
import { SearchInput } from "./SearchInput";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={` h-full grid grid-rows-[min-content_minmax(0,1fr)]`}>
      {children}
    </div>
  );
};

const LayoutPortals = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const Header: FC = () => {
  return (
    <header className=" bg-lime-800 flex justify-center items-center h-13 relative">
      <AddStudentButton className="absolute left-5 top-6" />
      <SearchInput />
    </header>
  );
};

Layout.Portals = LayoutPortals;
Layout.Header = Header;
