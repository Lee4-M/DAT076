import { useEffect, useState } from 'react';
import { Budget } from './api';
import { ExpenseAccordion } from './ExpenseAccordion';
import './App.css';

export function BudgetComponent({ budget, deleteExpense }: { budget: Budget, deleteExpense: (id: string) => void }) {
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
                <td>{expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td>{budget.result} :-</td>
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
