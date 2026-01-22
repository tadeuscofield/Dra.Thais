# 🔐 LOGIN CASE-INSENSITIVE - DRA. THAIS

## ✅ SUPABASE JÁ FAZ ISSO AUTOMATICAMENTE!

O Supabase **já trata emails como case-insensitive** por padrão.

---

## 🎯 COMO FUNCIONA

### Email (case-insensitive automático):

Todos esses logins **funcionam**:

```
✅ thais@pediatra.com
✅ THAIS@PEDIATRA.COM
✅ Thais@Pediatra.Com
✅ ThAiS@PeDiAtRa.CoM
```

**Todos fazem login na mesma conta!**

### Senha (case-sensitive):

A senha **precisa ser exata**:

```
✅ ThaisPed@2025  (correto)
❌ thaIsped@2025  (errado)
❌ THAISPED@2025  (errado)
```

---

## 📋 CREDENCIAIS ACEITAS

### Dra. Thais:

**Emails aceitos (qualquer combinação de maiúsculas/minúsculas):**
- thais@pediatra.com
- THAIS@PEDIATRA.COM
- Thais@Pediatra.com
- etc...

**Senha (exata):**
- `ThaisPed@2025`

### Secretária:

**Emails aceitos:**
- secretaria@pediatra.com
- SECRETARIA@PEDIATRA.COM
- Secretaria@Pediatra.com
- etc...

**Senha (exata):**
- `Secret@2025`

---

## 🧪 TESTE

Tente fazer login com:

1. `THAIS@PEDIATRA.COM` + `ThaisPed@2025` → ✅ Funciona
2. `thais@PEDIATRA.com` + `ThaisPed@2025` → ✅ Funciona
3. `ThAiS@pEdIaTrA.cOm` + `ThaisPed@2025` → ✅ Funciona

**Email não importa maiúscula/minúscula!**
**Senha precisa ser exata!**

---

## ⚙️ COMO FUNCIONA (TÉCNICO)

O Supabase normaliza emails automaticamente:

```javascript
// Quando você faz login:
await supabase.auth.signInWithPassword({
  email: 'THAIS@PEDIATRA.COM',  // Supabase converte para lowercase
  password: 'ThaisPed@2025'
})

// Internamente o Supabase:
// 1. Converte email para: thais@pediatra.com
// 2. Busca usuário com esse email (case-insensitive)
// 3. Verifica senha (case-sensitive)
```

---

## ✅ CONCLUSÃO

**Já funciona!** Não precisa fazer nada.

O Supabase já trata emails como **case-insensitive** por padrão.

Pode usar:
- `thais@pediatra.com`
- `THAIS@PEDIATRA.COM`
- `ThAiS@PeDiAtRa.CoM`

**Todos funcionam!** ✅

---

**Status:** ✅ Case-insensitive para email já implementado (nativo Supabase)
**Data:** 2025-10-26
