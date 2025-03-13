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
    isEditing: boolean;
    onEdit: (id: number, category: string, amount: number) => void;
    onSave: () => void;
}

export function BudgetRowComponent({ budget, loadBudgets, expenses, loadExpenses, isEditing, onEdit, onSave }: BudgetRowComponentProps) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);

    const handleChangeBudgetCost = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdit(budget.id, budget.category, Number(e.target.value));
    };

    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault
            onSave();
        }
    };
    
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
                <td>
                    {isEditing ? (
                        <input
                            type="number"
                            value={budget.amount}
                            onChange={handleChangeBudgetCost}
                            onKeyDown={handleSaveOnEnter}
                            autoFocus
                        />
                    ) : (
                         <span>{budget.amount} :-</span>
                    )}
                </td>
                <td>{expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td>{budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td className='text-center col-1 ps-0'>
                    <Button variant='transparent' aria-label="Delete budget item" onClick={() => removeBudget(budget.id)} >
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


