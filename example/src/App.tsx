import React, { useEffect } from 'react'
import RNUmengPushModule, { Counter } from 'react-native-umeng-push'

const App = () => {
  useEffect(() => {
    console.log(RNUmengPushModule)
  })

  return <Counter />
}

export default App
