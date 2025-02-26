import './App.css';

import { Budget, getBudgets, delBudget } from './api';

import { Sidebar } from './Sidebar'
import { HelpSettings } from './HelpSettings'
import { BudgetTable } from './BudgetTable'

import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  async function loadBudgets() {
    const budgets = await getBudgets();
    setBudgets(budgets);
  }

  function addBudget(newBudget: Budget) {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
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
    //loadBudgets(); //TODO Uncommented as it re-rendered the table every millisecond, which is unnessesary? -Kev
  }, [loadBudgets]);

  return (
    <>
      <Container fluid className="bg-body-secondary h-100 w-100">
        <Row className='h-100'>
          <Col lg="3" className='p-3'><Sidebar addBudget={addBudget} loadBudgets={loadBudgets} budgets={budgets} /></Col>
          <Col lg="8" className='p-3'><BudgetTable budgets={budgets} deleteBudget={deleteBudget} /></Col>
          <Col lg="1" className='p-0'><HelpSettings /></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
