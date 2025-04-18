import { Outlet } from "react-router"
import { Topbar } from "../layouts/Topbar"
import { Box } from "@mui/material"

export const Layout = () => {
    return (
        <Box sx={{display:'flex', flexDirection:'column' , gap: 2}}>
            {/* Topbar อยู่ตลอด Outlet เอาตัวPage ลูกมาใส่จาก Route */}
            <Topbar />

            <Box sx={{justifyItems:'center'}}>
                <Outlet />
            </Box>
        </Box>
    )
}