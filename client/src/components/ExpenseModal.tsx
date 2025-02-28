import { Modal, Button, Form } from 'react-bootstrap';
import { addExpense, Expense } from "../api/api";
import { useState } from 'react';

// Define the types for the props
interface ExpenseModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}

function ExpenseModal({ show, handleClose, onSave }: ExpenseModalProps) {

    const [expenseName, setExpenseName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');

    async function saveExpense() {
        // Convert cost to a number
        const expenseCost = parseFloat(cost);
        if (!expenseName || isNaN(expenseCost) || !description) {
            alert('Please fill in all fields correctly.');
            return;
        }

        const newExpense: Expense | undefined = await addExpense(expenseName, expenseCost, description);
        if (newExpense) {
            handleClose();
            onSave();
            // Reset form fields
            setExpenseName('');
            setCost('');
            setDescription('');
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
                        <Form.Control
                            type="text"
                            placeholder="Enter expense category"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                        />
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
