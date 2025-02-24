import { useState } from 'react';
import { Budget } from './api';
import { ExpenseAccordion } from './ExpenseAccordion';

export function BudgetComponent({ budget }: { budget: Budget }) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    const [expenses, setExpenses] = useState(budget.expenses); 

    const handleDeleteExpense = (expenseId: number) => {
        setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== expenseId));
    };

    return (
        <>
            <tr onClick={() => setShowExpenseAccordion(true)}>
                <td>{budget.category}</td>
                <td>{budget.cost} :-</td>
                <td>
                    {expenses.reduce((total, expense) => total + expense.cost, 0)} :-
                </td>
                <td>{budget.result} :-</td>
            </tr>

            {showExpenseAccordion && (
                <tr>
                    <td colSpan={4}>
                        <ExpenseAccordion
                            show={showExpenseAccordion}
                            budget={{ ...budget, expenses }}
                            handleClose={() => setShowExpenseAccordion(false)}
                            deleteExpense={handleDeleteExpense}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
