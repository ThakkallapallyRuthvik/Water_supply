import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import format from 'date-fns/format'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const CalendarComp = () => {

  const [date, setDate] = useState('');
  // date state
  const [calendar, setCalendar] = useState(new Date())

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
    <div className="calendarWrap">

      <input
        value={ calendar }
        readOnly
        className="inputBox"

        onClick={ () => setOpen(open => !open) }
        // onChange={() => setDate(e.target.value)}
        on
      />

      <div ref={refOne}>
        {open && 
          <Calendar
            date={ new Date() }
            onChange = { handleSelect }
            className="calendarElement"
          />
        }
      </div>

    </div>
  )
}

export default CalendarComp