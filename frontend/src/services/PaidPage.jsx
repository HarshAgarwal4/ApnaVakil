import { useNavigate } from "react-router-dom"
import { useStore } from "../zustand/store"

const PaymentProtected = ({ children }) => {
    const { user, checkPlan, setShowPricingBox } = useStore()
    const navigate = useNavigate()
    if (checkPlan()) {
        return children
    }

    else {
        navigate('/dashboard')
        setShowPricingBox(true)
    }
    return
}

export {PaymentProtected}