# Quick Start - Deploy Imediato

## 1️⃣ Adicionar Token na Vercel

```
Dashboard Vercel → Projeto → Settings → Environment Variables

Name: PUSHINPAY_TOKEN
Value: [SEU_TOKEN_AQUI]
Environments: ✅ Production ✅ Preview ✅ Development
```

## 2️⃣ Deploy

```bash
git add .
git commit -m "Integrar PushinPay PIX real"
git push
```

**OU** use "Redeploy" no dashboard da Vercel.

## 3️⃣ Testar

1. Acesse a aplicação
2. Clique em "Adicionar Saldo"
3. Insira R$ 1,00 (ou qualquer valor ≥ R$ 0,50)
4. Clique "Gerar PIX"
5. QR Code real aparece ✅

## ✅ O Que Funciona Agora

- ✅ QR Code real da PushinPay
- ✅ Código PIX copiável (copia e cola)
- ✅ ID da transação visível
- ✅ Validação de valor mínimo (R$ 0,50)
- ✅ Mensagens de erro amigáveis
- ✅ Layout mantido 100%

## ⚠️ Simulação Local

A confirmação de pagamento ainda é **simulada** (5 segundos).
Para confirmação REAL, implemente webhook separadamente.

## 📁 Arquivos Importantes

- `/api/create-pix.ts` - Endpoint serverless
- `/src/components/AddBalanceModal.tsx` - Modal atualizado
- `PUSHINPAY-README.md` - Documentação completa
- `ALTERACOES.md` - Detalhes das mudanças

## 🐛 Troubleshooting

**Erro: "Configuração de pagamento ausente"**
→ Verifique se `PUSHINPAY_TOKEN` está na Vercel

**Erro: "Token inválido"**
→ Confirme o token no painel PushinPay

**QR Code não aparece**
→ Veja logs em: Vercel → Deployments → Functions

## 💡 Nota Importante

> Esta integração apenas gera o QR PIX via PushinPay na seção DEPÓSITO.
> Confirmação de pagamento será tratada separadamente.

---

**Está pronto! Só falta adicionar o token e fazer deploy. 🚀**
