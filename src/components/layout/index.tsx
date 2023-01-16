import { ReactNode } from "react";
import styles from "./styles/login.module.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-rose-400">
      <div className="m-auto grid h-3/4 w-3/5 rounded-md bg-slate-50 lg:grid-cols-2">
        <div className={styles.imgStyle}>
          <div className={styles.backgroundImg}></div>
        </div>
        <div className="right flex flex-col justify-center">
          <div className="py-10 text-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
