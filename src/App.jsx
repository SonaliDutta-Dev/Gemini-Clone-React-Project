import { useState } from 'react'

import Sidebar from './component/Sidebar/Sidebar'
import Main from './component/Main/Main'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar />
      <Main />
    </>
  )
}

export default App
