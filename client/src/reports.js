import {React,useState,useEffect, useRef} from "react";
// import  CalendarComp  from "./reportCalendar";
import './reports.css'
import { Calendar } from 'react-date-range'
import format from 'date-fns/format'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

function Report(){
    const [ Reports, setReports ] = useState([])
    // const [currentReportIndex, setCurrentReportIndex] = useState(0);
    async function GetReports(event){
        event.preventDefault()
        const response = await fetch('http://localhost:5000/api/getreports',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                calendar,
            })
        })
        const data = await response.json();
        // console.log(data)
        setReports(data)
        setTableDate(calendar)
        // if(Reports.length >0){
        //     console.log(Reports)
        // }
        // setCurrentReportIndex(0); // Reset the index when fetching new reports
    }

    useEffect(() => {
        if(Reports.length>0){
        console.log(Reports)
        }
        // setCurrentReportIndex(Reports.length); // Set the index to the end to display all reports
    }, [Reports]);
    

    const [date, setDate] = useState('');
    // date state
    const [calendar, setCalendar] = useState((new Date()).toString())
    const [tableDate, setTableDate] = useState('')
    // open close
    const [open, setOpen] = useState(false)

    // get the target element to toggle 
    const refOne = useRef(null)

    useEffect(() => {
        // set current date on component load
        setCalendar(format(calendar, 'MM/dd/yyyy'))
        console.log(calendar);
        // event listeners

        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [calendar])

    // hide dropdown on ESC press
    const hideOnEscape = (e) => {
        // console.log(e.key)
        if( e.key === "Escape" ) {
        setOpen(false)
        }
    }

    // Hide on outside click
    const hideOnClickOutside = (e) => {
        // console.log(refOne.current)
        // console.log(e.target)
        if( refOne.current && !refOne.current.contains(e.target) ) {
        setOpen(false)
        }
    }

    // on date change, store date in state
    const handleSelect = (date) => {
        // console.log(date)
        // console.log(format(date, 'MM/dd/yyyy'))
        setCalendar(format(date, 'MM/dd/yyyy'))
    }
    return (
        <div className="report-page">
            <h1 className="report-title">REPORTS</h1>
            <button onClick={GetReports} type="button" className="fetchReports">
                <p>Fetch</p>
            </button>

            <div className="leftbar">
            <button onClick={()=>window.location.href='/mapDepartment'}>
                    <i className="fas fa-arrow-turn-up" ></i>
                </button>
            </div>
            <div className="calendarWrap">

                <input
                value={calendar}
                readOnly
                className="inputBox"

                onClick={ () => setOpen(open => !open) }
                // onChange={() => setDate(e.target.value)}
                
                />

                <div ref={refOne} className="calendarBox">
                {open && 
                    <Calendar
                    date={ new Date() }
                    onChange = { handleSelect }
                    className="calendarElement"
                    />
                }
                </div>
            </div>
            <div className="reports-main">
                {Reports.length > 0 && (
                    <table className="reports-table">
                        <caption className="table-caption">Reports on {tableDate}</caption>
                        <tr className="table-header">
                            <th>House Number</th>
                            <th>Citizen ID</th>
                            <th>Water Supplied in gallons</th>
                        </tr>
                        {Reports.map((report, index) => (
                            report.reports.map((subreport, subindex) => (
                                <tr className="table-row" key={subindex}>
                                    <td className="table-data">{subreport.CANID}</td>
                                    <td className="table-data">{subreport.USERID}</td>
                                    <td className="table-data">{subreport.waterquantitysupplied}</td>
                                </tr>
                            ))
                        ))}
                    </table>
                )}
                {Reports.length == 0 && (
                    <table className="reports-table">
                        <caption className="table-caption">Reports on {tableDate}</caption>
                        <td className="table-data">NO REPORTS AVAILABLE ON SELECTED DATE</td>
                    </table>
                )}
            </div>

        </div>
    )
}
export default Report;