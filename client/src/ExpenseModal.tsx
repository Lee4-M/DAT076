import { Modal, Button, Form } from 'react-bootstrap';
import { addExpense, Expense } from "./api";


// Define the types for the props
interface ExpenseModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: () => void;
}

function ExpenseModal({ show, handleClose, onSave}: ExpenseModalProps) {

    async function saveExpense() {
        const newExpense: Expense | undefined = await addExpense("test", 12, "test2");
        if (newExpense) {
            handleClose();
            onSave();
        } else {
            alert('Failed to add expense');
        }
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Expense Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter expense name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cost</Form.Label>
                        <Form.Control type="number" placeholder="Enter amount" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter description" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { handleClose() }}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveExpense}>Save Expense</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ExpenseModal;
