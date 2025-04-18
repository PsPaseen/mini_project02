import dayjs from "dayjs";
import { dataType_1, dataType_2 } from "../pages/ButtonPage"
import * as XLSX from 'xlsx';

const Size = 15;

interface exportExcelProp {
    mergeData: dataType_1[]
    data: dataType_1[]
    data_other: dataType_2[]
    data_etc?: dataType_2[]
    maxDate: number
}


// สูตรคำนวณ %

// ค่าขนส่ง * 100
// แล้วหารด้วย 

const toDateString = (Date: string) => {
    return parseInt(dayjs(Date).format('DD'))
}

const CheckAllCar = (typeCar:string) => {
    switch(typeCar) {
        case '4w':
          return true
        case '6Lw':
            return true
        case 'PickUp':
            return true
        default:
            return false
      }
}


export const ExportExcel = (props: exportExcelProp) => {
    const { mergeData, data, data_other, data_etc, maxDate } = props  
    const toDay = dayjs().format('DD/MM/YYYY')

    const wb = XLSX.utils.book_new();
    
    const mainHeader = ['วันที่','ประเภทรถภายนอก','รถรับจ้างภายใน','รวมจำนวนเที่ยว','ยอดรถบรรทุกภายนอก','รวมยอดรถรับจ้างภายใน','รวมยอดมูลค่าสินค้ารถบรรทุก','ค่าขนส่งรถภายนอก','ค่าขนส่งรถภายใน','รวมค่าขนส่ง','%','วันที่ส่ง','Main','Other1','ETC','Total']
    const otherHeader = ['วันที่','รวมรถกระบะ','กระบะ กทม.','กระบะ ตรว.','6ล้อ']

    const firstTableData = []
    const secondTableData = []
    const thirdTableData = []
    const forthTableData = []
    const fifthTableData = []

    for(let i = 1 ; i <= maxDate+1 ; i++){
        //main
        const outCar = mergeData.filter((item) => ((toDateString(item.Enddate) == i) && item.typecarid == 'outsideCar')).length
        const inCar = mergeData.filter((item) => ((toDateString(item.Enddate) == i) && CheckAllCar(item.typecarid))).length
        const allCar = mergeData.filter((item) => ((toDateString(item.Enddate) == i))).length

        const outShipAmount = mergeData.filter((item) => ((toDateString(item.Enddate) == i)) && item.typecarid == 'outsideCar').reduce((sum: number , item:dataType_1) => {sum += parseFloat(item.shipamount); return sum},0)
        const inShipAmount = mergeData.filter((item) => ((toDateString(item.Enddate) == i)) && CheckAllCar(item.typecarid)).reduce((sum: number , item:dataType_1) => {sum += parseFloat(item.shipamount); return sum},0)
        const sumAmount = (outShipAmount ?? 0) + (inShipAmount ?? 0)

        const outTotalExpen = mergeData.filter((item) => ((toDateString(item.Enddate) == i)) && item.typecarid == 'outsideCar').reduce((sum: number , item:dataType_1) => {sum += parseFloat(item.totalexpense); return sum},0)
        const inTotalExpen = mergeData.filter((item) => ((toDateString(item.Enddate) == i)) && CheckAllCar(item.typecarid)).reduce((sum: number , item:dataType_1) => {sum += parseFloat(item.totalexpense); return sum},0)
        const sumTotalExpen = (outTotalExpen ?? 0) + (inTotalExpen ?? 0)
        const percent = sumTotalExpen ? parseFloat(((sumTotalExpen * 100) / sumAmount).toFixed(2)) : 0

        const amountMain = data.filter((item) => (toDateString(item.Enddate) == i)).reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) ?? 0
        const amountOther = data_other.filter((item) => (toDateString(item.Enddate) == i)).reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) ?? 0
        const amountETC = data_etc ? data_etc.filter((item) => (toDateString(item.Enddate) == i)).reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) : 0
        const amountTotal =  amountMain + amountOther + amountETC

        //other_table 1
        // const w4andOther = mergeData.filter((item) => (toDateString(item.Enddate) == i) && ['4w' , 'PickUp'].includes(item.typecarid)).length  //กรุงเทพ & อื่นๆ array 4w PickUp แล้วนำค่า item.typecarid มาตรวจสอบว่ามีค่าเดียวกันมั้ย
        const w4Car = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '4w').length  //กรุงเทพ
        const OtherCar = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == 'PickUp').length //จังหวัดอื่นๆ
        const SixWhCar = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '6Lw').length //6ล้อ
        const w4andOther = w4Car + OtherCar
        //2
        // const w4andOtherAmount = mergeData.filter((item) => (toDateString(item.Enddate) == i) && ['4w' , 'PickUp'].includes(item.typecarid)).reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) //กรุงเทพ & อื่นๆ
        const w4Amount = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '4w').reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) //กรุงเทพ
        const OtherAmount = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == 'PickUp').reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) //กรุงเทพ
        const SixWhAmount = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '6Lw').reduce((sum: number , item) => {sum += parseFloat(item.shipamount); return sum},0) //กรุงเทพ
        const w4andOtherAmount = w4Amount + OtherAmount
        //3
        const w4TotalExpen = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '4w').reduce((sum: number , item) => {sum += parseFloat(item.totalexpense); return sum},0) //กรุงเทพ
        const OtherTotalExpen = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == 'PickUp').reduce((sum: number , item) => {sum += parseFloat(item.totalexpense); return sum},0) //กรุงเทพ
        const SixWhTotalExpen = mergeData.filter((item) => (toDateString(item.Enddate) == i) && item.typecarid == '6Lw').reduce((sum: number , item) => {sum += parseFloat(item.totalexpense); return sum},0) //กรุงเทพ
        const w4andOtherTotalExpen = w4TotalExpen + OtherTotalExpen
        //4
        const w4Percent = w4TotalExpen ? parseFloat(((w4TotalExpen * 100) / w4Amount).toFixed(2)) : 0
        const OtherPercent = OtherTotalExpen ? parseFloat(((OtherTotalExpen * 100) / OtherAmount).toFixed(2)) : 0
        const SixWhPercent = SixWhTotalExpen ? parseFloat(((SixWhTotalExpen * 100) / SixWhAmount).toFixed(2)) : 0
        const w4andOtherPercent = w4andOtherTotalExpen ? parseFloat(((w4andOtherTotalExpen * 100) / w4andOtherAmount).toFixed(2)) : 0

        if(i < maxDate+1)
        {    
            firstTableData.push({i , outCar , inCar , allCar , outShipAmount, inShipAmount , sumAmount , outTotalExpen, inTotalExpen, sumTotalExpen , percent , day: i ,amountMain ,amountOther, amountETC , amountTotal })
            secondTableData.push({i, w4andOther, w4Car, OtherCar, SixWhCar})
            thirdTableData.push({i, w4andOtherAmount,w4Amount, OtherAmount, SixWhAmount  })
            forthTableData.push({i, w4andOtherTotalExpen,w4TotalExpen, OtherTotalExpen, SixWhTotalExpen  })
            fifthTableData.push({i, w4andOtherPercent,w4Percent, OtherPercent, SixWhPercent})
        }else if (i == maxDate+1) {
            //main
            const sumOutCar:number = firstTableData.reduce((sum: number ,item) => {sum += item.outCar; return sum},0) //ที่ต้องให้ type number เพราะ firstTableData เป็น any[] (เพราะเอาข้อมูลยัดเข้าไม่ได้สร้าง type) แล้วพอเอามาใช้ก็ไม่รู้ว่าจะ assign Type อะไรให้
            const sumInCar:number = firstTableData.reduce((sum: number ,item) => {sum += item.inCar; return sum},0)
            const sumAllCar:number = firstTableData.reduce((sum: number ,item) => {sum += item.allCar; return sum},0)
            const sumOutShipAmount:number = firstTableData.reduce((sum: number ,item) => {sum += item.outShipAmount; return sum},0)
            const sumInShipAmount:number = firstTableData.reduce((sum: number ,item) => {sum += item.inShipAmount; return sum},0)
            const sumAllAmount:number = firstTableData.reduce((sum: number ,item) => {sum += item.sumAmount; return sum},0)

            const sumOutTotalExpen:number = firstTableData.reduce((sum: number ,item) => {sum += item.outTotalExpen; return sum},0)
            const sumInTotalExpen:number = firstTableData.reduce((sum: number ,item) => {sum += item.inTotalExpen; return sum},0)
            const sumAllTotalExpen:number = firstTableData.reduce((sum: number ,item) => {sum += item.sumTotalExpen; return sum},0)

            const percentEnd = sumAllTotalExpen ? parseFloat(((sumAllTotalExpen * 100) / sumAllAmount).toFixed(2)) : 0

            const sumAllAmountMain:number = firstTableData.reduce((sum: number ,item) => {sum += item.amountMain; return sum},0) 
            const sumAllAmountOther:number = firstTableData.reduce((sum: number ,item) => {sum += item.amountOther; return sum},0) 
            const sumAllAmountETC:number = firstTableData.reduce((sum: number ,item) => {sum += item.amountETC; return sum},0) 
            const sumAllTotalAmount = sumAllAmountMain + sumAllAmountOther + sumAllAmountETC
            //other
            //1
            const Totalw4:number = secondTableData.reduce((sum:number , item) => {sum += item.w4Car; return sum},0)
            const AVGw4:number = parseFloat((Totalw4 / maxDate).toFixed(2))
            const TotalPickUp:number = secondTableData.reduce((sum:number , item) => {sum += item.OtherCar; return sum},0)
            const AVGPickUp:number = parseFloat((TotalPickUp / maxDate).toFixed(2))
            const TotalSixWh:number = secondTableData.reduce((sum:number , item) => {sum += item.SixWhCar; return sum},0)
            const AVGSixWh:number = parseFloat((TotalSixWh / maxDate).toFixed(2))
            const Totalw4andPickUp:number = Totalw4 + TotalPickUp
            const AVGw4andPickUp:number = parseFloat((Totalw4andPickUp / maxDate).toFixed(2))
             //2
             const Totalw4Amount:number = thirdTableData.reduce((sum:number , item) => {sum += item.w4Amount; return sum},0)
             const AVGw4Amount:number = parseFloat((Totalw4Amount / maxDate).toFixed(2))
             const TotalPickUpAmount:number = thirdTableData.reduce((sum:number , item) => {sum += item.OtherAmount; return sum},0)
             const AVGPickUpAmount:number = parseFloat((TotalPickUpAmount / maxDate).toFixed(2))
             const TotalSixWhAmount:number = thirdTableData.reduce((sum:number , item) => {sum += item.SixWhAmount; return sum},0)
             const AVGSixWhAmount:number = parseFloat((TotalSixWhAmount / maxDate).toFixed(2))
             const Totalw4andPickUpAmount:number = Totalw4Amount + TotalPickUpAmount
             const AVGw4andPickUpAmount:number = parseFloat((Totalw4andPickUpAmount / maxDate).toFixed(2))
             //3
             const Totalw4Expense:number = forthTableData.reduce((sum:number , item) => {sum += item.w4TotalExpen; return sum},0)
             const AVGw4Expense:number = parseFloat((Totalw4Expense / maxDate).toFixed(2))
             const TotalPickUpExpense:number = forthTableData.reduce((sum:number , item) => {sum += item.OtherTotalExpen; return sum},0)
             const AVGPickUpExpense:number = parseFloat((TotalPickUpExpense / maxDate).toFixed(2))
             const TotalSixWhExpense:number = forthTableData.reduce((sum:number , item) => {sum += item.SixWhTotalExpen; return sum},0)
             const AVGSixWhExpense:number = parseFloat((TotalSixWhExpense / maxDate).toFixed(2))
             const Totalw4andPickUpExpense:number = Totalw4Expense + TotalPickUpExpense
             const AVGw4andPickUpExpense:number = parseFloat((Totalw4andPickUpExpense / maxDate).toFixed(2))


            firstTableData.push({i:'Total' , outCar:sumOutCar,
                inCar: sumInCar ,
                allCar: sumAllCar ,
                outShipAmount: sumOutShipAmount,
                inShipAmount: sumInShipAmount,
                sumAmount: sumAllAmount,
                outTotalExpen: sumOutTotalExpen,
                inTotalExpen: sumInTotalExpen,
                sumTotalExpen: sumAllTotalExpen,
                percent: percentEnd,
                day: 'รวม' ,
                amountMain : sumAllAmountMain,
                amountOther: sumAllAmountOther,
                amountETC : sumAllAmountETC,
                amountTotal:sumAllTotalAmount})

                secondTableData.push({i:'Total', w4andOther:Totalw4andPickUp , w4Car:Totalw4, OtherCar:TotalPickUp, SixWhCar:TotalSixWh})
                thirdTableData.push({i:'Total', w4andOtherAmount:Totalw4andPickUpAmount,w4Amount:Totalw4Amount, OtherAmount:TotalPickUpAmount, SixWhAmount:TotalSixWhAmount  })
                forthTableData.push({i:'Total', w4andOtherTotalExpen:Totalw4andPickUpExpense,w4TotalExpen:Totalw4Expense, OtherTotalExpen:TotalPickUpExpense, SixWhTotalExpen:TotalSixWhExpense  })
    
                secondTableData.push({i:'AVG', w4andOther:AVGw4andPickUp, w4Car:AVGw4, OtherCar:AVGPickUp, SixWhCar:AVGSixWh})
                thirdTableData.push({i:'AVG', w4andOtherAmount:AVGw4andPickUpAmount,w4Amount:AVGw4Amount, OtherAmount:AVGPickUpAmount, SixWhAmount:AVGSixWhAmount  })
                forthTableData.push({i:'AVG', w4andOtherTotalExpen:AVGw4andPickUpExpense,w4TotalExpen:AVGw4Expense, OtherTotalExpen:AVGPickUpExpense, SixWhTotalExpen:AVGSixWhExpense  })
        }

    }
    //นำข้อมูลมาใส่ array และไม่ให้ object property name (เพื่อให้ lib sheetjs สามารถนำไปใช้ได้)
    const mainData = firstTableData.map(item => [
        item.i, 
        item.outCar, 
        item.inCar, 
        item.allCar,
        item.outShipAmount,
        item.inShipAmount,
        item.sumAmount,
        item.outTotalExpen,
        item.inTotalExpen,
        item.sumTotalExpen,
        item.percent,
        item.day,
        item.amountMain,
        item.amountOther,
        item.amountETC,
        item.amountTotal,
      ]);

      const secondData = secondTableData.map(item => [item.i, item.w4andOther, item.w4Car, item.OtherCar, item.SixWhCar])
      const thirdData = thirdTableData.map(item => [item.i, item.w4andOtherAmount, item.w4Amount, item.OtherAmount, item.SixWhAmount])
      const forthData = forthTableData.map(item => [item.i, item.w4andOtherTotalExpen, item.w4TotalExpen, item.OtherTotalExpen, item.SixWhTotalExpen])
      const fifthData = fifthTableData.map(item => [item.i, item.w4andOtherPercent, item.w4Percent, item.OtherPercent, item.SixWhPercent])

    const TableData = [[toDay],mainHeader, ...mainData]
    const TableData2 = [['จำนวนเที่ยว'],otherHeader,...secondData]
    const TableData3 = [['มูลค่า'],otherHeader,...thirdData]
    const TableData4 = [['ค่าจัดส่ง'],otherHeader,...forthData]
    const TableData5 = [['เปอร์เซ็นต์ค่าขนส่ง'],otherHeader,...fifthData]

    const wsTop = XLSX.utils.aoa_to_sheet(TableData);
    const wscols = [
        { wch: Size },  // A
        { wch: Size }, // B
        { wch: Size }, // C
        { wch: Size }, { wch: Size }, { wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },{ wch: Size },
      ];
      wsTop['!cols'] = wscols;
      XLSX.utils.book_append_sheet(wb, wsTop, "Sheet1");

      const topTableRows = TableData.length;

    // เพิ่มตารางด้านล่างที่ 1 (ซ้าย) โดยกำหนดจุดเริ่มต้นที่ A + (topTableRows + 2)
    XLSX.utils.sheet_add_aoa(wsTop, TableData2, { origin: { r: topTableRows + 2, c: 0 } });

    XLSX.utils.sheet_add_aoa(wsTop, TableData3, { origin: { r: topTableRows + 2, c: 7 } });

    XLSX.utils.sheet_add_aoa(wsTop, TableData4, { origin: { r: topTableRows + 2, c: 14 } });

    XLSX.utils.sheet_add_aoa(wsTop, TableData5, { origin: { r: topTableRows + 2, c: 21 } });



    XLSX.writeFile(wb, `shipment_month-${dayjs(mergeData[0].Enddate).format('MM')}.xlsx`);

}