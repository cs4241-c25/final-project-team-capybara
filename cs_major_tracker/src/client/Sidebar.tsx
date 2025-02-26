import React, { useState } from "react";
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
    XMarkIcon,
} from "@heroicons/react/24/solid";

const pages = [
    {label: 'Home', route: '/main', icon: (<HomeIcon className="h-5 w-5"></HomeIcon>)},
    {label: 'Tracker', route: '/tracker', icon: (<TableCellsIcon className="h-5 w-5"></TableCellsIcon>)},
    {label: 'Tutorial', route: '/tutorial', icon: (<QuestionMarkCircleIcon className="h-5 w-5"></QuestionMarkCircleIcon>)}
];

//interface SidebarProps {
//    isOpen: boolean;
//    onClose: () => void;
//}

function Sidebar() {
//const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    return (
        <Card className="left-0 top-0 absolute fixed h-[100%] w-full max-w-[15rem] p-4 rounded-none shadow-xl shadow-gray-900/5">
            <List className="mt-20">
                <a href="javascript:void(0)" className="closebtn flex justify-end mr-8" onclick="closeNav()">
                    <XMarkIcon className="h-5 w-5"></XMarkIcon>
                </a>
                {pages.map((page) => (
                    <a href={page.route}>
                        <ListItem className="hover:bg-black hover:text-white w-full max-w-[13rem]">
                            <ListItemPrefix>
                                {page.icon}
                            </ListItemPrefix>
                            {page.label}
                        </ListItem>
                    </a>
                ))}
            </List>
        </Card>
    )
}

export default Sidebar;