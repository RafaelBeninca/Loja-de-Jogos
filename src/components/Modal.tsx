import { ReactElement } from "react"
import '../styles/modal.css'

interface ModalProps {
    children: ReactElement,
    closeModal: () => void
}

export default function Modal({ children, closeModal }: ModalProps) {
    return (
        <div className="modal-background">
            <div className="modal">
                <button className="close" onClick={closeModal}>&times;</button>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
}