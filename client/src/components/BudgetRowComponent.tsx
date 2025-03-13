import { useState } from 'react';

import '../routes/App.css'
import { Budget, deleteBudget, Expense } from '../api/api';
import { ExpenseAccordion } from './ExpenseAccordion';

//Annelie

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
        setShowExpenseAccordion((prev) => !prev);
    };

    return (
        <>
            <tr className="budget-row hovering" onClick={handleOpenAccordion}>
                <td>{budget.category}</td>
                <td>{budget.amount} :-</td>
                <td>{expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td 
                    style={{ color: (budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)) < 0 ? 'red' : 'black' }}
                >
                    {budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)} :-
                </td>
                <td className='text-center col-1 ps-0'>
                <img 
                    src={showExpenseAccordion ? "/images/arrow-down.svg" : "/images/arrow-left.svg"} 
                    alt="Toggle Arrow" 
                    width="15" 
                    height="15" 
                    style={{ display: "block", margin: "auto" }}
                />
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
                            deleteBudget={removeBudget}
                            budgetId={budget.id}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
