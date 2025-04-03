import React from 'react'

const Btn = ({ title="Login", styl, func=()=>{} }) => {
  return (
    <button onClick={func} className={`cursor-pointer font-medium py-2 px-6 rounded-full capitalize ${styl} transition-all ease-in-out duration-300`}> {title} </button>
  )
}

export default Btn