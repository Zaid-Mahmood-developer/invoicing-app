import { ThreeCircles } from "react-loader-spinner";

const Spinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 container-bg">
            <ThreeCircles
                visible={true}
                height="250"
                width="250"
                ariaLabel="three-circles-loading"
                color="#b76e79"
                outerCircleColor="#8c5b61"
                middleCircleColor="#b76e79"
                innerCircleColor="#e5b7b7"
            />
        </div>
    );
};

export default Spinner;
