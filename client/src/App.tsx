import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { Budget, delExpense, getBudgets } from './api';
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

  async function deleteExpense(id: string) {
    const success = await delExpense(id);

    if (success) {
      loadBudgets();
    } //TODO fix this error handling
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
          <Col lg="2" className='p-3'><Sidebar addBudget={addBudget} loadBudgets={loadBudgets} /></Col>
          <Col lg="9" className='p-3'><BudgetTable budgets={budgets} /></Col>
          <Col lg="1" className='p-0'><HelpSettings /></Col>
        </Row>
      </Container>
    </>
  )
}

export default App
