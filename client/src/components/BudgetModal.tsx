/**
 * BudgetItemModal component renders a modal dialog that allows users to add new budget.
 * 
 * Features:
 * - Includes form fields for entering a budget category and amount.
 * - Validates input fields.
 * - Displays alerts if validation fails.
 * - On successful submission, it triggers 'onSave', closes the modal and resets form. 
 *
 * @component
 * @param show - Determines whether the modal is visible or not.
 * @param handleClose - Function to call when the modal is closed.
 * @param onSave - Function to call when a new budget item is successfully added.
 */

import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addBudget, Budget } from "../api/api";

interface BudgetModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}

function BudgetItemModal({ show, handleClose, onSave }: BudgetModalProps) {
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number | ''>('');

    async function saveBudgetRow(event?: React.FormEvent) {
        event?.preventDefault();

        if (category.length > 20 || amount.toString().length > 20) {
            alert('Character limit of 20 exceeded.');
            return;
        }
        if (!category) {
            alert('Please fill in a category name.');
            return;
        }

        const newBudgetItem: Budget | undefined = await addBudget(category, Number(amount));

        if (newBudgetItem) {
            onSave();
            handleClose();
            setCategory('');
            setAmount('');
        } else {
            alert('Failed to add budget');
        }
    }

    return (
        <Modal data-testid="budget-modal" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Budget Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveBudgetRow}>
                    <Form.Group className="mb-3">
                        <Form.Label>Budget Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter category name"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Save Budget</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>

        </Modal>
    );
}

export default BudgetItemModal;
