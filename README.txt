# Sistema de Controle de Armários e Chaves
Este projeto foi ajustado para funcionar **sem Node/Vite**, usando React via CDN e Babel no navegador.

## Como usar
1. Abra o arquivo `index.html` diretamente no navegador (Chrome, Edge, Firefox).
   - Dê duplo clique no arquivo ou abra com `Ctrl+O` no navegador.
2. Cadastre funcionários, filtre, edite e exclua.
3. Os dados ficam salvos no **localStorage** do navegador.
4. Use **Exportar CSV** para baixar um relatório em `formulario_armarios.csv`.
5. Use **Importar CSV** para carregar um arquivo no mesmo formato (com cabeçalho):
   - `Nome do Funcionário, Número da Chave do Armário, Possui Armário (Sim/Não)`

## Estrutura
- `index.html` — Aplicação completa (UI + lógica) pronta para uso.
- `formulario_armarios.csv` — Exemplo de planilha (apenas cabeçalho).

## Observação
A antiga estrutura Vite (src/main.jsx, shadcn/ui, lucide-react) não existia no .zip enviado. Por isso, foi adotado um modelo sem build para garantir execução imediata.
