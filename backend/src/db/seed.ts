import pool from './pool';

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const categories = [
      { name: 'Alimentación', color: '#10b981' },
      { name: 'Transporte', color: '#3b82f6' },
      { name: 'Entretenimiento', color: '#8b5cf6' },
      { name: 'Salud', color: '#ef4444' },
      { name: 'Servicios', color: '#f59e0b' },
      { name: 'Educación', color: '#06b6d4' },
      { name: 'Compras', color: '#ec4899' },
      { name: 'Otros', color: '#6b7280' },
    ];

    console.log('📦 Inserting categories...');
    for (const cat of categories) {
      await client.query(
        'INSERT INTO categories (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [cat.name, cat.color]
      );
    }

    const { rows: categoryRows } = await client.query('SELECT id, name FROM categories');
    const categoryMap = categoryRows.reduce((acc, row) => {
      acc[row.name] = row.id;
      return acc;
    }, {} as Record<string, number>);

    console.log('💰 Inserting sample expenses...');
    const expenses = [

      { description: 'Supermercado Éxito', amount: 85000, category: 'Alimentación', daysAgo: 2 },
      { description: 'Uber a reunión', amount: 12000, category: 'Transporte', daysAgo: 3 },
      { description: 'Netflix suscripción', amount: 42000, category: 'Entretenimiento', daysAgo: 5 },
      { description: 'Farmacia Cruz Verde', amount: 35000, category: 'Salud', daysAgo: 7 },
      { description: 'Restaurante', amount: 65000, category: 'Alimentación', daysAgo: 8 },
      { description: 'Gasolina', amount: 120000, category: 'Transporte', daysAgo: 10 },

      { description: 'Supermercado Carulla', amount: 150000, category: 'Alimentación', daysAgo: 35 },
      { description: 'Cine con amigos', amount: 45000, category: 'Entretenimiento', daysAgo: 38 },
      { description: 'Consulta médica', amount: 80000, category: 'Salud', daysAgo: 40 },
      { description: 'Internet + TV', amount: 95000, category: 'Servicios', daysAgo: 42 },
      { description: 'Curso online Udemy', amount: 120000, category: 'Educación', daysAgo: 45 },
      { description: 'Ropa nueva', amount: 180000, category: 'Compras', daysAgo: 48 },
      { description: 'Gasolina', amount: 115000, category: 'Transporte', daysAgo: 50 },

      { description: 'Mercado mensual', amount: 200000, category: 'Alimentación', daysAgo: 65 },
      { description: 'Spotify Premium', amount: 18000, category: 'Entretenimiento', daysAgo: 68 },
      { description: 'Seguro médico', amount: 150000, category: 'Salud', daysAgo: 70 },
      { description: 'Servicios públicos', amount: 135000, category: 'Servicios', daysAgo: 72 },
      { description: 'Libros técnicos', amount: 95000, category: 'Educación', daysAgo: 75 },
    ];

    for (const expense of expenses) {
      const date = new Date();
      date.setDate(date.getDate() - expense.daysAgo);
      
      await client.query(
        'INSERT INTO expenses (description, amount, category_id, date) VALUES ($1, $2, $3, $4)',
        [expense.description, expense.amount, categoryMap[expense.category], date.toISOString().split('T')[0]]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Seed data inserted successfully!');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${expenses.length} expenses`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedData();
