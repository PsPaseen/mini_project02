import { Box, Button, Paper, Typography } from "@mui/material"
import dayjs from "dayjs";
import { useCallback, useState } from "react"
import * as XLSX from 'xlsx';
import { ExportExcel } from "../hooks/ExportExcel";

export type dataType_1 = {
    carid: string,
    typecarid: string,
    totalexpense: string,
    shipamount: string,
    Enddate: string,
}

export type dataType_2 = {
    Carid: string,
    typecarid: string,
    shipamount: string,
    Enddate: string,
}

export const ButtonPage = () => {
    const [data , setData] = useState<dataType_1[]>()
    const [dataOther , setDataOther] = useState<dataType_2[]>()

    const [fileName , setFileName] = useState<string>("")
    const [fileNameOther , setFileNameOther] = useState<string>("")

    const onRemoveFile = useCallback((name: string) =>{
        if(name == fileName){
            setFileName('')
            setData(undefined)
        }else if(name == fileNameOther){
            setFileNameOther('')
            setDataOther(undefined)
        }
    },[fileName ,fileNameOther ])

    const calDay = useCallback((Date: string) => {

        const Year = parseInt(dayjs(Date).format('YYYY'))
        const Month = parseInt(dayjs(Date).format('MM'))

        if(Month === 2 && Year % 4 !== 0){
            return 28
        }else if(Month === 2 && Year % 4 === 0){
            return 29
        }else if(Month % 2 == 0){
            return 30
        }else if(Month % 2 == 1){
            return 31
        }
    },[])



    const onProcessExcel = useCallback((workbook: XLSX.WorkBook , type : '1' | '2' ) => { // '1' | '2' เป็น Type Union ใน TypeScript ซึ่งใช้เพื่อกำหนดว่า test สามารถรับค่าได้แค่ '1' หรือ '2' เท่านั้นในระดับ Type Checking
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        if(type == '1'){
            const jsonData: dataType_1[] = XLSX.utils.sheet_to_json(worksheet, {raw: false}) //เอา header: 1 ออกจะทำให้ json เรียงเป็น object ในโครงสร้าง array และปรับ raw เป็น false จะทำให้ไฟล์ถูกจัดเรียงให้อัตโนมัติ 'วันที่ไม่บัค' และถ้าเรารู้ type ที่แน่นอนของ Data จะกำหนด type เลยก็ได้
            const tempData = jsonData.map((item) => {return {...item}})
            setData(tempData)
        }else if(type == '2'){
            const jsonData: dataType_2[] = XLSX.utils.sheet_to_json(worksheet, {raw: false})
            const tempData = jsonData.map((item) => {return {...item}})
            setDataOther(tempData)
        }
    },[])

    const onUploadExcel = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] //ถึงจะมีไฟล์เดียวแต่โครงสร้างเก็บไฟล์เป็นแบบ Object ที่มีโครงสร้างแบบ Array เลยต้องใช้แบบนี้
        console.log(file)
        if(file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                try {
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    setFileName(file.name)
                    onProcessExcel(workbook , '1');
                } catch (error) {
                    console.error("Error reading file:", error);
                } finally {
                    event.target.value = '' //reset ตัวรับค่า file
                }
            }
            reader.readAsArrayBuffer(file); //ทำงานแบบ asyncronus หรือ ไม่หยุดรอ ทำให้มารันตรงนี้แล้วเกิด reader.onload
        }
    },[onProcessExcel])

    const onUploadExcel_Other = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] //ถึงจะมีไฟล์เดียวแต่โครงสร้างเก็บไฟล์เป็นแบบ Object ที่มีโครงสร้างแบบ Array เลยต้องใช้แบบนี้

        if(file) {
            const reader = new FileReader()

            reader.onload = (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                try {
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    setFileNameOther(file.name)
                    onProcessExcel(workbook , '2');
                } catch (error) {
                    console.error("Error reading file:", error);
                } finally {
                    event.target.value = ''
                }
            }
            reader.readAsArrayBuffer(file); //ทำงานแบบ asyncronus หรือ ไม่หยุดรอ ทำให้มารันตรงนี้แล้วเกิด reader.onload
        }
    },[onProcessExcel])

    const onClick5 = useCallback(() => {
        if(data) {
            const maxDate = calDay(data[0].Enddate)
            
            // const mergeData = data?.map((itemData) => {
            //     const sumAmount = dataOther?.filter((itemOther) => ((itemData.carid === itemOther.Carid) && (itemData.Enddate === itemOther.Enddate))).reduce((sum:number, value: dataType_2) => {sum += parseFloat(value.shipamount); return sum},0 ) ?? 0
            //     return { ...itemData, shipamount: (parseFloat(itemData.shipamount) +sumAmount).toFixed(2)}})

            const tempData = data.map((item) => {return {...item}})

            dataOther?.forEach((item) => {
                const sameId = tempData.find((tempItem) => ((tempItem.carid === item.Carid) && (tempItem.Enddate === item.Enddate) )) //เลือกตัวที่มีค่า ทะเบียน และ วันเหมือนกัน
                const shipAmount = parseFloat(item.shipamount)

                if(sameId) { 
                    sameId.shipamount = (parseFloat(sameId.shipamount) + shipAmount).toFixed(2) //และเราสามารถแก้ไขตรงนี้ได้เลย
                } else {
                    tempData.push({carid:item.Carid, typecarid: item.typecarid, totalexpense: '0', shipamount: item.shipamount, Enddate: item.Enddate  })
                }
            })

            tempData.sort((date1 , date2) => (new Date(date1.Enddate).getDate() - new Date(date2.Enddate).getDate())) //เรียงข้อมูลจากวันน้อยไปมาก โดยต้องแปลง Date เป็น numberถึงจะใช้งานได้
                ExportExcel({mergeData:tempData , data:data , data_other: dataOther ?? [], maxDate: maxDate ?? 0})
        }
        
    },[calDay, data, dataOther])

    const onClick20 = useCallback(() => {
        if(data){
            const maxDate = 15

            const tempData = data.map((item) => {return {...item}})

            dataOther?.forEach((item) => {
                const sameId = tempData.find((tempItem) => ((tempItem.carid === item.Carid) && (tempItem.Enddate === item.Enddate) )) //เลือกตัวที่มีค่า ทะเบียน และ วันเหมือนกัน
                const shipAmount = parseFloat(item.shipamount)

                if(sameId) { 
                    sameId.shipamount = (parseFloat(sameId.shipamount) + shipAmount).toFixed(2) //และเราสามารถแก้ไขตรงนี้ได้เลย
                } else {
                    tempData.push({carid:item.Carid, typecarid: item.typecarid, totalexpense: '0', shipamount: item.shipamount, Enddate: item.Enddate  })
                }
            })

            tempData.sort((date1 , date2) => (new Date(date1.Enddate).getDate() - new Date(date2.Enddate).getDate())) //เรียงข้อมูลจากวันน้อยไปมาก โดยต้องแปลง Date เป็น numberถึงจะใช้งานได้
    
                ExportExcel({mergeData:tempData , data:data , data_other: dataOther ?? [], maxDate: maxDate ?? 0})
        }
        
    },[data,dataOther])

    return <>
        <Paper elevation={1} sx={{padding: 3, width:'400px' }}>
            <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ textAlign: 'center'}}> 

                <Typography sx={{color: '#000' , fontWeight:'Bold' , fontSize:'24px'}}>Export Data to Excel (fixed data)</Typography>
                <Typography sx={{color: '#000'}}>อัพโหลดข้อมูลไฟล์</Typography>

                <Box display={'flex'} flexDirection={'row'} gap={2} sx={{justifyContent:'center' , height:'60.5px'}}>
                    <Box display={'flex'} flexDirection={'column'} gap={'6px'}>
                        <Button variant="contained" component="label" sx={{maxHeight:'36.5px'}}> Upload ไฟล์หลัก <input type="file" onChange={onUploadExcel} hidden/></Button>
                        <Typography fontSize={'12px'} onClick={() => onRemoveFile(fileName)}>{fileName}</Typography>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={'6px'}>
                        <Button variant="contained" component="label" sx={{maxHeight:'36.5px'}}> Upload ไฟล์เสริม <input type="file" onChange={onUploadExcel_Other} hidden/></Button>
                        {/* <Typography fontSize={'12px'} onClick={onRemoveFile}>{fileNameOther}</Typography> เขียนท่านี้ไม่ได้ 555*/} 
                        <Typography fontSize={'12px'} onClick={() => onRemoveFile(fileNameOther)}>{fileNameOther}</Typography>
                    </Box>
                </Box>

                <Typography sx={{color: '#000'}}>เลือกวันที่ต้องการข้อมูล</Typography>

                <Box display={'flex'} flexDirection={'row'} gap={2} sx={{justifyContent:'center'}}>
                        <Button onClick={onClick5} variant={"contained"} color={'info'} disabled={data ? false : true}>
                            วันที่ 5
                        </Button>
                        <Button onClick={onClick20} variant={"contained"} color={'info'} disabled={data? false : true}>
                            วันที่ 20
                        </Button>
                </Box>
            </Box>
        </Paper>

    </>
}