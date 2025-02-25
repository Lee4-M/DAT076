import { useState } from 'react';
import { Budget } from './api';
import { ExpenseAccordion } from './ExpenseAccordion';
import './App.css';


export function BudgetComponent({ budget, deleteExpense }: { budget: Budget, deleteExpense: (id: string) => void }) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    const [expenses, setExpenses] = useState(budget.expenses); 

    //const handleDeleteExpense = async (id: string) => {
    //    try {
    //        await deleteExpense(id);
    //        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id)); // Safely update state
    //    } catch (error) {
    //        console.error("Failed to delete expense", error);
    //    }
    //};

    const handleDeleteExpense = async (id: string) => {
        deleteExpense(id);
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    }

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
                            onDeleteExpense={handleDeleteExpense} // Pass delete function
                        />
                    </td>
                </tr>
            )}
        </>
    );
}
