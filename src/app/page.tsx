'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function Home() {
  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | 'true' | 'false' | 'uncertain'>(null);

  const handleFactCheck = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error('Error checking fact:', err);
      setResult('uncertain');
    }

    setLoading(false);
  };

  const getResultIcon = () => {
    switch (result) {
      case 'true':
        return <CheckCircle2 className="text-green-500 h-10 w-10" />;
      case 'false':
        return <XCircle className="text-red-500 h-10 w-10" />;
      default:
        return <HelpCircle className="text-yellow-500 h-10 w-10" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">VeriFact: Instant Fact Checker</h1>
        <textarea
          placeholder="Enter a statement to verify..."
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-blue-400 resize-none"
        />
        <button
          onClick={handleFactCheck}
          disabled={loading || !statement}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Fact'}
        </button>

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {result && !loading && (
          <div className="mt-6 flex items-center justify-center space-x-3">
            {getResultIcon()}
            <span className="text-xl font-semibold capitalize">{result}</span>
          </div>
        )}
      </div>
    </main>
  );
}
