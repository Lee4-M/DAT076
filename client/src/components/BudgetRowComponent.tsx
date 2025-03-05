import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import '../routes/App.css'
import { Budget, deleteBudget, Expense } from '../api/api';
import { ExpenseAccordion } from './ExpenseAccordion';

interface BudgetRowComponentProps {
    budget: Budget;
    loadBudgets: () => void;
    expenses: Expense[];
    loadExpenses: () => void;
}

export function BudgetRowComponent({ budget, loadBudgets, expenses, loadExpenses }: BudgetRowComponentProps) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);

    async function removeBudget(id: number) {
        const success = await deleteBudget(id);
        if (success) {
            loadBudgets();
            console.log("Budget deleted");
        } else {
            console.log("Failed to delete budget");
        }
    }

    const handleOpenAccordion = () => {
        setShowExpenseAccordion(true);
    };

    return (
        <>
            <tr onClick={handleOpenAccordion}>
                <td>{budget.category}</td>
                <td>{budget.amount} :-</td>
                <td>{expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td>{budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td className='text-center col-1 ps-0'>
                    <Button variant='transparent' aria-label="Delete budget item" onClick={() => removeBudget(budget.id)}>
                        <Image src="/images/delete-budget-item.png" alt="Icon 1" width="40" height="40" />
                    </Button>
                </td>
            </tr>

            {showExpenseAccordion && (
                <tr>
                    <td colSpan={4}>
                        <ExpenseAccordion
                            show={showExpenseAccordion}
                            expenses={expenses}
                            handleClose={() => setShowExpenseAccordion(false)}
                            loadExpenses={loadExpenses}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
