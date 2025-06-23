import { useEffect, useState } from "react";
import WheelComponent from "../components/WheelComponent";

function MainPage() {
    const segments = ["Pierpaolo", "Gianmarco", "Andrea", "Gabriele", "Giampiero", "Benedetta"];
    const segColors = [
        "#EE4040",
        "#F0CF50",
        "#815CD1",
        "#3DA5E0",
        "#34A24F",
        "#F9AA1F",
        "#FF9000"
    ];

    const [winner, setWinner] = useState(null);

    const handleFinish = (winnerName) => {
        setWinner(winnerName);
    };

    const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    };

    const modalButtonStyle = {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#2d3436",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    };

    const closeModal = () => {
        setWinner(null);
    };
    return (
        <div className="App-Header">
            <h1 className="text-3xl font-bold">
                Ruota della "Fortuna" 🎯
            </h1>

            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div id="wheelCircle" className="flex flex-col items-center justify-center">

                    <WheelComponent
                        initialSegments={segments}
                        segColors={segColors}
                        onFinished={handleFinish} primaryColor="#2d3436"
                        primaryColoraround="#636e72"
                        contrastColor="#ffffff"
                        buttonText="GIRA"
                    />

                    {/* Modal */}
                    {winner && (
                        <div style={modalOverlayStyle}>
                            <div style={modalContentStyle}>
                                <h2>🎉 Hai vinto: {winner}!</h2>
                                <button onClick={closeModal} style={modalButtonStyle}>Chiudi</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainPage;