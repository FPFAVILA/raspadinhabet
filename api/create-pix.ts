import type { VercelRequest, VercelResponse } from '@vercel/node';

const PUSHINPAY_API_URL = 'https://api.pushinpay.com.br/api/pix/cashIn';

interface PushinPayResponse {
  id: string;
  qr_code: string;
  qr_code_base64: string;
  status: string;
  value: number;
}

interface ErrorResponse {
  ok: false;
  code: number;
  error: string;
}

interface SuccessResponse {
  ok: true;
  id: string;
  qr_code: string;
  qr_code_base64: string;
  status: string;
  value: number;
}

const getErrorMessage = (status: number, data?: any): string => {
  const errorMap: Record<number, string> = {
    400: 'Requisição inválida. Verifique os dados enviados.',
    401: 'Token de autenticação inválido ou expirado.',
    422: data?.message || 'O valor deve ser no mínimo R$ 0,50.',
    429: 'Limite de requisições excedido. Tente novamente em instantes.',
    500: 'Erro no servidor de pagamento. Tente novamente.',
    502: 'Serviço de pagamento temporariamente indisponível.',
    503: 'Serviço de pagamento em manutenção.',
  };

  return errorMap[status] || 'Erro ao processar pagamento. Tente novamente.';
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({
      ok: false,
      code: 405,
      error: 'Método não permitido. Use POST.'
    });
    return;
  }

  const token = process.env.PUSHINPAY_TOKEN;

  if (!token) {
    console.error('[create-pix] PUSHINPAY_TOKEN não configurado');
    res.status(500).json({
      ok: false,
      code: 500,
      error: 'Configuração de pagamento ausente.'
    });
    return;
  }

  const { value } = req.body;

  if (!value || typeof value !== 'number' || value < 50) {
    res.status(422).json({
      ok: false,
      code: 422,
      error: 'O valor deve ser no mínimo R$ 0,50 (50 centavos).'
    });
    return;
  }

  try {
    const response = await fetch(PUSHINPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        split_rules: []
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[create-pix] Erro PushinPay:', response.status, data);

      const errorResponse: ErrorResponse = {
        ok: false,
        code: response.status,
        error: getErrorMessage(response.status, data)
      };

      res.status(response.status).json(errorResponse);
      return;
    }

    const pushinPayData = data as PushinPayResponse;

    const successResponse: SuccessResponse = {
      ok: true,
      id: pushinPayData.id,
      qr_code: pushinPayData.qr_code,
      qr_code_base64: pushinPayData.qr_code_base64,
      status: pushinPayData.status,
      value: pushinPayData.value
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error('[create-pix] Erro na requisição:', error);

    const errorResponse: ErrorResponse = {
      ok: false,
      code: 500,
      error: 'Erro de conexão com serviço de pagamento.'
    };

    res.status(500).json(errorResponse);
  }
}
