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

    const [expenseName, setExpenseName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function fetchBudgets() {
            const fetchedBudgets = await getBudgets();
            setBudgets(fetchedBudgets);
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
            setExpenseName(''); 
        } else {
            setIsCustomCategory(false);
            setExpenseName(value);
        }
    }

    async function saveExpense() {
        const categoryToUse = isCustomCategory ? customCategory : expenseName;

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
        
        // if (!isNaN(expenseCost)) {
        //     alert('Please enter a number as the cost.');
        //     return;
        // }


        if (expenseName.length > 20 || description.length > 20 || cost.length > 20) {
            alert('Character limit of 20 exceeded.');
            return;
        }

        const newExpense: Expense | undefined = await addExpense(categoryToUse, expenseCost, description);
        if (newExpense) {
            handleClose();
            onSave();
            // Reset form fields
            setExpenseName('');
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
                <Form>
                <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            data-testid="category-select"
                            value={expenseName || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className={!expenseName ? "text-muted" : ""}
                        >
                            {!expenseName && (
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveExpense}>Save Expense</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ExpenseModal;
