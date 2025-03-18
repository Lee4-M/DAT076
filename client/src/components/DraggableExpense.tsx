/**
 * DraggableExpense component renders a draggable table row representing a single expense. 
 * 
 * Features: 
 * - Supports drag and drop with @dnd-kit/core
 * - Allows in line editing of cost and description fields when 'isEditing' is true
 * - Handles changes to expenses and saves on Enter. 
 * - Displays a delete icon to remove expenses in editing mode.
 * 
 * @component
 * @param expense - The expense object to display and edit. 
 * @param editedExpenses - Array of currently edited expenses to track input changes. 
 * @param isEditing - Boolean that toggles edit mode. 
 * @param handleChangeExpenses - Function to handle changes to expenses to track input changes. 
 * @param handleSaveExpenses - Function to save all expenses on Enter.
 * @param handleDeleteExpense - Function to delete expenses. 
 * 
 */
import { useDraggable } from "@dnd-kit/core";
import { Expense } from "../api/api";
import { useRef, useState } from "react";

interface DraggableExpenseProps {
    expense: Expense;
    editedExpenses: Expense[];
    isEditing: boolean;
    handleChangeExpenses: (id: number, changes: Partial<Expense>) => void;
    handleSaveExpenses: () => void;
    handleDeleteExpense: (id: number) => void;
}

export function DraggableExpense({ expense, editedExpenses, isEditing, handleChangeExpenses, handleSaveExpenses, handleDeleteExpense }: DraggableExpenseProps) {
    const [isPressing, setIsPressing] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ 
        id: expense.id.toString(), 
        data: { id: expense.id }, 
    });
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "none",
        opacity: transform ? 0.7 : 1,
        transition: "opacity 0.1s ease",
        backgroundColor: isPressing ? "#fff" : "fff", 
    };

    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveExpenses();
        }
    }

    const handlePressStart = () => setIsPressing(true);
    const handlePressEnd = () => setIsPressing(false);
    
    return (
        <tr>
            <td ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onTouchStart={handlePressStart} onTouchEnd={handlePressEnd}>
                {isEditing ? (
                    <input
                        title="input-cost"
                        type="number"
                        value={editedExpenses.find(e => e.id === expense.id)?.cost || ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                handleChangeExpenses(expense.id, { cost: value });
                            }
                        }}
                        onKeyDown={handleSaveOnEnter}
                    />
                ) : (
                    <span>{expense.cost}</span>
                )}
            </td>
            <td ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {isEditing ? (
                    <input
                        title="input-description"
                        type="text"
                        ref={descriptionInputRef}
                        value={editedExpenses.find(e => e.id === expense.id)?.description || ""}
                        onChange={(e) => handleChangeExpenses(expense.id, { description: e.target.value })}
                        onKeyDown={handleSaveOnEnter}
                    />
                ) : (
                    <span>{expense.description}</span>
                )}
            </td>
            <td style={{ padding: "0px", backgroundColor: "inherit", textAlign: "center" }}>
                {isEditing && (
                    <img 
                        src="/images/bin-svgrepo-com.svg" 
                        alt="Delete" 
                        width="20" 
                        height="20" 
                        style={{ cursor: "pointer" }} 
                        onClick={() => handleDeleteExpense(expense.id)} 
                    />
                )}
            </td>
        </tr>
    );
}