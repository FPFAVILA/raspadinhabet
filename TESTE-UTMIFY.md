# 🔍 GUIA DE TESTE - UTMIFY TRACKING

## ✅ Correções Aplicadas

1. **PixelId Corrigido**: Atualizado para `68fc19882b1ad12764fcbdf5`
2. **Scripts Utmify**: Configurados corretamente no `index.html`
3. **Eventos Adicionados**: 8 eventos de tracking implementados

---

## 📊 Eventos Implementados

### 1. **PageView** (Automático)
- **Quando**: Ao carregar qualquer página
- **Onde**: `src/main.tsx`
- **Dados**: Nenhum

### 2. **Cadastro**
- **Quando**: Ao completar o formulário de registro
- **Onde**: `src/components/RegistrationForm.tsx`
- **Dados**: `{ name, email, phone }`

### 3. **PixGerado**
- **Quando**: Ao gerar um código PIX
- **Onde**: `src/components/AddBalanceModal.tsx`
- **Dados**: `{ amount, transactionId }`

### 4. **AddBalance**
- **Quando**: Ao confirmar pagamento PIX
- **Onde**: `src/components/AddBalanceModal.tsx`
- **Dados**: `{ amount }`

### 5. **RaspadinhaRevelada**
- **Quando**: Ao completar uma raspadinha
- **Onde**: `src/components/ScratchCard.tsx`
- **Dados**: `{ cardNumber }`

### 6. **PremioGanho**
- **Quando**: Ao ganhar um prêmio na raspadinha
- **Onde**: `src/components/ScratchCard.tsx`
- **Dados**: `{ prizeType, prizeValue }`

### 7. **ResgateIphone**
- **Quando**: Ao resgatar o iPhone (via tracking.ts)
- **Onde**: `src/utils/tracking.ts`
- **Dados**: Dados do prêmio

---

## 🧪 Como Testar

### 1. Abra o Console do Navegador (F12)

### 2. Verifique se os scripts carregaram:
```javascript
console.log('PixelId:', window.pixelId);
console.log('AdvancedPixelEvent:', typeof window.AdvancedPixelEvent);
```

**Resultado esperado:**
```
PixelId: 68fc19882b1ad12764fcbdf5
AdvancedPixelEvent: function
```

### 3. Teste o fluxo completo:

#### a) PageView (automático ao abrir site)
Verifique no console:
```
[Utmify] Event tracked: PageView
```

#### b) Cadastro
1. Preencha o formulário
2. Clique em "Começar a Jogar"
3. Verifique no console:
```
[Utmify] Event tracked: Cadastro {name: "...", email: "...", phone: "..."}
```

#### c) Gerar PIX
1. Clique em "Adicionar Saldo"
2. Digite um valor (ex: 5,00)
3. Clique em "Gerar PIX"
4. Verifique no console:
```
[Utmify] Event tracked: PixGerado {amount: 5, transactionId: "..."}
```

#### d) Confirmar Pagamento
Aguarde 5 segundos (pagamento simulado)
Verifique no console:
```
[Utmify] Event tracked: AddBalance {amount: 5}
```

#### e) Raspar Cartela
1. Clique em uma raspadinha
2. Raspe toda a cartela
3. Feche a raspadinha
4. Verifique no console:
```
[Utmify] Event tracked: RaspadinhaRevelada {cardNumber: 1}
```

Se ganhou prêmio:
```
[Utmify] Event tracked: PremioGanho {prizeType: "money", prizeValue: 5}
```

---

## ⚠️ Problemas Comuns

### Evento não aparece no console?

**Verifique:**
1. Scripts carregaram? → Veja Network tab (F12 → Network)
2. `window.pixelId` está correto?
3. `window.AdvancedPixelEvent` existe?

### Scripts não carregam?

**Possíveis causas:**
- Adblocker bloqueando
- Extensões de privacidade
- CSP (Content Security Policy) bloqueando

**Solução:**
- Desative extensões temporariamente
- Teste em aba anônima
- Verifique console por erros de CORS/CSP

---

## 🎯 Checklist Final

- [ ] Scripts carregados (Network tab)
- [ ] `window.pixelId` = `68fc19882b1ad12764fcbdf5`
- [ ] `window.AdvancedPixelEvent` = função
- [ ] PageView dispara ao carregar
- [ ] Cadastro dispara ao registrar
- [ ] PixGerado dispara ao gerar PIX
- [ ] AddBalance dispara ao pagar
- [ ] RaspadinhaRevelada dispara ao raspar
- [ ] PremioGanho dispara ao ganhar

---

## 📱 Dashboard Utmify

Acesse: https://utmify.com.br/dashboard

**Pixel ID:** `68fc19882b1ad12764fcbdf5`

Lá você verá todos os eventos em tempo real!

---

## 🐛 Debug Avançado

Se os eventos não aparecem no Utmify mas aparecem no console:

```javascript
// Cole no console do navegador:
window.AdvancedPixelEvent('TesteManual', { teste: true });
```

Se isso funcionar no Utmify, os eventos estão sendo enviados corretamente!

