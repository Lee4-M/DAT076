import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import '../routes/App.css'
import { Budget, Expense, getExpenses } from '../api/api';
import { ExpenseAccordion } from './ExpenseAccordion';

export function BudgetRowComponent({ budget, deleteExpense, deleteBudget }: { budget: Budget, deleteBudget: (id: number) => void, deleteExpense: (id: number) => void }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const loadExpenses = useCallback(async () => {
        const expenses = await getExpenses(budget.id);
        setExpenses(expenses);
    }, []);
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

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
                    <Button variant='transparent' aria-label="Delete budget item" onClick={() => deleteBudget(budget.id)}>
                        <Image src="/images/delete-budget-item.png" alt="Icon 1" width="40" height="40" />
                    </Button>
                </td>
            </tr>

            {showExpenseAccordion && (
                <tr>
                    <td colSpan={4}>
                        <ExpenseAccordion
                            show={showExpenseAccordion}
                            expenses={{ ...expenses }}
                            handleClose={() => setShowExpenseAccordion(false)}
                            onDeleteExpense={deleteExpense}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
