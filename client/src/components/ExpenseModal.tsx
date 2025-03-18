/**
 * ExpenseModal component renders a modal dialog that allows users to add a new expense to a budget.
 * 
 * Features:
 * - Displays a modal form to input expense details.
 * - Allows selecting a category from existing budgets or entering a custom category.
 * - Validates input fields (cost, category, description length).
 * - Submits the new expense and resets form fields.
 * 
 * @component
 * @param show - Determines whether the modal is visible or not.
 * @param handleClose - Function to close the modal.
 * @param onSave -Function to call when a new expense item is successfully added.
 */


import { Modal, Button, Form } from 'react-bootstrap';
import { addExpense, Expense, getBudgets } from "../api/api";
import { useState, useEffect } from 'react';
import { Budget } from '../api/api';

interface ExpenseModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}

function ExpenseModal({ show, handleClose, onSave }: ExpenseModalProps) {

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [customCategory, setCustomCategory] = useState<string>('');
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const [expenseCategory, setExpenseCategory] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function fetchBudgets() {
            const fetchedBudgets = await getBudgets();
            if (fetchedBudgets) {
                setBudgets(fetchedBudgets);
            } else {
                console.error("Failed to fetch budgets");
            }
        }

        if (show) {
            fetchBudgets();
            setIsCustomCategory(false);
            setCustomCategory('');
        }
    }, [show]);

    function handleCategoryChange(value: string) {
        if (value === "custom") {
            setIsCustomCategory(true);
            setExpenseCategory(''); 
        } else {
            setIsCustomCategory(false);
            setExpenseCategory(value);
        }
    }

    async function saveExpense(event?: React.FormEvent) {
        event?.preventDefault();
        const categoryToUse = isCustomCategory ? customCategory : expenseCategory;

        if (!categoryToUse) {
            alert('Please select a category.');
            return;
        }

        let expenseCost: number;

        if (cost === '') {
            alert('Please fill in a cost.');
            return;
        } else {
            expenseCost = parseFloat(cost);
            if (expenseCost < 0 || isNaN(expenseCost)) {
                alert('Please enter a positive number as the cost.');
                return;
            }
        }

        if (categoryToUse.length > 20) {
            alert('Character limit (20) for category exceeded.');
            return;
        }

        if (cost.length > 20) {
            alert('Character limit (20) for cost exceeded.');
            return;
        }

        if (description.length > 50) {
            alert('Character limit (50) for description exceeded.');
            return;
        }

        const newExpense: Expense | undefined = await addExpense(categoryToUse, expenseCost, description);
        if (newExpense) {
            handleClose();
            onSave();
            // Reset form fields
            setExpenseCategory('');
            setCustomCategory('');
            setCost('');
            setDescription('');
            setIsCustomCategory(false);
        } else {
            alert('Failed to add expense');
        }
    }

    return (
        <Modal data-testid="expense-modal" show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveExpense}>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            data-testid="category-select"
                            value={expenseCategory || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className={!expenseCategory ? "text-muted" : ""}
                        >
                            {!expenseCategory && (
                                <option value="" disabled hidden>
                                    Pick a category
                                </option>
                            )}
                            
                            {budgets.map((budget) => (
                                <option key={budget.category} value={budget.category}>
                                    {budget.category}
                                </option>
                            ))}
                            <option value="custom">Enter Manually</option>
                        </Form.Select>
                        {isCustomCategory && (
                            <Form.Control
                                type="text"
                                placeholder="Create new budget category"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                className="mt-2"
                            />
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cost</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Save Expense</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
            
        </Modal >
    );
}

export default ExpenseModal;
