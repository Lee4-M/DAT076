import './App.css'
import { Budget, delExpense, getBudgets, delBudget } from './api';

import { Sidebar } from './Sidebar'
import { BudgetTable } from './BudgetTable'

import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MemoryRouter } from 'react-router';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  async function loadBudgets() {
    const budgets = await getBudgets();
    setBudgets(budgets);
  }

  // I believe it's better to pass setBudgets to respective components, and handle states there.
  // This way, we avoid code in App.tsx that is not directly related to the App component. -Liam
  function addBudget(newBudget: Budget) {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  }

  async function deleteExpense(id: string) {
    const success = await delExpense(id);
  
    if (success) {
      console.log("Expense deleted, reloading budgets...");
      await loadBudgets(); 
    } else {
      console.log("Failed to delete expense");
    }
  }
  
  async function deleteBudget(category: string) {
    const success = await delBudget(category);

    if (success) {
      setBudgets((prevBudgets) => prevBudgets.filter(budget => budget.category !== category));
      console.log("Budget deleted");
    } else {
      console.log("Failed to delete budget");
    }
  }

  // Som onMount i Svelte, körs när komponenten renderas.
  // Inte helt säker om detta funkar som tänkt
  useEffect(() => {
    // loadBudgets(); //TODO Uncommented as it re-rendered the table every millisecond, which is unnessesary? -Kev
  }, [loadBudgets]);

  return (
    <>
      <Container fluid className="bg-body-secondary h-100 w-100">
        <Row className='h-100'>
          <MemoryRouter>
            <Col lg="3" className='p-3'><Sidebar addBudget={addBudget} loadBudgets={loadBudgets} budgets={budgets}/></Col>
          </MemoryRouter>
          <Col lg="9" className='p-3'><BudgetTable budgets={budgets} deleteExpense={deleteExpense} deleteBudget={deleteBudget}/></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
