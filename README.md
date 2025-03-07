# CS Major Tracker - Team Capybara
Project: https://final-project-team-capybara.onrender.com/

Video: https://www.youtube.com/watch?v=1XyqxNSywzM

## Description
Our website is a course tracker that allows CS majors to upload their course history and see what requirements they have met
    for their major. The website sorts the user's courses by requirement, while also specifying whether sub-requirements
    (i.e. CS Systems requirement) were met. Users can see what percentage of their graduation requirements they have met.
    These features require logic to parse an excel file and sort the data into different categories within the database.
    
Additionally, our website allows users to register accounts, add and delete custom courses through manual input, download
    a PDF of the CS tracking sheet with their courses filled in, and chat with AI advisor.
    
## Additional Information
When Render is loading back up the project, it sometimes fails to load the web page the first time. If this happens, please refresh the page.

## Technologies
- **React:** We used React as our web framework, making use of components, hooks, states, and props to create dynamic behavior.
  - For example, we used hooks to redirect the user to the login page if they were not authenticated. Furthermore, React made
    it easy to create the tutorial stepper, as we could maintain the current step as a state and pass it as a prop to each
    step of the tutorial in order to decide which step to show.
  - We used **react-router-dom** for routing.
  - We used **react-dropzone** for the file upload drag-and-drop functionality.
- **Node.js & Express:** We used Express as our web server to handle requests and session middleware.
  - The **express-session** module allowed us to maintain the user's login session.
- **PDF-lib:** We used pdf-lib to write the user's courses to the CS major tracking sheet PDF file.
- **Typescript:** Typescript is the programming language we used to implement dynamic behavior and for server-side programming.
- **Material Tailwind:** We used Material Tailwind as our frontend framework. This provided us a set of easily-customizable
  components as a foundation for our UI. We configured Tailwind in order to define custom colors and fonts.
  - We used **heroicons** for UI icons.
- **MongoDB:** We used MongoDB for our database.
- **Auth0:** Auth0 was our authentication method.
- **Render:** We used Render to deploy our website.

## Challenges

- **Deployment:**
Deployment was initially challenging because every service we tried to use did not work with our setup at first. However,
 Render eventually started working after waiting a long period of time before trying again.
 
- **Sorting and Filtering:**
Sorting and filtering the user's courses was also a challenge, since there are a lot of complex specifications involved in major
  degree requirements.

- **Manual Course Input:**
Manual course input is another challenge because we needed to modify the backend structure to distinguish different types of courses and store them in the appropriate database. Since our database structure was predetermined and finalized at the beginning, any kind of future refactoring and updates would be challenging.

- **AI Advisor Prompt Enginnering:**
We used OpenAI GPT-4o-mini for the AI advisor because it is the most budget-friendly solution. However, this choice also resulted in lower performance, particularly when checking for missing requirements and answering questions about WPI courses or requirements. Some responses could be outdated or inaccurate. To improve accuracy, we included user course data as part of the prompt and implemented a specialized algorithm to help the AI identify missing requirements for CS majors. Additionally, we made the system dynamic, allowing user-added courses to update the AI in real time.

## Contributions
- Huy Ho:
  - File upload
  - Parsing excel file
  - Sorting & filtering courses
  - Router
  - Filtering out incorrect excel files
  - Writing to PDF
- Cierra O'Grady:
  - Tutorial
  - Sidebar
  - General styling (main page, tables, header, sidebar, fonts)
  - Deployment
- Alexander Stoyanov:
  - Manual input
  - FAQ page
  - Jira
- Lianrui Sun (Darcy):
  - Login, Registration & Authentication
  - Router
  - AddCourse panel
  - Add wpi_courses.cvs data
  - Delete button for added course
  - Refactor backend code
  - Handling duplicate courses
  - Handling NR courses
  - AI Chatbot
  - Prompt Engineering
