import { useState } from 'react';
import { Budget } from './api';


export function BudgetComponent({ budget }: { budget: Budget }) {
        const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    return (
        <tr onClick={() => setShowExpenseAccordion(true)}>
            <td>{budget.category}</td>
            <td>{budget.cost} :-</td>
            <td>
                {budget.expenses.reduce((total, expense) => total + expense.cost, 0)} :-
            </td>
            <td>{budget.result} :-</td>
        </tr>

    )
}
