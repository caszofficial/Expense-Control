import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useMonthlyTotals,
  useCategoryTotals,
} from './hooks/useApi';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { MonthlyChart } from './components/MonthlyChart';
import { CategoryChart } from './components/CategoryChart';
import { Filters } from './components/Filters';
import { Modal } from './components/Modal';
import { StatCard } from './components/StatCard';
import type { Expense, ExpenseFilters, CreateExpenseDTO } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Dashboard() {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const { data: monthlyTotals = [] } = useMonthlyTotals(6);
  const { data: categoryTotals = [] } = useCategoryTotals(
    filters.start_date,
    filters.end_date
  );

  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const handleSubmit = async (data: CreateExpenseDTO) => {
    try {
      if (editingExpense) {
        await updateMutation.mutateAsync({ id: editingExpense.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingExpense(undefined);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error al guardar el gasto');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error al eliminar el gasto');
    } finally {
      setDeletingId(undefined);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };
  console.log(expenses)

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const thisMonthTotal = monthlyTotals[0]?.total || 0;
  const lastMonthTotal = monthlyTotals[1]?.total || 0;
  const monthTrend = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                💰 Dashboard de Gastos
              </h1>
              <p className="text-gray-600 mt-1">
                Administra tus finanzas personales
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              ➕ Nuevo Gasto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Gastado"
            value={formatCurrency(totalExpenses)}
            icon="💵"
            trend={{
              value: Math.abs(monthTrend),
              isPositive: monthTrend < 0,
            }}
          />
          <StatCard
            title="Gastos Este Mes"
            value={formatCurrency(thisMonthTotal)}
            icon="📅"
          />
          <StatCard
            title="Promedio por Gasto"
            value={formatCurrency(avgExpense)}
            icon="📊"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Gastos por Mes
            </h2>
            <MonthlyChart data={monthlyTotals} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Gastos por Categoría
            </h2>
            <CategoryChart data={categoryTotals} />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Filters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Últimos Gastos ({expenses.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando gastos...</p>
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deletingId}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
