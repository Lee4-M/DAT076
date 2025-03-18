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
    const [isEditing, setIsEditing] = useState(false);
    const [expenses, setExpenses] = useState<{ [budget_id: number]: Expense[] }>([]);

    const loadBudgets = useCallback(async () => {
        const budgets = await getBudgets();
        if (budgets) {
            setBudgets(budgets);
        } else {
            console.error("Failed to fetch budgets");
        }
    }, []);

    const loadExpenses = useCallback(async () => {
        if (budgets.length === 0) return;

        const expensesMap: { [budget_id: number]: Expense[] } = {};

        for (const budget of budgets) {
            const fetchedExpenses = await getExpenses(budget.id);
            expensesMap[budget.id] = fetchedExpenses || [];
        }

        setExpenses(expensesMap);
    }, [budgets]);

    async function handleSaveBudgetRows() {
        setIsEditing(!isEditing);
        if (isEditing) {
            for (const budget of editedBudgets) {
                await updateBudgetRow(budget.id, budget.category, budget.amount);
            }
            await loadBudgets();
        }
    }

    async function handleChangeBudgets(id: number, changes: Partial<Budget>) {
        setEditedBudgets(prevBudgets =>
            prevBudgets.map(budget =>
                budget.id === id ? { ...budget, ...changes } : budget
            )
        );
    }

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
                    <Col lg="3" className='p-3'><Sidebar loadBudgets={loadBudgets} expenses={expenses} budgets={budgets} isEditing={isEditing} handleSaveBudgetRows={handleSaveBudgetRows} /></Col>
                    <Col lg="9" className='p-3'><BudgetTable budgets={editedBudgets} expenses={expenses} isEditing={isEditing} loadBudgets={loadBudgets} loadExpenses={loadExpenses} handleChangeBudgets={handleChangeBudgets} handleSaveBudgetRows={handleSaveBudgetRows} /></Col>
                </Row>
            </Container>
        </>
    )
}

export default App