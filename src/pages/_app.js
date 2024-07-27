import { ProjectProvider } from "@/context/projectContext";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  return (<SessionProvider session={pageProps.session}>
    <ProjectProvider>
      <Component {...pageProps} />
    </ProjectProvider>
  </SessionProvider >)
}
