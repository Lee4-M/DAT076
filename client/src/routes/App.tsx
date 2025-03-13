import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './App.css'
import { Budget, Expense, getBudgets, getExpenses, updateBudgetRows } from '../api/api';

import { Sidebar } from '../components/Sidebar'
import { BudgetTable } from '../components/BudgetTable'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editedBudgets, setEditedBudgets] = useState<Budget[]>(budgets);
  const [isEditing, setIsEditing] = useState(false);
  const [expenses, setExpenses] = useState<{ [budget_id: number]: Expense[] }>([]);

  const loadBudgets = useCallback(async () => {
    const budgets = await getBudgets();
    setBudgets(budgets);
  }, []);
  
  const loadExpenses = useCallback(async () => {
    if (budgets.length === 0) return;

    const expensesMap: { [budget_id: number]: Expense[] } = {};

    for (const budget of budgets) {
      const fetchedExpenses = await getExpenses(budget.id);
      expensesMap[budget.id] = fetchedExpenses;
    }

    setExpenses(expensesMap);
  }, [budgets]);

  async function handleSave() {
    setIsEditing(!isEditing);
    if(isEditing) {
      await updateBudgetRows(editedBudgets);
      await loadBudgets();
    }
  }

  async function handleUpdateBudget(id: number, category: string, amount: number) {
    setEditedBudgets(prevBudgets => 
      prevBudgets.map(budget => 
        budget.id === id ? { ...budget, category, amount } : budget
      )
    );
  }

  // Som onMount i Svelte, körs när komponenten renderas.
  // Inte helt säker om detta funkar som tänkt
  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  useEffect(() => {
    loadExpenses();
  }, [budgets, loadExpenses]);

  useEffect(() => {
    setEditedBudgets(budgets);
  }, [budgets]);


  return (
    <>
      <Container fluid className="bg-body-secondary h-100 w-100">
        <Row className='h-100'>
          <Col lg="3" className='p-3'><Sidebar loadBudgets={loadBudgets} expenses={expenses} budgets={budgets} isEditing={isEditing} onSave={handleSave}/></Col>
          <Col lg="9" className='p-3'><BudgetTable loadBudgets={loadBudgets} loadExpenses={loadExpenses} budgets={editedBudgets} expenses={expenses} isEditing={isEditing} onEdit={handleUpdateBudget} onSave={handleSave}/></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
