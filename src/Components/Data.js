import moment from 'moment'
import React from 'react'

export const Data = ({excelData}) => {

    return excelData.map((individualExcelData)=>(
        <tr key={individualExcelData.Id}>
            <th>{individualExcelData.name}</th>
            <th>{individualExcelData.batch}</th>
            <th>{individualExcelData.stock}</th>
            <th>{individualExcelData.deal}</th>
            <th>{individualExcelData.free}</th>
            <th>{individualExcelData.mrp}</th>
            <th>{individualExcelData.rate}</th>
            <th>{moment(individualExcelData.exp).format("DD/MM/YYYY")}</th>
        </tr>        
    ))
}