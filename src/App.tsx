import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";

function App() {
  const url = `http://127.0.0.1:8000/api/chats/`;
  const [text, setText]: any = useState('')

  useEffect(() => {
    axios.get(url).then(response => setText(response.data))
  }, [url])

  return (
    <div className="App">
      <h1>{text}</h1>
    </div>
  );
}

export default App;
