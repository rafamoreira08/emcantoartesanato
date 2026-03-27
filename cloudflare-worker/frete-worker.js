/**
 * Cloudflare Worker — Proxy para Melhor Envio
 * Em Canto Artesanato
 *
 * Variável de ambiente necessária:
 *   ME_TOKEN  →  seu token de API do Melhor Envio
 *
 * Deploy:
 *   1. Acesse dash.cloudflare.com → Workers & Pages → Create
 *   2. Cole este código no editor
 *   3. Em Settings → Variables → adicione ME_TOKEN com o valor do token
 *   4. Copie a URL do Worker (ex: frete-emcanto.seuusuario.workers.dev)
 *   5. Cole essa URL em js/checkout.js na constante FRETE_WORKER_URL
 */

const ORIGIN_CEP  = '30220000';
const USER_AGENT  = 'Em Canto Artesanato (emcantoartesanato@gmail.com)';
const ME_API      = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Body inválido' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const cepDestino = (body.cep || '').replace(/\D/g, '');
    if (cepDestino.length !== 8) {
      return new Response(JSON.stringify({ error: 'CEP inválido' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Estima peso e dimensões com base no total de itens
    const totalItens = Math.max(1, body.totalItens || 1);
    const pesoKg     = Math.min(30, totalItens * 0.25);  // 250g por item, máx 30kg
    const height     = Math.min(60, 5  + totalItens * 2);
    const width      = 20;
    const length     = 25;

    const payload = {
      from: { postal_code: ORIGIN_CEP },
      to:   { postal_code: cepDestino },
      package: { height, width, length, weight: pesoKg },
      options: {
        insurance_value: body.valorDeclarado || 0,
        receipt:  false,
        own_hand: false,
      },
    };

    try {
      const meRes = await fetch(ME_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.ME_TOKEN}`,
          'Content-Type':  'application/json',
          'Accept':        'application/json',
          'User-Agent':    USER_AGENT,
        },
        body: JSON.stringify(payload),
      });

      const data = await meRes.json();

      return new Response(JSON.stringify(data), {
        status: meRes.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Erro ao contatar Melhor Envio' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};
