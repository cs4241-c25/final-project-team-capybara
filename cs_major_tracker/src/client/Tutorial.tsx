import React, {useEffect} from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
    Typography,
    Card,
    CardBody
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";

function Tutorial () {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authenticated");
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
    }, [navigate]);

    return (
        <>
            <Header></Header>
            
            <main className="min-h-screen bg-[#AC2B37] flex flex-col items-center">
                <Typography variant="h1" className="text-center content-center py-6 mt-20 text-white">Tutorial</Typography><br />
                <img src="/src/client/assets/tutorial/tutorial.gif" className="max-w-[60%]" /><br />

                <Card className="my-6 w-[60%]">
                    <CardBody className="flex flex-col p-8 gap-2">
                        <Typography variant="h2" className="text-[#AC2B37]">Step By Step</Typography><br />
                        <hr className="mt-[-20px] mb-6"></hr>
                        <Typography>1. Open Workday and click on <em>Academics</em> in the sidebar on the right.</Typography>
                        <img src="/src/client/assets/tutorial/t1.png" className="max-w-[60%] self-center"></img><br />

                        <Typography>2. Next, click on <em>View My Academic Record</em> in the sidebar on the right.</Typography>
                        <img src="/src/client/assets/tutorial/t2.png" className="max-w-[60%] self-center"></img><br />

                        <Typography>3. Click on the <em>Export to Excel</em> button in the top right corner.</Typography>
                        <img src="/src/client/assets/tutorial/t3.png" className="max-w-[70%] self-center"></img><br />

                        <Typography>4. A modal will appear prompting you to export the document. Click <em>Download</em>.</Typography>
                        <img src="/src/client/assets/tutorial/t4.png" className="max-w-[50%] self-center"></img><br />

                        <Typography>The excel file should download to your computer shortly.</Typography>
                    </CardBody>
                </Card>
                <Sidebar></Sidebar>
            </main>
            
            <aside><Sidebar></Sidebar></aside>
        </>
    )
}

export default Tutorial;