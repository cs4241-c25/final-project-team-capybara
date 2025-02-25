import {
    Typography,
    Card,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    HomeIcon,
    TableCellsIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

function Sidebar() {
    return (
        <Card className="left-0 top-0 absolute fixed h-[100%] w-full max-w-[15rem] p-4 rounded-none shadow-xl shadow-gray-900/5">
            <List className="mt-20">
                <a href="/main">
                    <ListItem>
                        <ListItemPrefix>
                            <HomeIcon className="h-5 w-5"></HomeIcon>
                        </ListItemPrefix>
                        Home
                    </ListItem>
                </a>
                <a href="/tracker">
                    <ListItem>
                        <ListItemPrefix>
                            <TableCellsIcon className="h-5 w-5"></TableCellsIcon>
                        </ListItemPrefix>
                        Tracker
                    </ListItem>
                </a>
                <a href="/tutorial">
                    <ListItem>
                        <ListItemPrefix>
                            <QuestionMarkCircleIcon className="h-5 w-5"></QuestionMarkCircleIcon>
                        </ListItemPrefix>
                        Tutorial
                    </ListItem>
                </a>
            </List>
        </Card>
    )
}

export default Sidebar;