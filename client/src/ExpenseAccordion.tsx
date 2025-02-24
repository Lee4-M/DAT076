import { Budget } from "./api";
import { Table } from "react-bootstrap";
import './App.css'

interface ExpenseAccordionProps {
    show: boolean;
    handleClose: () => void;
    deleteExpense: (expenseId: number) => void;
    budget: Budget;
}

export function ExpenseAccordion({ show, budget, handleClose, deleteExpense }: ExpenseAccordionProps) {
    if (!show) return null;

    return (
        <section>
            <Table striped bordered hover className="p-2 table-striped text-center">
                <thead>
                    <tr>
                        <th>Cost</th>
                        <th>Description</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {budget.expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{expense.cost} :-</td>
                            <td>{expense.description}</td>
                            <td>
                                <button onClick={() => deleteExpense(expense.id)} className="btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <button onClick={handleClose} className="btn btn-primary">Close</button>
        </section>
    );
}

export default ExpenseAccordion;
