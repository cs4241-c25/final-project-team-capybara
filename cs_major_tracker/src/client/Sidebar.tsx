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
    ChatBubbleOvalLeftEllipsisIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

const pages = [
    {label: 'Home', route: '/main', icon: (<HomeIcon className="h-5 w-5"></HomeIcon>)},
    {label: 'Tracker', route: '/tracker', icon: (<TableCellsIcon className="h-5 w-5"></TableCellsIcon>)},
    {label: 'Tutorial', route: '/main#tutorial', icon: (<QuestionMarkCircleIcon className="h-5 w-5"></QuestionMarkCircleIcon>)},
    {label: 'FAQ', route: '/faq', icon: (<ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5"></ChatBubbleOvalLeftEllipsisIcon>)}
];

//interface SidebarProps {
//    isOpen: boolean;
//    onClose: () => void;
//}

function Sidebar() {
//const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
    return (
        <Card id="sidebar" className="bg-dark-gray left-0 top-0 absolute fixed h-[100%] w-0 max-w-[15rem] p-4 rounded-none shadow-xl shadow-gray-900/5 duration-[0.5s] invisible">
            <List>
                <span key="-1" id="closebtn" className="cursor-pointer flex hover:bg-black ml-auto p-1 mr-8 duration-[0.3s]" onClick={closeNav}>
                    <XMarkIcon key="icon" className="h-5 w-5 fill-white"></XMarkIcon>
                </span>
                {pages.map((page, index) => (
                    <a key={index} href={page.route}>
                        <ListItem key={index} className="sidebarItem text-white hover:bg-black hover:text-white w-full max-w-[13rem] duration-[0.3s]">
                            <ListItemPrefix key={index}>
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