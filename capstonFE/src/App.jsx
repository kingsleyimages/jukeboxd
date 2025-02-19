import React, { use, useEffect } from 'react';
import axios from 'axios';
function App() {
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}`)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);
  return <>Capstone</>;
}

export default App;
