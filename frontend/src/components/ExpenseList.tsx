import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  isDeleting?: number;
}

export const ExpenseList = ({ expenses, onEdit, onDelete, isDeleting }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">💰</div>
        <p className="text-gray-500 text-lg">No hay gastos registrados</p>
        <p className="text-gray-400 text-sm mt-2">Crea tu primer gasto para comenzar</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {expense.category_color && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: expense.category_color }}
                  />
                )}
                <h3 className="font-semibold text-gray-900">{expense.description}</h3>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  📅 {format(new Date(expense.date), 'dd MMM yyyy', { locale: es })}
                </span>
                {expense.category_name && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    {expense.category_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  disabled={isDeleting === expense.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {isDeleting === expense.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
