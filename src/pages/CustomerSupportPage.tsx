import { FormEvent, useMemo, useState } from 'react';

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const SYSTEM_PROMPT = `You are a helpful customer support assistant for an e-commerce website called MythManga.
Help with orders, shipping, returns, coupons, account, payments, and product questions.
If details are missing, ask short follow-up questions.`;

export default function CustomerSupportPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hi! I\'m your support assistant. Ask me about orders, shipping, returns, payments, or account help.',
    },
  ]);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const aiEnabled = useMemo(() => Boolean(apiKey && apiKey.trim().length > 0), [apiKey]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const updatedChat: ChatMessage[] = [...chat, { role: 'user', text: trimmed }];
    setChat(updatedChat);
    setMessage('');
    setError(null);

    if (!aiEnabled) {
      setChat([
        ...updatedChat,
        {
          role: 'assistant',
          text: 'AI support is currently disabled. Add VITE_OPENAI_API_KEY in your .env file, restart the app, and try again.',
        },
      ]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedChat.map((entry) => ({ role: entry.role, content: entry.text })),
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI request failed (${response.status})`);
      }

      const data = await response.json();
      const assistantText = data?.output_text?.trim() || 'I could not generate a response. Please try again.';
      setChat((prev) => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unexpected error while contacting support AI.');
      setChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I am unable to respond right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] mb-3">Customer Support</h1>
      <p className="text-[#5A6C7D] mb-6">
        Chat with our support assistant for order, shipping, returns, and account help.
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-4 text-xs sm:text-sm text-gray-600">
          Status:{' '}
          <span className={aiEnabled ? 'font-semibold text-green-700' : 'font-semibold text-amber-700'}>
            {aiEnabled ? 'AI enabled' : 'AI disabled (set VITE_OPENAI_API_KEY in .env)'}
          </span>
        </div>

        <div className="h-[380px] overflow-y-auto rounded-lg border border-gray-200 p-3 bg-gray-50 space-y-3">
          {chat.map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-6 ${
                entry.role === 'user'
                  ? 'ml-auto bg-[#2C3E50] text-white'
                  : 'mr-auto bg-white border border-gray-200 text-[#2C3E50]'
              }`}
            >
              {entry.text}
            </div>
          ))}
          {loading && <div className="text-sm text-gray-500">Typing…</div>}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C3E50]/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#2C3E50] text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Send
          </button>
        </form>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>
    </section>
  );
}
