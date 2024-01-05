import { ReactNode, useState } from "react"
import Modal from "../../UIComponents/Modal/Modal"

interface ModalWrapperProps {
    heading: string,
    children: ReactNode
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ heading, children }) => {

    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }
    return (
        <Modal isOpen={isOpen} heading={heading} onClose={handleToggle}>
            {children}
        </Modal>
    )
}

export default ModalWrapper;