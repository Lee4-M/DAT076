import { Table } from "react-bootstrap";
import { deleteExpense, Expense } from "../api/api";
import '../routes/App.css'

interface ExpenseAccordionProps {
    show: boolean;
    handleClose: () => void;
    expenses: Expense[];
}

export function ExpenseAccordion({ show, expenses, handleClose }: ExpenseAccordionProps) {
    if (!show) return null;

    async function removeExpense(id: number) {
        const success = await deleteExpense(id);

        if (success) {
            console.log("Expense deleted, reloading budgets...");
        } else {
            console.log("Failed to delete expense");
        }
    }
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
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td>{expense.cost} :-</td>
                            <td>{expense.description}</td>
                            <td>
                                <button onClick={() => removeExpense(expense.id)} className="btn btn-danger">
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
