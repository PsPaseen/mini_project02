import { Avatar, Box, Typography } from "@mui/material"

import  imagePaseen  from "../assets/images/E9573.jpg"
import dayjs from "dayjs"
import { useNavigate } from "react-router"

export const Topbar = () => {
    const nav = useNavigate()
    const day = dayjs().format('YYYY/MM/DD')
    return <>
    <Box display={'flex'} flexDirection={'row'} gap={2} sx={{backgroundColor: '#fff' , height: '70px' , justifyContent:'space-between'}}>
        <Box display={'flex'} flexDirection={'row'} sx={{alignItems:'center', paddingLeft :2}}>
            <Avatar alt="Paseen Sangarung" src={imagePaseen} onClick={() => {nav('/')}} />
            <Typography variant={"h5"} sx={{color:"black" , paddingLeft: 2 ,fontWeight:'Bold'}}>Paseen_<span style={{fontWeight:'normal'}}>Dev</span></Typography>

            <Box display={'flex'} flexDirection={'row'} gap={4} sx={{paddingLeft: 10}}>
                <Typography sx={{fontWeight:'Bold'}} onClick={() => {nav('/excel')}}>Process Excel</Typography>
                <Typography sx={{fontWeight:'Bold'}} onClick={() => {nav('/table')}}>Database Table</Typography>
                <Typography sx={{fontWeight:'Bold'}}>Test Typography</Typography>
            </Box>
        </Box>


        <Box display={'flex'} flexDirection={'row'} sx={{alignItems:'center', paddingRight: 2}}>
            <Typography sx={{fontWeight:'Bold'}}>{day}</Typography>
        </Box>
    </Box>
    </>
}