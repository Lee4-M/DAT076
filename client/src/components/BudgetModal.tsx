import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addBudget, Budget } from "../api/api";
// //Annelie

interface BudgetModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}

function BudgetItemModal({ show, handleClose, onSave }: BudgetModalProps) {
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number | ''>('');

    async function saveBudgetRow() {
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
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Budget Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter category name" value={category}
                            onChange={(e) => setCategory(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Enter amount" value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { handleClose() }}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveBudgetRow}>Save Budget</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BudgetItemModal;
