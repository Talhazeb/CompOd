import React from "react";

import Sidebar from "../components/Sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";

export default function Dashboard() {
    return (
        <div>
            <ProSidebarProvider>
                <Sidebar />
            </ProSidebarProvider>
        </div>
    );
}
