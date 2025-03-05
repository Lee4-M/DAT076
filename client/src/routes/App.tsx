import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './App.css'
import { Budget, Expense, getBudgets, getExpenses } from '../api/api';

import { Sidebar } from '../components/Sidebar'
import { BudgetTable } from '../components/BudgetTable'

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
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
          <Col lg="3" className='p-3'><Sidebar budgets={budgets} loadBudgets={loadBudgets} /></Col>
          <Col lg="9" className='p-3'><BudgetTable budgets={budgets} loadBudgets={loadBudgets} expenses={expenses} /></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
