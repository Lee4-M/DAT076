import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './App.css'
import { Budget, Expense, getBudgets, getExpenses, updateBudgetRow } from '../api/api';

import { Sidebar } from '../components/Sidebar'
import { BudgetTable } from '../components/BudgetTable'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editedBudgets, setEditedBudgets] = useState<Budget[]>(budgets);
  const [expenses, setExpenses] = useState<{ [budget_id: number]: Expense[] }>([]);

  const loadBudgets = useCallback(async () => {
    const budgets = await getBudgets();
    setBudgets(budgets);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  
  const loadExpenses = useCallback(async () => {
    if (budgets.length === 0) return;

    const expensesMap: { [budget_id: number]: Expense[] } = {};

    for (const budget of budgets) {
      const fetchedExpenses = await getExpenses(budget.id);
      expensesMap[budget.id] = fetchedExpenses;
    }

    setExpenses(expensesMap);
  }, [budgets]);

  async function updateBudgetCost(id: number, category: string, amount: number) {
    await updateBudgetRow(id, category, amount);

    budgets.map(budget => {
      if (budget.category === category) {
        budget.amount = amount; //Var budget.cost
      }
      loadBudgets();
      return budget;
    });    
  }

  // Som onMount i Svelte, körs när komponenten renderas.
  // Inte helt säker om detta funkar som tänkt
  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  useEffect(() => {
    loadExpenses();
  }, [budgets, loadExpenses]);

  return (
    <>
      <Container fluid className="bg-body-secondary h-100 w-100">
        <Row className='h-100'>
          <Col lg="3" className='p-3'><Sidebar loadBudgets={loadBudgets} expenses={expenses} editedBudgets={editedBudgets} setEditedBudgets={setEditedBudgets} isEditing={isEditing} setIsEditing={setIsEditing}/></Col>
          <Col lg="9" className='p-3'><BudgetTable loadBudgets={loadBudgets} loadExpenses={loadExpenses} budgets={editedBudgets} expenses={expenses} updateBudgetCost={updateBudgetCost} isEditing={isEditing}/></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
