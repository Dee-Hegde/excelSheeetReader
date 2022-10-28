import moment from 'moment'
import React from 'react'

export const Data = ({excelData}) => {

    return excelData.map((individualExcelData,i)=>(
        <tr key={i}>
            {Object.keys(individualExcelData).map((key)=>{
                if(individualExcelData[key] instanceof Date){
                    return ( <th>{moment(individualExcelData[key]).format("DD/MM/YYYY")}</th>)}
           return ( <th>{individualExcelData[key]}</th>)}
            )}
           
        </tr>        
    ))
}