import { Budget } from "./api";
import { Table } from "react-bootstrap";
import './App.css'

interface ExpenseAccordionProps {
    show: boolean;
    handleClose: () => void;
    budget: Budget;
    onDeleteExpense: (id: string) => void;
}

export function ExpenseAccordion({ show, budget, handleClose, onDeleteExpense }: ExpenseAccordionProps) {
    if (!show) return null;

    const handleDelete = async (id: string) => {
        onDeleteExpense(id);
    };

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
                                <button onClick={() => handleDelete(expense.id)} className="btn btn-danger">
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
