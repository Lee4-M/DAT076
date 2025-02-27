import { useEffect, useState } from 'react';
import { Budget } from './api';
import { ExpenseAccordion } from './ExpenseAccordion';
import './App.css';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

export function BudgetComponent({ budget, deleteExpense, deleteBudget }: { budget: Budget, deleteBudget: (category: string) => void, deleteExpense : (id: string) => void }) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    const [expenses, setExpenses] = useState(budget.expenses);

    useEffect(() => {
        setExpenses(budget.expenses);
    }, [budget.expenses]); 

    const handleOpenAccordion = () => {
        setShowExpenseAccordion(true);
    };

    return (
        <>
            <tr onClick={handleOpenAccordion}>
                <td>{budget.category}</td>
                <td>{budget.cost} :-</td>
                <td>{budget.expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td>{budget.result} :-</td>
                <td className='text-center col-1 ps-0'>
                    <Button variant='transparent' aria-label="Delete budget item" onClick={() => deleteBudget(budget.category)}>
                        <Image src="/images/delete-budget-item.png" alt="Icon 1" width="40" height="40" />
                    </Button>
                </td>
            </tr>

            {showExpenseAccordion && (
                <tr>
                    <td colSpan={4}>
                        <ExpenseAccordion
                            show={showExpenseAccordion}
                            budget={{ ...budget, expenses }}
                            handleClose={() => setShowExpenseAccordion(false)}
                            onDeleteExpense={deleteExpense}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
