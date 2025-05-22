

// // import React, { useState, useRef } from 'react';
// // import axios from 'axios';

// // function App() {
// //   const [file, setFile] = useState(null);
// //   const [prompt, setPrompt] = useState('');
// //   const [response, setResponse] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const responseRef = useRef(null);

// //   // Use REACT_APP_API_URL from environment or fallback to localhost
// //   const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:1902/chat';

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!file || !prompt) {
// //       alert('Please select a file and enter a prompt.');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('file', file);
// //     formData.append('prompt', prompt);

// //     setLoading(true);
// //     setResponse('');

// //     try {
// //       console.log('📡 Sending request to:', apiUrl);

// //       const res = await axios.post(apiUrl, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// // console.log(res.data);
// //       setResponse(res.data.response);

// //       setTimeout(() => {
// //         responseRef.current?.scrollIntoView({ behavior: 'smooth' });
// //       }, 1000);
// //     } catch (err) {
// //       if (err.response) {
// //         console.error('❌ Server error:', err.response.data);
// //         setResponse(`❌ Server error: ${err.response.data.error || 'Unknown error'}`);
// //       } else if (err.request) {
// //         console.error('❌ No response received from server:', err.request);
// //         setResponse('❌ No response received from the server. Is it running on port 1902?');
// //       } else {
// //         console.error('❌ Request setup error:', err.message);
// //         setResponse(`❌ Request setup error: ${err.message}`);
// //       }
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
// //       <h2>File Chatbot</h2>

// //       <form onSubmit={handleSubmit}>
// //         <label>
// //           Upload file (.pdf, .xlsx): <br />
// //           <input
// //             type="file"
// //             accept=".pdf,.xlsx"
// //             onChange={(e) => setFile(e.target.files[0])}
// //           />
// //         </label>
// //         <br /><br />

// //         <label>
// //           Your Question: <br />
// //           <textarea
// //             rows="4"
// //             cols="60"
// //             placeholder="Enter your question here..."
// //             value={prompt}
// //             onChange={(e) => setPrompt(e.target.value)}
// //           />
// //         </label>
// //         <br /><br />

// //         <button type="submit" disabled={loading}>
// //           {loading ? 'Processing...' : 'Ask'}
// //         </button>
// //       </form>

// //       <br />
// //       {response && (
// //         <div ref={responseRef}>
// //           <h3>💬 Response:</h3>
// //           <pre
// //             style={{
// //               background: '#f4f4f4',
// //               padding: '1rem',
// //               borderRadius: '5px',
// //               whiteSpace: 'pre-wrap',
// //             }}
// //           >
// //             {response}
// //           </pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;
// import React, { useState, useRef } from 'react';
// import axios from 'axios';

// function App() {
//   const [file, setFile] = useState(null);
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const responseRef = useRef(null);

//   const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:1902/chat';

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file || !prompt) {
//       alert('Please select a file and enter a prompt.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('prompt', prompt);

//     setLoading(true);
//     setResponse('');

//     try {
//       console.log('📡 Sending request to:', apiUrl);

//       const res = await axios.post(apiUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setResponse(res.data.response);

//       setTimeout(() => {
//         responseRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 1000);
//     } catch (err) {
//       if (err.response) {
//         console.error('❌ Server error:', err.response.data);
//         setResponse(`❌ Server error: ${err.response.data.error || 'Unknown error'}`);
//       } else if (err.request) {
//         console.error('❌ No response received from server:', err.request);
//         setResponse('❌ No response received from the server. Is it running on port 1902?');
//       } else {
//         console.error('❌ Request setup error:', err.message);
//         setResponse(`❌ Request setup error: ${err.message}`);
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
//         <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">📁 File Chatbot</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Upload file (.pdf, .xlsx)
//             </label>
//             <input
//               type="file"
//               accept=".pdf,.xlsx"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Your Question
//             </label>
//             <textarea
//               rows="4"
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//               placeholder="Enter your question here..."
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
//           >
//             {loading ? 'Processing...' : 'Ask'}
//           </button>
//         </form>

//         {response && (
//           <div
//             ref={responseRef}
//             className="mt-8 bg-gray-100 border border-gray-300 rounded-xl p-5 shadow-sm"
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">💬 Response:</h3>
//             <pre className="whitespace-pre-wrap text-gray-700">{response}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this import is present

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:1902/chat';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !prompt) {
      alert('Please select a file and enter a prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(res.data.response);

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } catch (err) {
      if (err.response) {
        setResponse(`❌ Server error: ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        setResponse('❌ No response received from the server. Is it running on port 1902?');
      } else {
        setResponse(`❌ Request setup error: ${err.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="title">📁 File Chatbot</h2>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Upload file (.pdf, .xlsx):
            <input
              type="file"
              accept=".pdf,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-file"
            />
          </label>

          <label className="label">
            Your Question:
            <textarea
              className="textarea"
              rows="4"
              placeholder="Enter your question here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Processing...' : 'Ask'}
          </button>
        </form>

        {response && (
          <div ref={responseRef} className="response">
            <h3>💬 Response:</h3>
            <pre>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
