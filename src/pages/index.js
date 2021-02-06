import * as React from "react"
import BasicScene from '../scenes/BasicScene'
import styled from "styled-components"
import Layout from '../components/layout'

// styles
const pageStyles = {
  margin:0,
  padding:0,
  // padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}


// markup
const IndexPage = () => {
  
  return (
    <Layout>
      <BasicScene style={pageStyles}/>
    </Layout>
  )
}

export default IndexPage
