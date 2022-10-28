import { Data } from "./Components/Data";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [displayData, setDisplayData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filterType, setFilterType] = useState("name");
  const [filter, setFilter] = useState("");

  const handleFilter = (e) => {
    if (filter && filterType) {
      let temp = excelData.filter((data) => data[filterType] === filter);
      setDisplayData(temp);
    }
  };

  // pagination
  const handlePagination = () => {
    if (excelData) {
      let temp = [];
      for (let i = pageNumber * 99; i >= pageNumber * 99 - 99; i--) {
        if (i < excelData.length) {
          temp.push(excelData[i]);
        }
      }
      setDisplayData(temp);
    }
  };

  // handle File
  const fileType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileType.includes(selectedFile.type)) {
        setExcelFileError(null);
        setExcelFile(e.target.files[0]);
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    }
  };

  useEffect(() => {
    handlePagination();
  }, [excelData, pageNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(excelFile);
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, {
          type: "buffer",
          cellDates: true,
        });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(data);
      };
    } else {
      setExcelData(null);
    }
  };
  console.log(pageNumber, displayData?.length);
  return (
    <div className="container">
      {/* upload file section */}
      <div className="form">
        <form className="form-group" autoComplete="off" onSubmit={handleSubmit}>
          <label>
            <h5>Upload Excel file</h5>
          </label>
          <br></br>
          <input
            type="file"
            className="form-control"
            onChange={handleFile}
            required
          ></input>
          {excelFileError && (
            <div className="text-danger" style={{ marginTop: 5 + "px" }}>
              {excelFileError}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-success"
            style={{ marginTop: 5 + "px" }}
          >
            Submit
          </button>
        </form>
      </div>

      <br></br>
      <hr></hr>
  

      {/* view file section */}
      <span>Filter: </span>
      <span> </span>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <span> </span>
      
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="code">Code</option>
        <option value="batch">Batch</option>
        <option value="company">Company</option>
        <option value="supplier">Supplier</option>
      </select>
      <span> </span>
      <span> </span>
      <button onClick={handleFilter}>Apply</button>
      <span> </span>
      <button onClick={() => handlePagination()}>Clear filter</button>
      <h5>View Excel file</h5>
      <div className="viewer">
        {excelData === null && <>No file selected</>}
        {displayData && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {displayData &&
                    Object.keys(displayData[0]).map((item) => {
                      return <th scope="col">{item.toUpperCase()}</th>;
                    })}
                </tr>
              </thead>
              <tbody>{displayData && <Data excelData={displayData} />}</tbody>
            </table>
            <button
              disabled={pageNumber === 1}
              onClick={() => {
                setPageNumber(pageNumber - 1);
              }}
            >
              prev
            </button>
            <span>{pageNumber}</span>
            <button
              disabled={displayData.length < 100}
              onClick={() => {
                setPageNumber(pageNumber + 1);
              }}
            >
              next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
