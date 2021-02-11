import React, { useCallback } from "react"
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




export default function Palette({color, keys, isOpen, currentKey}) {
  const listColors = color.map((key, id) =>
        <li key={id}><a>{key.title}</a></li>
      )

  // const changeKey = useCallback(()=>{
    
  // },[])

  return (
    <Colors isOpen={isOpen}>
      {listColors}
    </Colors>
  )
}