import React from "react";
import { WrapperVariant, Wrapper } from "./Wrapper";
import { NavBar } from "./NavBar";

interface LayoutProps {
  variant: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ variant, children }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
