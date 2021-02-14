import React, {useState} from "react"

export const useData = (currentKeyIndex) =>{
    
    const [data, setData] = useState([])
    
    const keysJSON = [
        {index: 0, name: 'F', color:2},
        {index: 1, name: 'G', color:1},
        {index: 2, name: 'H', color:0},
        {index: 3, name: 'J', color:2},
    ]
    
    const colorJSON = [
        {index: 0, color:'#5bf2ff', title: "SwitchBlue", description:'Switchコントローラーの青色の廃材を破砕して作成しました', imgUrl:'/images/colors/00.jpg'},
        {index: 1, color:'#5bf2ff', title: "消えいろピットブルー", description:'スティックのり’消えいろピット’の廃材を使用した青色キーです', imgUrl:'/images/colors/01.jpg'},
        {index: 2, color:'#5bf2ff', title: "ソフトバンクルーターアイボリー", description:'ソフトバンクのルーターの廃棄品の筐体を破砕して作成したアイボリーのキーです', imgUrl:'/images/colors/02.jpg'},
    ]
    
    const keyData = setData(keysJSON)

    const currentKey = currentKeyIndex
    const updateColor = (currentKeyIndex) =>{
        keyData[currentKeyIndex].color = 2
    }

    return [keyData, updateColor]
}