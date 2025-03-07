import React, {useEffect} from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
    Typography,
    Card,
    CardBody,
    Stepper,
    Step,
    Button,
} from "@material-tailwind/react";

function Tutorial () {
    const [activeStep, setActiveStep] = React.useState(0);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);
 
    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <section id="tutorial" className="min-h-screen bg-dark-gray flex flex-col items-center">
            <Card className="my-6 w-[70%]">
                <CardBody className="flex flex-col p-8 gap-2">
                    <Typography variant="h2" className="text-wpi-red font-body font-normal">Tutorial</Typography><br />
                    <hr className="mt-[-20px] mb-6"></hr>
                    
                    <TutStep step={activeStep}></TutStep>
                    
                    <Stepper
                        activeStep={activeStep}
                        isLastStep={(value) => setIsLastStep(value)}
                        isFirstStep={(value) => setIsFirstStep(value)}
                        className="w-[80%] self-center"
                    >
                        <Step onClick={() => setActiveStep(0)}>
                            1
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography
                                    variant="h6"
                                    className={activeStep === 0 ? "text-dark-gray" : "text-gray-500"}
                                >
                                    Step 1
                                </Typography>
                            </div>
                        </Step>
                        <Step onClick={() => setActiveStep(0)}>
                            2
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography
                                    variant="h6"
                                    className={activeStep === 1 ? "text-dark-gray" : "text-gray-500"}
                                >
                                    Step 2
                                </Typography>
                            </div>
                        </Step>
                        <Step onClick={() => setActiveStep(0)}>
                            3
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography
                                    variant="h6"
                                    className={activeStep === 2 ? "text-dark-gray" : "text-gray-500"}
                                >
                                    Step 3
                                </Typography>
                            </div>
                        </Step>
                        <Step onClick={() => setActiveStep(0)}>
                            4
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography
                                    variant="h6"
                                    className={activeStep === 3 ? "text-dark-gray" : "text-gray-500"}
                                >
                                    Step 4
                                </Typography>
                            </div>
                        </Step>
                    </Stepper>
                    <div className="mt-30 flex justify-between self-center w-[90%]">
                        <Button onClick={handlePrev} disabled={isFirstStep} className="font-body">
                            Prev
                        </Button>
                        <Button onClick={handleNext} disabled={isLastStep} className="font-body">
                            Next
                        </Button>
                    </div>
                    
                </CardBody>
            </Card>
        </section>
    )
}

function TutStep(props) {
    switch(props.step) {
        case 0:
            return (
                <>
                    <Typography className="font-body">Open Workday and click on <em>Academics</em> in the sidebar on the right.</Typography>
                    <img src="/tutorial/t1.png" className="max-h-[20rem] self-center"></img><br />
                </>
            );
        case 1:
            return (
                <>
                    <Typography className="font-body">Next, click on <em>View My Academic Record</em> in the sidebar on the right.</Typography>
                    <img src="/tutorial/t2.png" className="max-h-[20rem] self-center"></img><br />
                </>
            );
        case 2:
            return (
                <>
                    <Typography className="font-body">Click on the <em>Export to Excel</em> button in the top right corner.</Typography>
                    <img src="/tutorial/t3.png" className="max-h-[20rem] self-center"></img><br />
                </>
            );
        case 3:
            return (
                <>
                    <Typography className="font-body">A modal will appear prompting you to export the document. Click <em>Download</em>.</Typography>
                    <img src="/tutorial/t4.png" className="h-[16rem] self-center"></img><br />

                    <Typography className="font-body">The excel file should download to your computer shortly. Now you can upload it here!</Typography><br></br>
                </>
            );
        default:
            return (
                <></>
            );
    }
}

export default Tutorial;