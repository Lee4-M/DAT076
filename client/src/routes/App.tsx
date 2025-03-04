import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './App.css'
import { Budget, delExpense, getBudgets, delBudget } from '../api/api';

import { Sidebar } from '../components/Sidebar'
import { BudgetTable } from '../components/BudgetTable'

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const loadBudgets = useCallback(async () => {
    const budgets = await getBudgets();
    setBudgets(budgets);
  }, []);

  // I believe it's better to pass setBudgets to respective components, and handle states there.
  // This way, we avoid code in App.tsx that is not directly related to the App component. -Liam
  function addBudget(newBudget: Budget) {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  }

  async function deleteExpense(id: number) {
    const success = await delExpense(id);

    if (success) {
      console.log("Expense deleted, reloading budgets...");
      await loadBudgets();
    } else {
      console.log("Failed to delete expense");
    }
  }

  async function deleteBudget(id: number) {
    const success = await delBudget(id);

    if (success) {
      setBudgets((prevBudgets) => prevBudgets.filter(budget => budget.id !== id));
      console.log("Budget deleted");
    } else {
      console.log("Failed to delete budget");
    }
  }

  // Som onMount i Svelte, körs när komponenten renderas.
  // Inte helt säker om detta funkar som tänkt
  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  return (
    <>
      <Container fluid className="bg-body-secondary h-100 w-100">
        <Row className='h-100'>
          <Col lg="3" className='p-3'><Sidebar addBudget={addBudget} loadBudgets={loadBudgets} budgets={budgets} /></Col>
          <Col lg="9" className='p-3'><BudgetTable budgets={budgets} deleteExpense={deleteExpense} deleteBudget={deleteBudget} /></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
