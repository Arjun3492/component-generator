import { useState } from "react";
import { tabs } from "@/utils/constants";
import ValuesTab from "@/components/valuesTab";
import ComponentsTab from "@/components/componentsTab";
import { useProject } from "@/context/projectContext";
import Header from "@/components/header";
import { getServerSession } from "next-auth";

const Page = () => {
  const [selectedTab, setSelectedTab] = useState(tabs.values);
  const { projects, projectData } = useProject();


  return (

    <>
      <Header />
      <div className="min-h-screen bg-gray-100 text-black">
        {projects.length > 0 &&
          <main className="container mx-auto px-6 py-8">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedTab(tabs.values)}
                className={`px-4 py-2 rounded-md ${selectedTab === tabs.values
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
                  }`}
              >
                Values
              </button>
              <button
                disabled={!projectData}

                onClick={() => setSelectedTab(tabs.components)}
                className={`px-4 py-2 rounded-md ${selectedTab === tabs.components
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
                  }`}
              >
                Components
              </button>
            </div>
            <div className="p-4 bg-white rounded-md shadow">
              {selectedTab === tabs.values && <ValuesTab />}
              {selectedTab === tabs.components && <ComponentsTab />}
            </div>
          </main>
        }
      </div>
    </>

  );
};

export default Page;

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

