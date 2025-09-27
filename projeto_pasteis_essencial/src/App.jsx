import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ChefHat, User, Clock, CheckCircle, Plus, Trash2, RefreshCw, Wifi } from 'lucide-react'
import './App.css'

// URL base da API (simulada para demonstração)
const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(true) // Simulado como conectado

  // Estado para o formulário de novo pedido
  const [nomeCliente, setNomeCliente] = useState('')
  const [acaiComplementos, setAcaiComplementos] = useState([])
  const [quantidadeAcai, setQuantidadeAcai] = useState(0)
  const [quantidadePastelFrango, setQuantidadePastelFrango] = useState(0)
  const [quantidadePastelQueijoPres, setQuantidadePastelQueijoPres] = useState(0)
  const [quantidadePastelQueijo, setQuantidadePastelQueijo] = useState(0)

  // Estado para controle de estoque (visível apenas para o chef)
  const [estoque, setEstoque] = useState({
    pastelFrango: 80,
    pastelQueijoPres: 80,
    pastelQueijo: 40,
    acai: 100 // quantidade de açaí disponível
  })

  // Estado para histórico de vendas (página financeira)
  const [vendasHistorico, setVendasHistorico] = useState([])
  const [totalVendas, setTotalVendas] = useState({
    acai: 0,
    pastelFrango: 0,
    pastelQueijoPres: 0,
    pastelQueijo: 0
  })

  // Complementos disponíveis para o açaí
  const complementosDisponiveis = [
    'Leite condensado',
    'Leite em pó', 
    'Paçoca',
    'Disquete',
    'Banana',
    'Morango',
    'Granola'
  ]

  const adicionarPedido = async () => {
    if (!nomeCliente.trim()) {
      alert('Por favor, informe o nome do cliente')
      return
    }

    if (quantidadeAcai === 0 && quantidadePastelFrango === 0 && quantidadePastelQueijoPres === 0 && quantidadePastelQueijo === 0) {
      alert('Por favor, adicione pelo menos um item ao pedido')
      return
    }

    const itens = []

    // Adicionar açaís ao pedido
    if (quantidadeAcai > 0) {
      itens.push({
        tipo: 'açaí',
        quantidade: quantidadeAcai,
        complementos: acaiComplementos
      })
    }

    // Adicionar pastéis ao pedido
    if (quantidadePastelFrango > 0) {
      itens.push({
        tipo: 'pastel-frango-catupiry',
        quantidade: quantidadePastelFrango,
        complementos: ['frango com catupiry']
      })
    }

    if (quantidadePastelQueijoPres > 0) {
      itens.push({
        tipo: 'pastel-queijo-presunto',
        quantidade: quantidadePastelQueijoPres,
        complementos: ['queijo e presunto']
      })
    }

    if (quantidadePastelQueijo > 0) {
      itens.push({
        tipo: 'pastel-queijo',
        quantidade: quantidadePastelQueijo,
        complementos: ['queijo']
      })
    }

    try {
      setLoading(true)

      // Simular criação do pedido
      const novoPedido = {
        id: Date.now(),
        cliente: nomeCliente,
        itens: itens,
        status: 'recebido',
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }

      // Atualizar estoque
      const novoEstoque = { ...estoque }
      const novoTotalVendas = { ...totalVendas }
      const vendaAtual = {
        id: Date.now(),
        cliente: nomeCliente,
        data: new Date().toLocaleString('pt-BR'),
        itens: []
      }

      if (quantidadeAcai > 0) {
        novoEstoque.acai = Math.max(0, novoEstoque.acai - quantidadeAcai)
        novoTotalVendas.acai += quantidadeAcai
        vendaAtual.itens.push({ tipo: 'Açaí', quantidade: quantidadeAcai })
      }
      if (quantidadePastelFrango > 0) {
        novoEstoque.pastelFrango = Math.max(0, novoEstoque.pastelFrango - quantidadePastelFrango)
        novoTotalVendas.pastelFrango += quantidadePastelFrango
        vendaAtual.itens.push({ tipo: 'Pastel Frango c/ Catupiry', quantidade: quantidadePastelFrango })
      }
      if (quantidadePastelQueijoPres > 0) {
        novoEstoque.pastelQueijoPres = Math.max(0, novoEstoque.pastelQueijoPres - quantidadePastelQueijoPres)
        novoTotalVendas.pastelQueijoPres += quantidadePastelQueijoPres
        vendaAtual.itens.push({ tipo: 'Pastel Queijo e Presunto', quantidade: quantidadePastelQueijoPres })
      }
      if (quantidadePastelQueijo > 0) {
        novoEstoque.pastelQueijo = Math.max(0, novoEstoque.pastelQueijo - quantidadePastelQueijo)
        novoTotalVendas.pastelQueijo += quantidadePastelQueijo
        vendaAtual.itens.push({ tipo: 'Pastel Queijo', quantidade: quantidadePastelQueijo })
      }
      
      setEstoque(novoEstoque)
      setTotalVendas(novoTotalVendas)
      setVendasHistorico(prev => [vendaAtual, ...prev])
      setPedidos(prev => [novoPedido, ...prev])

      // Limpar formulário
      setNomeCliente('')
      setAcaiComplementos([])
      setQuantidadeAcai(0)
      setQuantidadePastelFrango(0)
      setQuantidadePastelQueijoPres(0)
      setQuantidadePastelQueijo(0)

      setError('')
      
    } catch (err) {
      setError('Erro ao criar pedido: ' + err.message)
      console.error('Erro ao criar pedido:', err)
    } finally {
      setLoading(false)
    }
  }

  const alterarStatusPedido = (id, novoStatus) => {
    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id === id ? { ...pedido, status: novoStatus } : pedido
      )
    )
  }

  const removerPedido = (id) => {
    setPedidos(prevPedidos => 
      prevPedidos.filter(pedido => pedido.id !== id)
    )
  }

  const toggleComplemento = (complemento) => {
    if (acaiComplementos.includes(complemento)) {
      setAcaiComplementos(acaiComplementos.filter(c => c !== complemento))
    } else {
      setAcaiComplementos([...acaiComplementos, complemento])
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'recebido':
        return 'bg-blue-500'
      case 'preparo':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'recebido':
        return 'Recebido'
      case 'preparo':
        return 'Em Preparo'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-pastel bg-clip-text text-transparent animate-pulse-warm">
            🥟 Sistema de Pedidos - Pastelaria & Açaí 🍇
          </h1>
          <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-warm">
            <Wifi className={`w-5 h-5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-600'}`}>
              {connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-warm">
            {error}
          </div>
        )}

        <Tabs defaultValue="garcom" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-card shadow-warm-lg">
            <TabsTrigger value="garcom" className="flex items-center gap-2 data-[state=active]:bg-gradient-pastel data-[state=active]:text-white">
              <User className="w-4 h-4" />
              Garçom - Novo Pedido
            </TabsTrigger>
            <TabsTrigger value="chef" className="flex items-center gap-2 data-[state=active]:bg-gradient-pastel data-[state=active]:text-white">
              <ChefHat className="w-4 h-4" />
              Chef - Visualizar Pedidos
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2 data-[state=active]:bg-gradient-pastel data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              Financeiro - Vendas
            </TabsTrigger>
          </TabsList>

          {/* Aba do Garçom */}
          <TabsContent value="garcom">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Plus className="w-5 h-5" />
                  🍽️ Registrar Novo Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 shadow-warm">
                {/* Nome do Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="nomeCliente" className="text-lg font-semibold text-accent">Nome do Cliente</Label>
                  <Input
                    id="nomeCliente"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className="text-lg border-2 border-muted focus:border-primary transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Seção Açaí */}
                  <Card className="border-2 border-purple-200 bg-gradient-acai/10 shadow-warm">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                        🍇 Açaí
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantidadeAcai">Quantidade</Label>
                        <Input
                          id="quantidadeAcai"
                          type="number"
                          min="0"
                          value={quantidadeAcai}
                          onChange={(e) => setQuantidadeAcai(parseInt(e.target.value) || 0)}
                          className="w-20"
                          disabled={loading}
                        />
                      </div>

                      {quantidadeAcai > 0 && (
                        <div className="space-y-3">
                          <Label>Complementos</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {complementosDisponiveis.map((complemento) => (
                              <div key={complemento} className="flex items-center space-x-2">
                                <Checkbox
                                  id={complemento}
                                  checked={acaiComplementos.includes(complemento)}
                                  onCheckedChange={() => toggleComplemento(complemento)}
                                  disabled={loading}
                                />
                                <Label htmlFor={complemento} className="text-sm">
                                  {complemento}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Seção Pastéis */}
                  <Card className="border-2 border-orange-200 bg-gradient-pastel/10 shadow-warm">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                        🥟 Pastéis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="quantidadePastelFrango">Frango com Catupiry</Label>
                          <Input
                            id="quantidadePastelFrango"
                            type="number"
                            min="0"
                            value={quantidadePastelFrango}
                            onChange={(e) => setQuantidadePastelFrango(parseInt(e.target.value) || 0)}
                            className="w-20"
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="quantidadePastelQueijoPres">Queijo e Presunto</Label>
                          <Input
                            id="quantidadePastelQueijoPres"
                            type="number"
                            min="0"
                            value={quantidadePastelQueijoPres}
                            onChange={(e) => setQuantidadePastelQueijoPres(parseInt(e.target.value) || 0)}
                            className="w-20"
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="quantidadePastelQueijo">Queijo</Label>
                          <Input
                            id="quantidadePastelQueijo"
                            type="number"
                            min="0"
                            value={quantidadePastelQueijo}
                            onChange={(e) => setQuantidadePastelQueijo(parseInt(e.target.value) || 0)}
                            className="w-20"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  onClick={adicionarPedido}
                  className="w-full text-lg py-6 bg-gradient-pastel hover:bg-gradient-pastel/90 shadow-warm-lg transition-all duration-300 hover:scale-105"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Registrando...' : '🎯 Registrar Pedido'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba do Chef */}
          <TabsContent value="chef">
            <div className="space-y-4">
              {/* Seção de Controle de Estoque */}
              <Card className="border-2 border-green-200 bg-green-50 shadow-warm-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <ChefHat className="w-5 h-5" />
                    📊 Controle de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-white p-4 rounded-lg shadow-warm">
                      <div className="text-3xl font-bold text-purple-700 animate-pulse-warm">🍇 {estoque.acai}</div>
                      <div className="text-sm text-purple-600 font-medium">Açaí</div>
                    </div>
                    <div className="text-center bg-white p-4 rounded-lg shadow-warm">
                      <div className="text-3xl font-bold text-orange-700 animate-pulse-warm">🐔 {estoque.pastelFrango}</div>
                      <div className="text-sm text-orange-600 font-medium">Frango c/ Catupiry</div>
                    </div>
                    <div className="text-center bg-white p-4 rounded-lg shadow-warm">
                      <div className="text-3xl font-bold text-red-700 animate-pulse-warm">🧀 {estoque.pastelQueijoPres}</div>
                      <div className="text-sm text-red-600 font-medium">Queijo e Presunto</div>
                    </div>
                    <div className="text-center bg-white p-4 rounded-lg shadow-warm">
                      <div className="text-3xl font-bold text-yellow-700 animate-pulse-warm">🧀 {estoque.pastelQueijo}</div>
                      <div className="text-sm text-yellow-600 font-medium">Queijo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Pedidos em Andamento</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {pedidos.length} pedidos
                  </Badge>
                </div>
              </div>

              {pedidos.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">
                      Nenhum pedido no momento
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pedidos.map((pedido) => (
                    <Card key={pedido.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              Pedido #{pedido.id} - {pedido.cliente}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm text-gray-600">{pedido.horario}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(pedido.status)} text-white`}>
                              {getStatusText(pedido.status)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerPedido(pedido.id)}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {pedido.itens.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold capitalize">
                                    {item.quantidade}x {item.tipo.replace(/-/g, ' ')}
                                  </h4>
                                  {item.complementos.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-600 mb-1">Complementos:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {item.complementos.map((complemento, i) => (
                                          <Badge key={i} variant="secondary" className="text-xs">
                                            {complemento}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          {pedido.status === 'recebido' && (
                            <Button
                              onClick={() => alterarStatusPedido(pedido.id, 'preparo')}
                              className="bg-yellow-500 hover:bg-yellow-600"
                              disabled={loading}
                            >
                              Iniciar Preparo
                            </Button>
                          )}
                          {pedido.status === 'preparo' && (
                            <Button
                              onClick={() => removerPedido(pedido.id)}
                              className="bg-green-500 hover:bg-green-600"
                              disabled={loading}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Finalizar Pedido
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba Financeiro */}
          <TabsContent value="financeiro">
            <div className="space-y-4">
              {/* Resumo de Vendas */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Clock className="w-5 h-5" />
                    Resumo de Vendas do Dia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{totalVendas.acai}</div>
                      <div className="text-sm text-blue-600">Açaí Vendidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{totalVendas.pastelFrango}</div>
                      <div className="text-sm text-blue-600">Frango c/ Catupiry</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{totalVendas.pastelQueijoPres}</div>
                      <div className="text-sm text-blue-600">Queijo e Presunto</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{totalVendas.pastelQueijo}</div>
                      <div className="text-sm text-blue-600">Queijo</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-800">
                        {totalVendas.pastelFrango + totalVendas.pastelQueijoPres + totalVendas.pastelQueijo}
                      </div>
                      <div className="text-sm text-blue-600">Total de Pastéis Vendidos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Vendas */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  {vendasHistorico.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-500">Nenhuma venda registrada ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {vendasHistorico.map((venda) => (
                        <div key={venda.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">Cliente: {venda.cliente}</h4>
                              <p className="text-sm text-gray-600">{venda.data}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {venda.itens.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.tipo}</span>
                                <span className="font-medium">{item.quantidade}x</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

