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
    deleteBudget: (id: number) => void;  // Accept function
    budgetId: number; // Accept budget ID
}

export function ExpenseAccordion({ show, expenses, handleClose, loadExpenses , deleteBudget, budgetId}: ExpenseAccordionProps) {
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
                                <td style={{ padding: "0px", backgroundColor: "inherit", textAlign: "center" }}>
                                    {isEditing && (
                                        <img 
                                            src="/images/bin-svgrepo-com.svg" 
                                            alt="Delete" 
                                            width="20" 
                                            height="20" 
                                            style={{ cursor: "pointer" }} 
                                            onClick={() => removeExpense(expense.id)} 
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            )}

           
<div className="d-flex justify-content-between p-3">
                {/* Left-side buttons: Delete & Edit */}
                <div className="d-flex gap-2">
                    <button
                        onClick={() => {
                            deleteBudget(budgetId);
                            handleClose();
                        }}
                        className="delete-budget-btn"
                    >
                        <img src="/images/trash-delete-budget.svg" alt="Delete" width="15" height="15" />
                        Delete Budget
                    </button>

                    {expenses.length > 0 && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`edit-budget-btn ${isEditing ? "editing-mode" : ""}`}
                        >
                            <img src="/images/edit-budget.svg" alt="Edit" width="15" height="15" />
                            {isEditing ? "Done" : "Edit"}
                        </button>
                    )}
                </div>


                <button onClick={handleClose} className="close-budget-btn">
                    <img src="/images/arrow-up.svg" alt="Close" width="15" height="15" />
                    Close
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
