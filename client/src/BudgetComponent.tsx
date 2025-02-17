import { Budget } from './api';

export function BudgetComponent({ budget }: { budget: Budget }) {
    return (
        <tr>
            <td>{budget.category}</td>
            <td>{budget.cost} :-</td>
            <td>
                {budget.expenses.reduce((total, expense) => total + expense.cost, 0)} :-
            </td>
            <td>{budget.result} :-</td>
        </tr>
    )
}

