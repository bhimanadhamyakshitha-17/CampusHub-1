import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize GoogleGenAI SDK on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json({ limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// SSE Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  try {
    const {
      messages = [],
      systemInstruction = '',
      enableGoogleSearch = false,
      temperature = 0.7,
      model = 'gemini-3.8-flash',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.',
      });
    }

    // Convert messages to Gemini SDK contents format
    const contents = messages.map((m: any) => {
      const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
      const parts: any[] = [];

      // Support image attachments (multimodal)
      if (m.image && m.image.data) {
        // Strip out data URL prefix if present (e.g. data:image/png;base64,)
        let rawBase64 = m.image.data;
        let mimeType = m.image.mimeType || 'image/jpeg';
        if (rawBase64.includes('base64,')) {
          const split = rawBase64.split('base64,');
          rawBase64 = split[1];
          const matchMime = split[0].match(/data:(.*?);/);
          if (matchMime && matchMime[1]) {
            mimeType = matchMime[1];
          }
        }
        parts.push({
          inlineData: {
            data: rawBase64,
            mimeType,
          },
        });
      }

      if (m.content && typeof m.content === 'string') {
        parts.push({ text: m.content });
      } else if (parts.length === 0) {
        parts.push({ text: '' });
      }

      return { role, parts };
    });

    const defaultSystemInstruction =
      'You are an intelligent, helpful, highly capable AI assistant, comparable to Google Gemini and ChatGPT. ' +
      'Answer questions clearly, thoroughly, and objectively. Format your responses with clean Markdown, ' +
      'including code blocks with programming language identifiers, clear headings, bullet points, and tables where appropriate. ' +
      'If the user asks for code, provide well-explained, secure, and production-ready snippets.';

    const buildConfig = (includeSearch: boolean) => {
      const cfg: any = {
        systemInstruction: systemInstruction || defaultSystemInstruction,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      };
      if (includeSearch) {
        cfg.tools = [{ googleSearch: {} }];
      }
      return cfg;
    };

    // Helper to attempt streaming with model and tool fallback
    async function getStreamWithFallback() {
      const modelsToTry = [model || 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const m of modelsToTry) {
        // Try with search if requested
        if (enableGoogleSearch) {
          try {
            return await ai.models.generateContentStream({
              model: m,
              contents,
              config: buildConfig(true),
            });
          } catch (searchErr: any) {
            console.warn(`Streaming with search on model ${m} failed, trying without search tool:`, searchErr?.message);
            // If quota (429) or 503, fallback to no-search
          }
        }

        // Try standard generation without search
        try {
          return await ai.models.generateContentStream({
            model: m,
            contents,
            config: buildConfig(false),
          });
        } catch (err: any) {
          console.warn(`Model ${m} failed:`, err?.status, err?.message);
          lastError = err;
          // Continue to next model if 503 or transient
        }
      }

      throw lastError || new Error('All model attempts failed');
    }

    const responseStream = await getStreamWithFallback();

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let aggregatedGrounding: any[] = [];
    let aggregatedQueries: string[] = [];

    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const webSearchQueries = chunk.candidates?.[0]?.groundingMetadata?.webSearchQueries;

      if (groundingChunks && Array.isArray(groundingChunks)) {
        aggregatedGrounding = [...aggregatedGrounding, ...groundingChunks];
      }
      if (webSearchQueries && Array.isArray(webSearchQueries)) {
        aggregatedQueries = [...aggregatedQueries, ...webSearchQueries];
      }

      const payload = {
        text,
        groundingChunks,
        webSearchQueries,
      };

      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }

    // Send final payload with all aggregated grounding metadata if present
    res.write(
      `data: ${JSON.stringify({
        text: '',
        isDone: true,
        finalGrounding: aggregatedGrounding,
        finalQueries: aggregatedQueries,
      })}\n\n`
    );
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error('Error in /api/chat/stream:', err);
    const msg = err?.message || 'An error occurred during Gemini response generation.';
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    }
  }
});

// Non-streaming fallback endpoint
app.post('/api/chat/generate', async (req, res) => {
  try {
    const {
      messages = [],
      systemInstruction = '',
      enableGoogleSearch = false,
      temperature = 0.7,
      model = 'gemini-3.8-flash',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const contents = messages.map((m: any) => {
      const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
      const parts: any[] = [];
      if (m.image && m.image.data) {
        let rawBase64 = m.image.data;
        let mimeType = m.image.mimeType || 'image/jpeg';
        if (rawBase64.includes('base64,')) {
          const split = rawBase64.split('base64,');
          rawBase64 = split[1];
          const matchMime = split[0].match(/data:(.*?);/);
          if (matchMime && matchMime[1]) {
            mimeType = matchMime[1];
          }
        }
        parts.push({
          inlineData: {
            data: rawBase64,
            mimeType,
          },
        });
      }
      if (m.content) {
        parts.push({ text: m.content });
      } else if (parts.length === 0) {
        parts.push({ text: '' });
      }
      return { role, parts };
    });

    const defaultSystemInstruction =
      systemInstruction ||
      'You are an intelligent, helpful AI assistant. Answer questions clearly and format with Markdown.';

    const buildConfig = (includeSearch: boolean) => {
      const cfg: any = {
        systemInstruction: defaultSystemInstruction,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      };
      if (includeSearch) {
        cfg.tools = [{ googleSearch: {} }];
      }
      return cfg;
    };

    const modelsToTry = [model || 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let response: any = null;

    for (const m of modelsToTry) {
      if (enableGoogleSearch) {
        try {
          response = await ai.models.generateContent({
            model: m,
            contents,
            config: buildConfig(true),
          });
          break;
        } catch (searchErr: any) {
          console.warn(`Search generation failed on ${m}:`, searchErr?.message);
        }
      }

      try {
        response = await ai.models.generateContent({
          model: m,
          contents,
          config: buildConfig(false),
        });
        break;
      } catch (err: any) {
        console.warn(`Model ${m} failed:`, err?.status, err?.message);
        lastError = err;
      }
    }

    if (!response) {
      throw lastError || new Error('Failed to generate response.');
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    res.json({
      text: response.text || '',
      groundingChunks,
      webSearchQueries,
    });
  } catch (err: any) {
    console.error('Error in /api/chat/generate:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate response.' });
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Explicit fallback for SPA route handling in dev mode
    const fs = await import('fs');
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
