import WheelComponent from "../components/WheelComponent";

function MainPage() {
    const segments = ["Pierpaolo", "Gianmarco", "Andrea", "Gabriele", "Lorenzo", "Emanuele", "Benedetta"];
    const segColors = [
      "#EE4040",
      "#F0CF50",
      "#815CD1",
      "#3DA5E0",
      "#34A24F",
      "#F9AA1F",
      "#FF9000"
    ];
    const onFinished = (winner) => {
      console.log(winner);
    };
    return (
        <div className="App-Header">
            <div id="wheelCircle">
                <WheelComponent
                    segments={segments}
                    segColors={segColors}
                    winningSegment=""
                    onFinished={(winner) => onFinished(winner)}
                    primaryColor="black"
                    primaryColoraround="#ffffffb4"
                    contrastColor="white"
                    buttonText="Spin"
                    isOnlyOnce={false}
                    size={190}
                    upDuration={50}
                    downDuration={2000}
                />
            </div>
        </div>
    )
}

export default MainPage;