import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios from "axios"
import { useCallback, useState } from "react"

export type TableDataType = {
    idno : number ,
    name_surname : string ,
    class : string ,
    status_user : boolean ,
    create_date : string,
    update_date : string,
}

export const TablePage = () => {
    const [data , setData] = useState<TableDataType[]>()

    const onClickDelete = useCallback(() => {
        
    },[])

    const columnData = (data?: TableDataType) => (
        [
        {field: 'idno' ,headerName: 'Id', align: 'center'},
        {field: 'name_surname' ,headerName: 'Name'},
        {field: 'class' ,headerName: 'Class'},
        {field: 'status_user' ,headerName: 'Status'},
        {field: 'create_date' ,headerName: 'Create Date' , align: 'center'},
        {field: 'update_date' ,headerName: 'Update Date' , align: 'center'},
        {field: 'edit' ,headerName: 'Edit', align: 'center' ,  btn: (data ? (<Button onClick={() => {console.log('=== test ===',data?.name_surname)}}  variant="contained" color="primary"> Edit </Button>) : '-')},
        {field: 'delete' ,headerName: 'Delete', align: 'center' , btn: (data ? (<Button onClick={() => {console.log('=== test ===',data?.name_surname)}}  variant="outlined" color="error"> DELETE </Button>) : '-')},
        ]
)

    const onClickFetch = useCallback( async () => {
        await axios.get('http://localhost:3000/api/users').then((res) => {
            console.log('res.data',res.data)
           return setData(res.data[0])
        }).catch((err) => {
            console.log('=== error ===', err)
        })
    },[])
    return (
        <>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}> 
            <Button variant="contained" sx={{width:'100px'}} onClick={onClickFetch}>
                ดึงข้อมูล
            </Button>
        {/* ให้ Table มีการใช้ Style แบบ component Paper */}
        <Paper sx={{ width: '1067px', overflow: 'hidden' }}>
            <TableContainer> 
                <Table>
                    <TableHead>
                        <TableRow>
                            {columnData().map((item) => {return <TableCell sx={{textAlign: item.align ? item.align : "left"}} key={item.field}>{item.headerName}</TableCell>})}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data ? data.map((item: TableDataType,index ) => {
                            return (<TableRow hover tabIndex={-1} key={index}>
                                    {columnData(item).map((column) => {
                                        const value = item[column.field as keyof TableDataType] 
                                        if(column.field == 'edit'){
                                            return (<TableCell key={column.field}>
                                                {column.btn}
                                            </TableCell>)
                                        }else if(column.field == 'delete') {
                                            return (<TableCell key={column.field}>
                                                {column.btn}
                                            </TableCell>)
                                        }else {
                                            return (<TableCell key={column.field}>
                                                {typeof value == 'boolean' ? (value == true ? 'ใช้งาน' : 'ไม่ใช้งาน') : value ?? '-'}
                                            </TableCell>)
                                        }
                                    })}
                            </TableRow>)
                        }) : []}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

        </Box>
        </>
    )
}