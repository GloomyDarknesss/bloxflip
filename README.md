# 🌧️ Bloxflip Rain Autojoin

Este é um script Tampermonkey que permite que você entre automaticamente nas "rains" no site Bloxflip. 🎉 (nao fornecemos o recaptcha)

## 🚀 Como usar

1. Instale a extensão Tampermonkey no seu navegador.
2. Clique no ícone Tampermonkey e selecione "Create a new script".
3. Cole o código do script na janela do editor e salve o script.
4. Navegue até https://bloxflip.com/ e o script começará a funcionar automaticamente. 🌐

## 🔔 Configuração do Webhook do Discord

O script pode enviar uma mensagem para um webhook do Discord sempre que entrar em uma chuva. Para configurar isso, substitua a URL do seu webhook do Discord na variável `discordWebhookUrl` no script.

```javascript
let discordWebhookUrl = 'https://discord.com/api/webhooks/your-webhook-id/your-webhook-token';
```

🔄 Atualizações
O script verifica automaticamente as atualizações a partir da URL especificada na metatag @updateURL no cabeçalho do script.

📜 Licença
Este script é licenciado sob a licença MIT. 📝

```