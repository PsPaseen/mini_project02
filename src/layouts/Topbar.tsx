import { Avatar, Box, Button, Typography } from "@mui/material"

import  imagePaseen  from "../assets/images/E9573.jpg"
import dayjs from "dayjs"
import { useNavigate } from "react-router"

export const Topbar = () => {
    const nav = useNavigate()
    const day = dayjs().format('YYYY/MM/DD')
    return <>
    <Box display={'flex'} flexDirection={'row'} gap={2} sx={{height: '70px' , justifyContent:'space-between'}} >
        <Box display={'flex'} flexDirection={'row'} sx={{alignItems:'center', paddingLeft :2}}>
            <Box sx={{ display: 'flex', flexDirection: 'row' , alignItems:'center'}} onClick={() => {nav('/')}}>
                <Avatar alt="Paseen Sangarung" src={imagePaseen} />
                <Typography variant={"h5"} sx={{color:"black" , paddingLeft: 1 ,fontWeight:'Bold'}}>Paseen_<span style={{fontWeight:'normal'}}>Dev</span></Typography>
            </Box>

            <Box display={'flex'} flexDirection={'row'} gap={4} sx={{paddingLeft: 10}}>
                <Button variant="text" color="info" sx={{fontWeight:'Bold'}} onClick={() => {nav('/excel')}}>Process Excel</Button>
                <Button variant="text" color="info" sx={{fontWeight:'Bold'}} onClick={() => {nav('/table')}}>Database Table</Button>
                <Button variant="text" color="info" sx={{fontWeight:'Bold'}}>Test Text</Button>
            </Box>
        </Box>


        <Box display={'flex'} flexDirection={'row'} sx={{alignItems:'center', paddingRight: 2}}>
            <Typography sx={{fontWeight:'Bold'}}>{day}</Typography>
        </Box>
    </Box>
    </>
}