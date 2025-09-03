
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const [nome, setNome] = useState('');
  const [possuiArmario, setPossuiArmario] = useState('');
  const [numeroArmario, setNumeroArmario] = useState('');
  const [chave, setChave] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dados da linha
    const data = [[
      nome,
      possuiArmario,
      numeroArmario,
      chave,
      observacao
    ]];

    // Cabeçalhos
    const headers = [['Nome', 'Possui Armário?', 'Número do Armário', 'Chave', 'Observações']];

    // Criar planilha
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');

    // Gerar arquivo .xlsx
    XLSX.writeFile(workbook, 'formulario_armarios.xlsx');

    // Resetar formulário
    setNome('');
    setPossuiArmario('');
    setNumeroArmario('');
    setChave('');
    setObservacao('');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Controle de Armários</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <select
          value={possuiArmario}
          onChange={(e) => setPossuiArmario(e.target.value)}
          required
          className="border p-2 rounded"
        >
          <option value="">Possui armário?</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
        <input
          type="text"
          placeholder="Número do Armário (opcional)"
          value={numeroArmario}
          onChange={(e) => setNumeroArmario(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Chave (opcional)"
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Observações (opcional)"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar no Excel
        </button>
      </form>
    </div>
  );
}

export default App;
