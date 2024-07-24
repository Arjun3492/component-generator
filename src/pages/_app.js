import { ComponentProvider } from "@/context/componentContext";
import { ProjectProvider } from "@/context/projectContext";
import { ValueProvider } from "@/context/valueContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  return <ProjectProvider>
    <ValueProvider>
      <ComponentProvider>
        <Component {...pageProps} />
      </ComponentProvider>
    </ValueProvider>
  </ProjectProvider>;
}
