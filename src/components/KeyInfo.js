import React from "react"
import styled from "styled-components"


const Info = styled.div`
  display:flex;
  flex-direction: row;
  position: absolute;
  bottom:20px;
  left:50%;
  transform:translateX(-50%);
  color:#29191977;
  width:100%;
  max-width:560px;
  padding:32px;
  height:100px;
`
const Text = styled.div`
  margin:0 0 0 16px;
`
const Title = styled.div`
  color:#29191998;
  font-weight:800;
`
const Description = styled.div``

const Thumbnail = styled.div`
  width:90px;
  height:90px;
  border-radius:8px;
  background-size:cover ;
  background-repeat: no-repeat;
  background-image: url(${props => props.url})
`

export default function KeyInfo({keyId, keysData, colorJSON}) {
  return (
    <Info>
        <Thumbnail url={colorJSON[keysData[keyId].color].imgUrl}/>
        <Text>
          <Title>{colorJSON[keysData[keyId].color].title}</Title>
          <Description>{colorJSON[keysData[keyId].color].description}</Description>
        </Text>
    </Info>
  )
}