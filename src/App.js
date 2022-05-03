import styled from "styled-components";
import Players from "./components/Players";

import { useState, useRef } from "react";

import Ball from "./components/Ball";

import useInterval from "./components/customHooks/useInterval";

import checkCollision from "./components/customHooks/collisionDetection";

import useEventListener from "./components/customHooks/useEventListener";

const Container = styled.div`
	width: calc(100% - 4px);
	height: calc(100vh - 4px);
	position: relative;
	overflow-y: hidden;
	border: 2px solid black;
	display: flex;
`;

const Info = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	background-color: rgba(166, 171, 206, 0.8);
	z-index: 99;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;

	.wrapper {
		display: flex;
		align-items: center;

		p {
			margin: 0;
			margin-left: 1rem;
		}
	}
`;

const Difficulty = styled.select``;

const Score = styled.p`
	position: absolute;
	width: 100%;
	/* text-align: center; */
	font-size: 25px;
	font-weight: 600;
	margin: 0;
`;

const Winner = styled.p`
	font-size: 25px;
	font-weight: 600;
	position: absolute;
	width: 100%;
	text-align: center;
	margin-top: 30rem;
`;

const CollisionCheckLeft = styled.div`
	width: 1px;
	height: 100%;
	position: absolute;
	margin-right: auto;
	z-index: -1;
`;

const CollisionCheckRight = styled.div`
	width: 1px;
	height: 100%;
	margin-left: auto;
`;

const CollisionCheckTop = styled.div`
	width: 100%;
	height: 1px;
`;

const CollisionCheckBottom = styled.div`
	width: 100%;
	height: 1px;
	background-color: aliceblue;
	position: absolute;
	bottom: 0;
