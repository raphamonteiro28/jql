import React, { useState, useEffect } from 'react';
import { useJira } from '../contexts/JiraContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Users, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Analytics() {
  const { isConnected, executeQuery, lastResults, lastQuery } = useJira();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChart, setSelectedChart] = useState('status');
  const [timeRange, setTimeRange] = useState('30d');
  const [useCurrentData, setUseCurrentData] = useState(true);

  // Processar dados automaticamente quando disponíveis
  useEffect(() => {
    if (useCurrentData && lastResults && lastResults.issues && lastResults.issues.length > 0) {
      const processedData = processDataForCharts(lastResults.issues);
      setAnalyticsData(processedData);
    }
  }, [lastResults, useCurrentData]);

  // Função para buscar dados para análise
  const fetchAnalyticsData = async () => {
    if (!isConnected) {
      toast.error('Conecte-se ao Jira primeiro');
      return;
    }

    setIsLoading(true);
    try {
      // Buscar dados dos últimos 30 dias por padrão
      const timeFilter = getTimeFilter(timeRange);
      const query = `created >= ${timeFilter} ORDER BY created DESC`;
      
      const result = await executeQuery(query, {
        maxResults: 1000,
        startAt: 0,
        fields: ['summary', 'status', 'assignee', 'created', 'updated', 'priority', 'project', 'issuetype']
      });

      if (result && result.issues) {
        const processedData = processDataForCharts(result.issues);
        setAnalyticsData(processedData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados para análise:', error);
      toast.error('Erro ao carregar dados para análise');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter filtro de tempo
  const getTimeFilter = (range) => {
    switch (range) {
      case '7d': return '-7d';
      case '30d': return '-30d';
      case '90d': return '-90d';
      case '1y': return '-365d';
      default: return '-30d';
    }
  };

  // Função para agrupar status em categorias KPI
  const getStatusKPICategory = (statusName) => {
    const status = statusName?.toLowerCase() || '';
    
    // Concluído e Aguardando Liberação = mesmo grupo
    if (status.includes('concluído') || status.includes('concluido') || 
        status.includes('aguardando liberação') || status.includes('aguardando liberacao') ||
        status.includes('done') || status.includes('closed')) {
      return 'Concluído/Aguardando Liberação';
    }
    
    // Teste rejeitado e Bloqueado = mesmo grupo
    if (status.includes('teste rejeitado') || status.includes('bloqueado teste') ||
        status.includes('bloqueado') || status.includes('rejected')) {
      return 'Teste Rejeitado/Bloqueado';
    }
    
    // Aberto = categoria própria
    if (status.includes('aberto') || status.includes('open') || status.includes('todo')) {
      return 'Aberto';
    }
    
    // Em andamento = categoria própria
    if (status.includes('progress') || status.includes('development') || status.includes('em andamento')) {
      return 'Em Andamento';
    }
    
    // Outros status mantêm nome original
    return statusName || 'Sem status';
  };

  // Função para processar dados para gráficos
  const processDataForCharts = (issues) => {
    const statusCount = {};
    const statusKPICount = {}; // Nova contagem agrupada para KPIs
    const priorityCount = {};
    const assigneeCount = {};
    const projectCount = {};
    const issueTypeCount = {};
    const createdByDay = {};

    issues.forEach(issue => {
      // Contagem por status original
      const status = issue.fields.status?.name || 'Sem status';
      statusCount[status] = (statusCount[status] || 0) + 1;

      // Contagem por status agrupado para KPIs
      const statusKPI = getStatusKPICategory(status);
      statusKPICount[statusKPI] = (statusKPICount[statusKPI] || 0) + 1;

      // Contagem por prioridade
      const priority = issue.fields.priority?.name || 'Sem prioridade';
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;

      // Contagem por assignee
      const assignee = issue.fields.assignee?.displayName || 'Não atribuído';
      assigneeCount[assignee] = (assigneeCount[assignee] || 0) + 1;

      // Contagem por projeto
      const project = issue.fields.project?.name || 'Sem projeto';
      projectCount[project] = (projectCount[project] || 0) + 1;

      // Contagem por tipo de issue
      const issueType = issue.fields.issuetype?.name || 'Sem tipo';
      issueTypeCount[issueType] = (issueTypeCount[issueType] || 0) + 1;

      // Contagem por dia de criação
      if (issue.fields.created) {
        const date = new Date(issue.fields.created).toLocaleDateString('pt-BR');
        createdByDay[date] = (createdByDay[date] || 0) + 1;
      }
    });

    return {
      statusCount,
      statusKPICount, // Nova propriedade com status agrupados
      priorityCount,
      assigneeCount,
      projectCount,
      issueTypeCount,
      createdByDay,
      totalIssues: issues.length
    };
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    if (isConnected) {
      fetchAnalyticsData();
    }
  }, [isConnected, timeRange]);

  // Função para obter cor do status KPI agrupado
  const getStatusKPIColor = (statusKPIName) => {
    switch (statusKPIName) {
      case 'Concluído/Aguardando Liberação':
        return '#10B981'; // Verde
      case 'Teste Rejeitado/Bloqueado':
        return '#EF4444'; // Vermelho
      case 'Aberto':
        return '#6B7280'; // Cinza
      case 'Em Andamento':
        return '#3B82F6'; // Azul
      default:
        return '#F59E0B'; // Amarelo para outros
    }
  };

  // Função para obter cor do status original (mantida para compatibilidade)
  const getStatusColor = (statusName) => {
    const status = statusName?.toLowerCase() || '';
    
    // Status verdes: Concluído, Aguardando liberação
    if (status.includes('concluído') || status.includes('concluido') || 
        status.includes('aguardando liberação') || status.includes('aguardando liberacao') ||
        status.includes('done') || status.includes('closed')) {
      return '#10B981'; // Verde
    }
    
    // Status vermelhos: Cancelado, Rejeitado, Teste rejeitado, Bloqueado teste
    if (status.includes('cancelado') || status.includes('rejeitado') ||
        status.includes('teste rejeitado') || status.includes('bloqueado teste') ||
        status.includes('cancelled') || status.includes('rejected')) {
      return '#EF4444'; // Vermelho
    }
    
    // Status cinza: Aberto
    if (status.includes('aberto') || status.includes('open') || status.includes('todo')) {
      return '#6B7280'; // Cinza
    }
    
    // Status azul para progresso/desenvolvimento
    if (status.includes('progress') || status.includes('development') || status.includes('em andamento')) {
      return '#3B82F6'; // Azul
    }
    
    // Padrão amarelo para outros status
    return '#F59E0B'; // Amarelo
  };

  // Função para obter cor da prioridade
  const getPriorityColor = (priorityName) => {
    const priority = priorityName?.toLowerCase() || '';
    if (priority.includes('highest') || priority.includes('critical')) return '#EF4444'; // Vermelho
    if (priority.includes('high')) return '#F97316'; // Laranja
    if (priority.includes('medium')) return '#F59E0B'; // Amarelo
    if (priority.includes('low')) return '#10B981'; // Verde
    return '#6B7280'; // Cinza padrão
  };

  // Configurações dos gráficos
  const getChartData = () => {
    if (!analyticsData) return null;

    const colors = {
      primary: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16']
    };

    switch (selectedChart) {
      case 'status':
        const statusKPILabels = Object.keys(analyticsData.statusKPICount);
        const statusKPIData = Object.values(analyticsData.statusKPICount);
        const statusKPIColors = statusKPILabels.map(label => getStatusKPIColor(label));
        
        return {
          labels: statusKPILabels,
          datasets: [{
            label: 'Tarefas por status (KPI)',
            data: statusKPIData,
            backgroundColor: statusKPIColors,
            borderColor: statusKPIColors.map(color => color + '80'),
            borderWidth: 1
          }]
        };

      case 'status-detailed':
        const statusLabels = Object.keys(analyticsData.statusCount);
        const statusData = Object.values(analyticsData.statusCount);
        const statusColors = statusLabels.map(label => getStatusColor(label));
        
        return {
          labels: statusLabels,
          datasets: [{
            label: 'Tarefas por status (detalhado)',
            data: statusData,
            backgroundColor: statusColors,
            borderColor: statusColors.map(color => color + '80'),
            borderWidth: 1
          }]
        };

      case 'priority':
        const priorityLabels = Object.keys(analyticsData.priorityCount);
        const priorityData = Object.values(analyticsData.priorityCount);
        const priorityColors = priorityLabels.map(label => getPriorityColor(label));
        
        return {
          labels: priorityLabels,
          datasets: [{
            label: 'Issues por prioridade',
            data: priorityData,
            backgroundColor: priorityColors,
            borderColor: priorityColors.map(color => color + '80'),
            borderWidth: 1
          }]
        };

      case 'assignee':
        const assigneeData = Object.entries(analyticsData.assigneeCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10); // Top 10 assignees
        
        return {
          labels: assigneeData.map(([name]) => name),
          datasets: [{
            label: 'Tickets por responsável',
            data: assigneeData.map(([,count]) => count),
            backgroundColor: colors.primary,
            borderColor: colors.primary.map(color => color + '80'),
            borderWidth: 1
          }]
        };

      case 'timeline':
        const timelineData = Object.entries(analyticsData.createdByDay)
          .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')))
          .slice(-30); // Últimos 30 dias
        
        return {
          labels: timelineData.map(([date]) => date),
          datasets: [{
            label: 'Tarefas criadas por dia',
            data: timelineData.map(([,count]) => count),
            borderColor: '#3B82F6',
            backgroundColor: '#3B82F680',
            tension: 0.1,
            fill: true
          }]
        };

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case 'status': return 'KPIs por Status (Agrupado)';
      case 'status-detailed': return 'Distribuição por Status (Detalhado)';
      case 'priority': return 'Distribuição por prioridade';
      case 'assignee': return 'Top 10 usuários';
      case 'timeline': return 'Tarefas criadas ao longo do tempo';
      default: return 'Análise de dados';
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: getChartTitle()
      },
    },
    scales: selectedChart === 'timeline' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    } : {
      y: {
        beginAtZero: true
      }
    }
  };

  const renderChart = () => {
    const data = getChartData();
    if (!data) return null;

    switch (selectedChart) {
      case 'status':
      case 'priority':
        return <Pie data={data} options={chartOptions} />;
      case 'assignee':
        return <Bar data={data} options={chartOptions} />;
      case 'timeline':
        return <Line data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center space-y-4">
        <div className="alert-warning">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              Você precisa estar conectado ao Jira para visualizar análises
            </span>
          </div>
        </div>
        <p className="text-secondary-600">
          Configure sua conexão nas configurações para começar a analisar seus dados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-secondary-900">
          Análise de Dados JQL
        </h1>
        <p className="text-secondary-600">
          Visualize insights e estatísticas dos seus dados do Jira
        </p>
      </div>

      {/* Data Source Toggle */}
      {lastResults && lastResults.issues && lastResults.issues.length > 0 && (
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-secondary-700">Fonte dos Dados:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setUseCurrentData(true)}
                    className={`btn text-sm ${
                      useCurrentData ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    Usar Dados Atuais
                  </button>
                  <button
                    onClick={() => setUseCurrentData(false)}
                    className={`btn text-sm ${
                      !useCurrentData ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    Buscar Novos Dados
                  </button>
                </div>
              </div>
              {useCurrentData && lastQuery && (
                <div className="text-sm text-secondary-600">
                  <span className="font-medium">Consulta atual:</span> {lastQuery.length > 50 ? lastQuery.substring(0, 50) + '...' : lastQuery}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-secondary-700">Tipo de Gráfico:</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedChart('status')}
                  className={`btn text-sm flex items-center space-x-1 ${
                    selectedChart === 'status' ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Status KPI</span>
                </button>
                <button
                  onClick={() => setSelectedChart('status-detailed')}
                  className={`btn text-sm flex items-center space-x-1 ${
                    selectedChart === 'status-detailed' ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Status Detalhado</span>
                </button>
                <button
                  onClick={() => setSelectedChart('priority')}
                  className={`btn text-sm flex items-center space-x-1 ${
                    selectedChart === 'priority' ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Prioridade</span>
                </button>
                <button
                  onClick={() => setSelectedChart('assignee')}
                  className={`btn text-sm flex items-center space-x-1 ${
                    selectedChart === 'assignee' ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Assignees</span>
                </button>
                <button
                  onClick={() => setSelectedChart('timeline')}
                  className={`btn text-sm flex items-center space-x-1 ${
                    selectedChart === 'timeline' ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-secondary-700">Período:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input text-sm"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => {
                if (useCurrentData && lastResults) {
                  const processedData = processDataForCharts(lastResults.issues);
                  setAnalyticsData(processedData);
                } else {
                  fetchAnalyticsData();
                }
              }}
              disabled={isLoading}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{useCurrentData ? 'Reprocessar' : 'Atualizar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Total de Issues</p>
                  <p className="text-2xl font-bold text-secondary-900">{analyticsData.totalIssues}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Status Únicos</p>
                  <p className="text-2xl font-bold text-secondary-900">{Object.keys(analyticsData.statusCount).length}</p>
                </div>
                <PieChart className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Assignees</p>
                  <p className="text-2xl font-bold text-secondary-900">{Object.keys(analyticsData.assigneeCount).length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Projetos</p>
                  <p className="text-2xl font-bold text-secondary-900">{Object.keys(analyticsData.projectCount).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">
            {getChartTitle()}
          </h2>
        </div>
        <div className="card-content">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-secondary-600">Carregando dados...</span>
            </div>
          ) : analyticsData ? (
            <div className="h-96">
              {renderChart()}
            </div>
          ) : (
            <div className="text-center py-12 text-secondary-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {lastResults && lastResults.issues && lastResults.issues.length > 0 ? (
                <div>
                  <p>Dados disponíveis da última consulta!</p>
                  <p className="text-sm mt-2">Clique em "Usar Dados Atuais" para visualizar os gráficos.</p>
                </div>
              ) : (
                <div>
                  <p>Nenhum dado disponível para análise.</p>
                  <p className="text-sm mt-2">Execute algumas consultas JQL primeiro na aba "Consultas".</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;