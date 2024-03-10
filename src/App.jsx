import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState([])
  const [regex, setRegex] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(false)
  const [numLetters, setNumLetters] = useState(8)

  const fetchText = () => {
    fetch("ignis-100K.txt")
      .then((res) => res.text())
      .then(text => {
        setText(text.split("\n").filter(pw => pw.length <= 10))
        setResults(text.split("\n").filter(pw => (
          pw.length === numLetters
          && new RegExp(regex).exec(pw)
        )))
        setLoading(false)
      })
  }

  useEffect(fetchText, [])

  const handleChangeResults = (numLetters, regex) => {
    try {
      const re = new RegExp(regex, "i")
      setResults(text.filter(pw => (
        pw.length === numLetters && re.exec(pw)
      )))
    } catch (e) {
      setError(true)
    }
  }

  const handleLettersChange = (value) => {
    const numLetters = parseInt(value)
    setNumLetters(numLetters)
    handleChangeResults(numLetters, regex)
  }

  const handleRegexChange = (value) => {
    setError(false)
    setRegex(value)
    handleChangeResults(numLetters, value)
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  } 

  return (
    <div>
      <div style={{ margin: 10 }}>
        <p>The results will only show up when there are fewer than 100.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ margin: 10 }}>
          <label>Letters: </label>
          <input
            type='number'
            min={1}
            max={10}
            step={1}
            value={numLetters}
            onChange={(e) => handleLettersChange(e.target.value)}
          />
        </div>
        <div style={{ margin: 10 }}>
          <label>Regex: </label>
          <input
            type='text'
            value={regex}
            onChange={(e) => handleRegexChange(e.target.value)}
          />
        </div>
        {error && (
          <div style={{ color: "#ff0000", fontStyle: "italic" }}>
            Invalid Regular Expression
          </div>
        )}
        <div style={{ margin: 10 }}>
          Results: {results.length}
        </div>
        {(results.length > 0 && results.length <= 100 && regex.length > 0 && !error) && (
          <table style={{ margin: 10 }}>
            <thead>
              <tr>
                <th>Results</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result}>
                  <td>{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
