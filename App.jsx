import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Trash2, Download, Users, Key, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [funcionarios, setFuncionarios] = useState([])
  const [nome, setNome] = useState('')
  const [possuiArmario, setPossuiArmario] = useState('')
  const [numeroChave, setNumeroChave] = useState('')

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('funcionarios-armarios')
    if (dadosSalvos) {
      setFuncionarios(JSON.parse(dadosSalvos))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('funcionarios-armarios', JSON.stringify(funcionarios))
  }, [funcionarios])

  const adicionarFuncionario = () => {
    if (!nome.trim()) return

    const novoFuncionario = {
      id: Date.now(),
      nome: nome.trim(),
      possuiArmario: possuiArmario === 'sim',
      numeroChave: possuiArmario === 'sim' ? numeroChave.trim() : '',
      dataRegistro: new Date().toLocaleDateString('pt-BR')
    }

    setFuncionarios([...funcionarios, novoFuncionario])
    setNome('')
    setPossuiArmario('')
    setNumeroChave('')
  }

  const removerFuncionario = (id) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id))
  }

  const exportarCSV = () => {
    const csv = [
      'Nome do Funcionário,Possui Armário,Número da Chave,Data de Registro',
      ...funcionarios.map(f => 
        `"${f.nome}","${f.possuiArmario ? 'Sim' : 'Não'}","${f.numeroChave}","${f.dataRegistro}"`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `armarios_funcionarios_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const estatisticas = {
    total: funcionarios.length,
    comArmario: funcionarios.filter(f => f.possuiArmario).length,
    semArmario: funcionarios.filter(f => !f.possuiArmario).length,
    chavesDuplicadas: funcionarios
      .filter(f => f.possuiArmario && f.numeroChave)
      .reduce((acc, curr) => {
        acc[curr.numeroChave] = (acc[curr.numeroChave] || 0) + 1
        return acc
      }, {})
  }

  const chavesDuplicadas = Object.entries(estatisticas.chavesDuplicadas)
    .filter(([_, count]) => count > 1)
    .map(([chave, count]) => ({ chave, count }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Controle de Armários
          </h1>
          <p className="text-gray-600">
            Gerencie e controle os armários dos funcionários da empresa
          </p>
        </div>

        <Tabs defaultValue="cadastro" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            <TabsTrigger value="listagem">Listagem</TabsTrigger>
            <TabsTrigger value="relatorio">Relatório</TabsTrigger>
          </TabsList>

          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cadastrar Funcionário
                </CardTitle>
                <CardDescription>
                  Registre as informações do funcionário e seu armário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Funcionário</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="possui-armario">Possui Armário?</Label>
                    <Select value={possuiArmario} onValueChange={setPossuiArmario}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {possuiArmario === 'sim' && (
                  <div className="space-y-2">
                    <Label htmlFor="numero-chave">Número da Chave</Label>
                    <Input
                      id="numero-chave"
                      placeholder="Digite o número da chave"
                      value={numeroChave}
                      onChange={(e) => setNumeroChave(e.target.value)}
                    />
                  </div>
                )}

                <Button 
                  onClick={adicionarFuncionario}
                  disabled={!nome.trim() || !possuiArmario}
                  className="w-full"
                >
                  Cadastrar Funcionário
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listagem">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Lista de Funcionários
                  </CardTitle>
                  <CardDescription>
                    {funcionarios.length} funcionário(s) cadastrado(s)
                  </CardDescription>
                </div>
                <Button onClick={exportarCSV} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
              </CardHeader>
              <CardContent>
                {funcionarios.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum funcionário cadastrado ainda
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Possui Armário</TableHead>
                        <TableHead>Número da Chave</TableHead>
                        <TableHead>Data de Registro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id}>
                          <TableCell className="font-medium">{funcionario.nome}</TableCell>
                          <TableCell>
                            <Badge variant={funcionario.possuiArmario ? "default" : "secondary"}>
                              {funcionario.possuiArmario ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {funcionario.possuiArmario ? funcionario.numeroChave || "-" : "-"}
                          </TableCell>
                          <TableCell>{funcionario.dataRegistro}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerFuncionario(funcionario.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Funcionários</p>
                      <p className="text-2xl font-bold">{estatisticas.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Com Armário</p>
                      <p className="text-2xl font-bold text-green-600">{estatisticas.comArmario}</p>
                    </div>
                    <Key className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sem Armário</p>
                      <p className="text-2xl font-bold text-red-600">{estatisticas.semArmario}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Ocupação</p>
                      <p className="text-2xl font-bold">
                        {estatisticas.total > 0 ? Math.round((estatisticas.comArmario / estatisticas.total) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {chavesDuplicadas.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Chaves Duplicadas Detectadas
                  </CardTitle>
                  <CardDescription>
                    As seguintes chaves estão sendo utilizadas por mais de um funcionário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chavesDuplicadas.map(({ chave, count }) => (
                      <div key={chave} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="font-medium">Chave #{chave}</span>
                        <Badge variant="destructive">{count} funcionários</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Funcionários sem Armário</CardTitle>
                <CardDescription>
                  Lista de funcionários que precisam de armário
                </CardDescription>
              </CardHeader>
              <CardContent>
                {estatisticas.semArmario === 0 ? (
                  <div className="text-center py-4 text-green-600">
                    ✅ Todos os funcionários possuem armário!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {funcionarios
                      .filter(f => !f.possuiArmario)
                      .map(funcionario => (
                        <div key={funcionario.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">{funcionario.nome}</span>
                          <Badge variant="secondary">Sem armário</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

