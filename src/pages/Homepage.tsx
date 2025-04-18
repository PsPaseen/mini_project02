import { Fade, Grow, Typography } from "@mui/material"
import { Box } from "@mui/system"
import image from '../assets/images/E9573.jpg'


export const Homepage = () => {

    return (

        <Box sx={{display:'flex' , flexDirection:'row'}} gap={14} >

            <Box sx={{display:'flex' , flexDirection:'column', justifyContent:'center'}}>
                <Grow in={true}>
                    <Typography variant="h3">This is Paseen Homepage,</Typography>
                </Grow>
                <Fade in={true} style={{transitionDelay: '500ms'}}>
                    <Typography variant="h4">ยินดีต้อนรับครับผม.</Typography>
                </Fade>
            </Box>

            <img src={image}></img>

        </Box>
        
    )

}