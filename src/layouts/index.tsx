import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import st from "./styles.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession();

  return (
    <div className={st.container}>
      <div className={st.content}>{children}</div>
    </div>
  );
};

export default Layout;
