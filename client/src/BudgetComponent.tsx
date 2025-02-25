import { Budget } from './api';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

export function BudgetComponent({ budget, deleteBudget }: { budget: Budget, deleteBudget: (category: string) => void }) {
    return (
        <tr>
            <td>{budget.category}</td>
            <td>{budget.cost} :-</td>
            <td>
                {budget.expenses.reduce((total, expense) => total + expense.cost, 0)} :-
            </td>
            <td>{budget.result} :-</td>
            <td className='text-center col-1 ps-0'>
                <Button variant='transparent' aria-label="Delete budget item" onClick={() => deleteBudget(budget.category)}>
                    <Image src="/images/delete-budget-item.png" alt="Icon 1" width="40" height="40" />
                </Button>
            </td>
        </tr>
    )
}

