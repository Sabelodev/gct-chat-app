import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


import { useEffect, useState } from 'react';

const USERNAME_KEY = 'gct-chat-username';
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,32}$/;

function UsernameModal({ onSetUsername }: { onSetUsername: (username: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!USERNAME_REGEX.test(value)) {
      setError('Username must be 3–32 chars, alphanumeric, _, -, .');
      return;
    }
    localStorage.setItem(USERNAME_KEY, value);
    onSetUsername(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-modal="true"
        role="dialog"
      >
        <h2 className="text-lg font-semibold">Enter your username</h2>
        <input
          type="text"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          value={value}
          onChange={e => {
            setValue(e.target.value);
            setError('');
          }}
          minLength={3}
          maxLength={32}
          pattern={USERNAME_REGEX.source}
          autoFocus
          aria-label="Username"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(USERNAME_KEY);
    if (stored && USERNAME_REGEX.test(stored)) {
      setUsername(stored);
    }
  }, []);

  const [messages, setMessages] = useState<Array<{ username: string; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || !username) return;
    setMessages(prev => [...prev, { username, content: input.trim() }]);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!username && <UsernameModal onSetUsername={setUsername} />}
      <div className="w-full max-w-md bg-white rounded shadow p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">GCT Chat App</h1>
        <div
          className="flex-1 overflow-y-auto border rounded p-2 h-64 bg-gray-50"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-20">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="mb-2" role="article">
                <span className="font-semibold text-blue-700">{msg.username}:</span>{' '}
                <span>{msg.content}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={!username}
            placeholder={username ? 'Type a message...' : 'Enter username first'}
            aria-label="Message input"
          />
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700"
            onClick={handleSend}
            disabled={!username || !input.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
