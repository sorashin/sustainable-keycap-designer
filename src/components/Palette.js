import React, { useState } from "react"
import styled from "styled-components"


const Colors = styled.ul`
    position: absolute;
    top:0;
    bottom:0;
    right: ${props => props.isOpen? '0%' : '-100%'} ;
    transition:all 0.4s ease-in-out;
    a{
      line-height:4;
      border-bottom:solid 1px #eeeeee;
      cursor:pointer;
    }
`




export default function Palette({colorJSON, keysData, isOpen, currentKey}) {
  
  //クリックしたキーの色を変更
  const updateColor = (selectedKey)=>{
    if(keysData[currentKey] && isOpen){
      let key = keysData[currentKey]
      key.color = 2
      console.log(keysData)
    }
  }

  const listColors = colorJSON.map((key, id) =>
        <li key={id}><a onClick={updateColor(currentKey)}>{key.title}</a></li>
      )

  // const changeKey = useCallback(()=>{
    
  // },[])

  return (
    <Colors isOpen={isOpen}>
      {listColors}
    </Colors>
  )
}