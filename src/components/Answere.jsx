import React, { useEffect, useState } from 'react'

const Answere = ({ans ,index}) => {

  if(typeof ans ==='object'&&ans.text){
    return <p>{ans.text}</p>
  }

    const [heading,setHeading]=useState(false)
    const [answare,setAnsware]=useState(ans)
    console.log(index);
    
    
    useEffect(()=>{
      if(checkHeading(ans)){
          setHeading(true)
          setAnsware(replaceString(ans))
      }
      
    })
    const checkHeading=(str)=>{
        return /^(\*)(\*)(.*)\*$/.test(str)
    }
    const replaceString=(str)=>{
      return str.replace(/^(\*)(\*)|(\*)$/g,'')
    }
    
  return (
    <div className='w-100 m-3'>
     
    {heading? <span className='py-2 block text-red-400  '>{answare}</span>:<span >{answare}</span>}
    </div>
  )
}

export default Answere
