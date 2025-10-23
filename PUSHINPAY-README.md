# Integração PushinPay - Instruções

## Configuração na Vercel

### Adicionar Variável de Ambiente

1. Acesse o dashboard da Vercel
2. Selecione o projeto **raspadinha-pixup**
3. Vá em **Settings** → **Environment Variables**
4. Adicione a seguinte variável:

```
Name: PUSHINPAY_TOKEN
Value: [seu_token_pushinpay]
Environment: Production, Preview, Development
```

5. Clique em **Save**
6. Faça um **Redeploy** do projeto

## O que foi alterado

### Arquivos Modificados

1. **`/api/create-pix.ts`** (NOVO)
   - Endpoint serverless que gera PIX real via PushinPay
   - Validação de valor mínimo (50 centavos)
   - Tratamento de erros amigável

2. **`/src/components/AddBalanceModal.tsx`**
   - Substituído geração fictícia pela API real
   - Mantido layout e comportamento visual existente
   - Exibe QR Code real e código PIX copiável

3. **`/vercel.json`**
   - Adicionado rota para API serverless

4. **Removido:** `/src/hooks/useFictionalPix.ts`
   - Hook fictício não é mais necessário

## Como Funciona

### Frontend (Depósito)

Quando o usuário clica em "Gerar PIX":
1. Valor é convertido para centavos
2. Requisição POST para `/api/create-pix`
3. Exibe QR Code real (imagem base64)
4. Exibe código PIX copiável
5. Mostra ID da transação

### Backend (API)

O endpoint `/api/create-pix`:
1. Valida valor mínimo (50 centavos)
2. Chama PushinPay API com token da env
3. Retorna QR Code, código PIX e ID da transação
4. Trata erros de forma amigável

## Importante

⚠️ **Esta integração apenas gera o QR PIX via PushinPay na seção DEPÓSITO.**

**Confirmação de pagamento será tratada separadamente.**

### O que NÃO foi implementado:
- Webhook de confirmação
- Polling de status
- Confirmação automática
- Persistência no servidor
- Banco de dados

## Teste Local (Opcional)

1. Crie `.env.local`:
```
PUSHINPAY_TOKEN=seu_token_aqui
```

2. Execute:
```bash
npm run dev
```

3. Teste depósito com valor mínimo R$ 0,50

## Deploy

Após adicionar a env `PUSHINPAY_TOKEN`:

```bash
git add .
git commit -m "Integrar PushinPay para geração de PIX real"
git push
```

Ou use **Redeploy** no dashboard da Vercel.

## Validações

- Valor mínimo: R$ 0,50 (50 centavos)
- Valor deve ser numérico
- Token obrigatório

## Mensagens de Erro

| Código | Mensagem |
|--------|----------|
| 400 | Requisição inválida |
| 401 | Token inválido ou expirado |
| 422 | Valor deve ser no mínimo R$ 0,50 |
| 429 | Limite de requisições excedido |
| 500 | Erro no servidor |
| 502 | Serviço indisponível |
| 503 | Serviço em manutenção |

## Suporte

Em caso de problemas:
1. Verifique se `PUSHINPAY_TOKEN` está configurado
2. Verifique logs na Vercel (Functions)
3. Confirme que o token é válido
