import styled from "styled-components";
import { forwardRef } from "react";

const Container = styled.div`
	background-color: black;
	height: 25px;
	width: 25px;
	border-radius: 50%;
	position: absolute;
	transform: translate(-50%, -50%);
`;
const Ball = ({ ballPositon }, ref) => {
	return (
		<Container
			ref={ref}
			// positon={ballPositon}
			style={{ top: `${ballPositon.y}%`, left: `${ballPositon.x}%` }}
		></Container>
	);
};

export default forwardRef(Ball);

/* top: ${(props) => props.positon.y}%;
	left: ${(props) => props.positon.x}%; */