`;

const initialDirection = () => {
	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max);
	};

	return getRandomInt(2) === 1 ? 0.3 : -0.3;
};

function App() {
	const [isInfoOpen, setIsInfoOpen] = useState(true);

	const [difficulty, setDifficulty] = useState(14);

	const [score, setScore] = useState({
		p1: 0,
		p2: 0,
	});

	const [winner, setWinner] = useState();

	const [currentPosP1, setCurrentPosP1] = useState(40);

	const [currentPosP2, setCurrentPosP2] = useState(40);

	const [keyState, setKeyState] = useState({});

	const [ballPos, setballPos] = useState({
		x: 50,
		y: 50,
	});

	const [isMoving, setIsMoving] = useState(false);

	const [direction, setDirection] = useState({
		x: initialDirection(),
		y: 0.7,
	});

	const player1 = useRef();
	const player2 = useRef();
	const ball = useRef();

	const collisionLeft = useRef();
	const collisionRight = useRef();

	const collisionTop = useRef();
	const collisionBottom = useRef();

	const changeDifficulty = (e) => {
		switch (e.target.value) {
			case "easy":
				setDifficulty(14);
				break;

			case "hard":
				setDifficulty(10);
				break;

			case "insane":
				setDifficulty(5);
				break;

			default:
				setDifficulty(50);
				break;
		}
	};

	const gameLoop = () => {
		if (keyState["w"])
			setCurrentPosP1(currentPosP1 !== 0 ? currentPosP1 - 5 : currentPosP1);

		if (keyState["s"])
			setCurrentPosP1(currentPosP1 !== 80 ? currentPosP1 + 5 : currentPosP1);

		if (keyState["ArrowUp"])
			setCurrentPosP2(currentPosP2 !== 0 ? currentPosP2 - 5 : currentPosP2);

		if (keyState["ArrowDown"])
			setCurrentPosP2(currentPosP2 !== 80 ? currentPosP2 + 5 : currentPosP2);

		if (keyState["Enter"]) {
			startMoving();
			setIsInfoOpen(false);
		}

		if (keyState[" "]) stopMoving();
	};

	const handleBtnUp = (e) => {
		setKeyState((prevState) => {
			return {
				...prevState,
				[e.key]: false,
			};
		});
	};

	const handleBtnPress = (e) => {
		setKeyState((prevState) => {
			return {
				...prevState,
				[e.key]: true,
			};
		});
	};

	const handleScoreChange = (point) => {
		if (score.p1 === 4 && point === "p1") {
			setScore({ ...score, p1: 0, p2: 0 });
			setWinner("Player 1");
			setIsInfoOpen(true);
			setDifficulty(14);
			return;
		} else if (score.p2 === 4 && point === "p2") {
			console.log(winner);

			setScore({ ...score, p1: 0, p2: 0 });
			setWinner("Player 2");
			setIsInfoOpen(true);
			setDifficulty(14);
			return;
		}

		setScore((prevScore) => {
			return {
				...prevScore,
				[point]: prevScore[point] + 1,
			};
		});
	};

	useEventListener("keydown", handleBtnPress);

	useEventListener("keyup", handleBtnUp);

	const ballMove = (xDirection, yDirection) => {
		setballPos((prevState) => {
			return {
				...prevState,
				x: prevState.x + xDirection,
				y: prevState.y + yDirection,
			};
		});
	};

	useInterval(() => {
		gameLoop();
	}, 30);

	useInterval(
		() => {
			ballMove(direction.x, direction.y);
			if (
				checkCollision(player2.current, ball.current) ||
				checkCollision(player1.current, ball.current)
			)
				setDirection((prevState) => {
					return {
						...prevState,
						x: -prevState.x,
						y: prevState.y,
					};
				});
			else if (
				checkCollision(collisionTop.current, ball.current) ||
				checkCollision(collisionBottom.current, ball.current)
			)
				setDirection((prevState) => {
					return {
						...prevState,
						x: prevState.x,
						y: -prevState.y,
					};
				});
			else if (checkCollision(collisionLeft.current, ball.current)) {
				handleScoreChange("p2");
				setIsMoving(false);
				resetBal();
			} else if (checkCollision(collisionRight.current, ball.current)) {
				handleScoreChange("p1");
				setIsMoving(false);
				resetBal();
			}
		},
		isMoving ? difficulty : null
	);

	const startMoving = () => {
		setIsMoving(true);
	};

	const stopMoving = () => {
		setIsMoving(false);
	};

	const resetBal = () => {
		setballPos({ x: 50, y: 50 });
		setIsMoving(false);
		setDirection({
			x: initialDirection(),
			y: 0.7,
		});
	};

	return (
		<Container>
			{isInfoOpen && (
				<Info>
					<h1>Controlers</h1>

					<div className="wrapper">
						<h3>Player 1:</h3>
						<p>W, S</p>
					</div>

					<div className="wrapper">
						<h3>Player 2:</h3>
						<p>UpArrow, DownArrow</p>
					</div>

					<div className="wrapper">
						<h3>Start</h3>
						<p>Enter</p>
					</div>

					<div className="wrapper">
						<h3>Reset game</h3>
						<p>R</p>
					</div>
					<Difficulty
						onChange={(e) => changeDifficulty(e)}
						name="difficulty"
						id="difficulty"
					>
						<option value="easy">Easy</option>
						<option value="hard">Hard</option>
						<option value="insane">Insane</option>
					</Difficulty>

					{winner && <Winner> {winner} Won the Game!</Winner>}
				</Info>
			)}

			<Score>
				<p>
					Score: {score.p1} / {score.p2}
				</p>
			</Score>

			<CollisionCheckTop ref={collisionTop} />
			<Players ref={player1} position={currentPosP1} name={"Player 1"}>
				{" "}
			</Players>
			<Players
				ref={player2}
				position={currentPosP2}
				type={2}
				name={"Player 2"}
			></Players>
			<Ball ref={ball} ballPositon={ballPos}></Ball>
			<CollisionCheckLeft ref={collisionLeft} />
			<CollisionCheckRight ref={collisionRight} />
			<CollisionCheckBottom className="bot" ref={collisionBottom} />
		</Container>
	);
}

export default App;
