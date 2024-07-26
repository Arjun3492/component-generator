import { ComponentProvider } from "@/context/componentContext";
import { ProjectProvider } from "@/context/projectContext";
import { ValueProvider } from "@/context/valueContext";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  return (<SessionProvider session={pageProps.session}>
    <ProjectProvider>
      <ValueProvider>
        <ComponentProvider>
          <Component {...pageProps} />
        </ComponentProvider>
      </ValueProvider>
    </ProjectProvider>
  </SessionProvider >)
}
