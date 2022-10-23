import { Button } from 'bootstrap';
import { useState } from 'react';
import * as XLSX from 'xlsx'
import './App.css';
import { Data } from './Components/Data';


function App() {
   
  // on change states
  const [excelFile, setExcelFile]=useState(null);
  const [excelFileError, setExcelFileError]=useState(null); 
  const [loading,setLoading]=useState(false);
  const [pageNumber, setPageNumber]=useState(1);
  const [dispalyData, setDisplayData]=useState(null)
 
  // submit
  const [excelData, setExcelData]=useState(null);
  // it will contain array of objects

    // pagination
    const handlePagination=()=>{
      if(excelData){
        let temp=[];
        for(let i=(pageNumber*100); i>=((pageNumber*100)-100);i--){
          temp.push(excelData[i]);
        }
        setDisplayData(temp);
        setLoading(true)
      }
    }
     
   

  // handle File
  const fileType=['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e)=>{
    let selectedFile = e.target.files[0];
    console.log("type",selectedFile.type)
    if(selectedFile){
      // console.log(selectedFile.type);
      if(selectedFile&&fileType.includes(selectedFile.type)){
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFileError(null);
          setExcelFile(e.target.result);
        } 
      }
      else{
        setExcelFileError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('plz select your file');
    }
  }
 
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = await XLSX.read(excelFile,{type:'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet=workbook.Sheets[worksheetName];
      const data = await XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
      handlePagination()
    }
    else{
      setExcelData(null);
    }
    
  }

  return (
    <div className="container">

      {/* upload file section */}
      <div className='form'>
        <form className='form-group' autoComplete="off"
        onSubmit={handleSubmit}>
          <label><h5>Upload Excel file</h5></label>
          <br></br>
          <input type='file' className='form-control'
          onChange={handleFile} required></input>                  
          {excelFileError&&<div className='text-danger'
          style={{marginTop:5+'px'}}>{excelFileError}</div>}
          <button type='submit' className='btn btn-success'
          style={{marginTop:5+'px'}}>Submit</button>
        </form>
      </div>

      <br></br>
      <hr></hr>

      {/* view file section */}
      <h5>View Excel file</h5>
      <div className='viewer'>
        {excelData===null&&<>No file selected</>}
        {dispalyData&&loading&&(
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Name</th>
                  <th scope='col'>Batch</th>
                  <th scope='col'>Stock</th>
                  <th scope='col'>Deal</th>
                  <th scope='col'>Free</th>
                  <th scope='col'>MRP</th>
                  <th scope='col'>rate</th>    
                  <th scope='col'>EXP</th>                 
                </tr>
              </thead>
              <tbody>
              { dispalyData && <Data excelData={dispalyData}/>}
              </tbody>
            </table> 
            <button disabled={pageNumber===1} onClick={()=>{setPageNumber(pageNumber-1); handlePagination()}}>prev</button>  
            <span>{pageNumber}</span>  
            <button disabled={(pageNumber*100)>=excelData.length} onClick={()=>{setPageNumber(pageNumber+1); handlePagination()}}>next</button>       
          </div>
        )}       
      </div>
            
    </div>
       
  );
}

export default App;
