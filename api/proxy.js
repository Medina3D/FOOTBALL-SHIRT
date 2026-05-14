export default async function handler(req, res) {
    // CORS - permitir todo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { service, payload } = req.body;

    try {
        if (service === 'anthropic') {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(response.status).json(data);

        } else if (service === 'openai') {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(response.status).json(data);

        } else {
            return res.status(400).json({ error: 'Unknown service' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
