import { Table } from "react-bootstrap";
import { Expense } from "../api/api";
import '../routes/App.css'

interface ExpenseAccordionProps {
    show: boolean;
    handleClose: () => void;
    expenses: Expense[];
    onDeleteExpense: (id: number) => void;
}

export function ExpenseAccordion({ show, expenses, handleClose, onDeleteExpense }: ExpenseAccordionProps) {
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
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{expense.cost} :-</td>
                            <td>{expense.description}</td>
                            <td>
                                <button onClick={() => onDeleteExpense(expense.id)} className="btn btn-danger">
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
