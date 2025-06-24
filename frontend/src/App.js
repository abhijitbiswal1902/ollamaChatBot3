

import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [outputFormat, setOutputFormat] = useState('text');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const responseRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:1902/chat';

  const formatResponse = (res) => {
    if (!res) return "No response";

    if (typeof res === 'object' && res.type && res.content) {
      if (res.type === 'csv') {
        return (
          <table className="response-table">
            <thead>
              <tr>
                {Object.keys(res.content[0] || {}).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {res.content.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      if (res.type === 'image' || res.type === 'text') {
        return (
          <div className="formatted-response">
            {Array.isArray(res.content)
              ? res.content.map((line, idx) => <div key={idx}>• {line}</div>)
              : <pre>{res.content}</pre>}
          </div>
        );
      }
    }

    try {
      const cleaned = res
        .replace(/```json|```/gi, '')
        .replace(/^.*?(\[|{)/s, '$1')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && typeof parsed[0] === 'object') {
        return (
          <table className="response-table">
            <thead>
              <tr>
                {Object.keys(parsed[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsed.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    } catch {
      // fallback
    }

    return <pre className="formatted-response">{res}</pre>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !prompt) {
      alert('Please select a file and enter a prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);
    formData.append('format', outputFormat);

    setLoading(true);

    try {
      const res = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newEntry = {
        id: Date.now(),
        fileName: file.name,
        question: prompt,
        answer: res.data.response,
        timestamp: new Date().toLocaleString(),
      };

      setHistory([newEntry, ...history]);
      setPrompt('');
      setFile(null);

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } catch (err) {
      const errorMsg = err.response
        ? `❌ Server error: ${err.response.data.error || 'Unknown error'}`
        : err.request
        ? '❌ No response received from the server. Is it running on port 1902?'
        : `❌ Request setup error: ${err.message}`;

      setHistory([
        {
          id: Date.now(),
          fileName: file.name,
          question: prompt,
          answer: errorMsg,
          timestamp: new Date().toLocaleString(),
        },
        ...history,
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="chatbox">
        <h1 className="title">📄 File QA Chatbot</h1>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Upload File:
            <input
              type="file"
              accept=".txt,.csv,.jpg,.jpeg,.png,.pdf,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-file"
            />
          </label>

          <label className="label">
            Your Question:
            <textarea
              className="textarea"
              rows="3"
              placeholder="Ask a question about the file..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>

          <label className="label">
            Response Format:
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="select"
            >
              <option value="text">Natural Language</option>
              <option value="json">Structured Table</option>
            </select>
          </label>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {history.length > 0 && (
          <div className="history" ref={responseRef}>
            <h2 className="subtitle">🧾 Previous Conversations</h2>
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="timestamp">{item.timestamp}</div>
                <div className="file-name">📁 <strong>{item.fileName}</strong></div>
                <div className="question"><strong>Q:</strong> {item.question}</div>
                <div className="answer">
                  <strong>A:</strong> {formatResponse(item.answer)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
