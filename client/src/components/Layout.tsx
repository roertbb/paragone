import React from "react";
import Nav from "./Nav";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Nav />
      {children}
    </>
  );
};

export default Layout;
