// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useState, useRef} from 'react'

// custom hook
const useLocalStorageState = (
  key,
  initialValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = useState(() => {
    const valInStorage = window.localStorage.getItem(key)
    if (valInStorage) {
      return deserialize(valInStorage)
    }
    // in case that the initial value is expensive to get, extracts that out
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  // gives a mutatable object ref which doesnt cause re-renders
  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current
    // if the key has changed, which may have caused useEffect to run
    // remove the previous key
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    // always ensures the prev key is up to date with the current key
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  const handleChange = event => setName(event.target.value)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
