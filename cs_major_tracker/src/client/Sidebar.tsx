//import React, { useState } from "react";
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
        <Card id="sidebar" className="left-0 top-0 absolute fixed h-[100%] w-0 max-w-[15rem] p-4 rounded-none shadow-xl shadow-gray-900/5 duration-[0.5s] invisible">
            <List>
                <span id="closebtn" className="flex justify-end mr-8 duration-[0.3s]" onClick={closeNav}>
                    <XMarkIcon className="h-5 w-5"></XMarkIcon>
                </span>
                {pages.map((page) => (
                    <a href={page.route}>
                        <ListItem className="sidebarItem hover:bg-black hover:text-white w-full max-w-[13rem] duration-[0.3s]">
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

function closeNav() {
    [...document.querySelectorAll(".sidebarItem")].forEach((item, y) => item.style.visibility = "hidden");
    document.getElementById("closebtn").style.visibility = "hidden";
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("sidebar").style.visibility = "hidden";
}

export default Sidebar;