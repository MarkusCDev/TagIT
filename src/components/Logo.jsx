import LogoImage from "/logoWithCCNY.png" 
import { useNavigate } from "react-router-dom";

const Logo = () => {
    const navigate = useNavigate();
    return (
        <div className="h-16 cursor-pointer max-w-[120px]" onClick={() => navigate("/")}>
            <img src={LogoImage} className="object-contain h-full w-full" alt="Logo of TagIT w/ CCNY" />
        </div>
    )
}

export default Logo;