import { Table } from "react-bootstrap";
import { deleteExpense, Expense} from "../api/api";
import '../routes/App.css';
import { useState } from "react";
import ExpenseModal from "./ExpenseModal";


interface ExpenseAccordionProps {
    show: boolean;
    handleClose: () => void;
    expenses: Expense[];
    loadExpenses: () => void;
}

export function ExpenseAccordion({ show, expenses, handleClose, loadExpenses }: ExpenseAccordionProps) {
    if (!show) return null;

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    async function removeExpense(id: number) {
        const success = await deleteExpense(id);
        if (success) {
            console.log("Expense deleted, reloading expenses...");
            loadExpenses();
        } else {
            console.log("Failed to delete expense");
        }
    }

    return (
        <section>
            <h5 className="text-left mb-3">Expenses</h5>
            {expenses.length === 0 ? (
                // If there are no expenses
                <div className="text-center p-3">
                    <p>No expenses available</p>
                    <button onClick={() => setShowExpenseModal(true)} className=" expense-row-btn ">
                        Add Expense +
                    </button>
                </div>
            ) : (
                // Show when there are existing expenses
                <Table className="p-2 expense-table">
                    <thead>
                        <tr>
                            <th>Cost</th>
                            <th>Description</th>

                        </tr>
                    </thead>
                    <tbody>
                    {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{expense.cost} :-</td>
                                <td>{expense.description}</td>
                                {isEditing && (
                                    <td style={{ padding: "0px", backgroundColor: "inherit", textAlign: "center" }}>
                                    <img 
                                        src="/images/bin-svgrepo-com.svg" 
                                        alt="Delete" 
                                        width="20" 
                                        height="20" 
                                        style={{ cursor: "pointer"}} 
                                        onClick={() => removeExpense(expense.id)} 
                                    />
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="d-flex justify-content-between p-3">
                <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="btn expense-row-btn"
                >
                    {isEditing ? "Done" : "Edit"}
                </button>
                
            </div>

            <ExpenseModal 
                show={showExpenseModal} 
                handleClose={() => setShowExpenseModal(false)} 
                onSave={() => {
                    setShowExpenseModal(false);
                    loadExpenses();
                }} 
            />
        </section>
    );
}

export default ExpenseAccordion;
