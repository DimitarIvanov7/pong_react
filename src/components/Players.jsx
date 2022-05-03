import styled from "styled-components";
import { forwardRef } from "react";

const Container = styled.div`
	min-height: 10rem;
	min-width: 2rem;
	background-color: black;
	position: absolute;
	top: ${(props) => props.position}%;
	right: ${(props) => props.type && "0"};

	p {
		writing-mode: vertical-rl;
		text-orientation: upright;
		font-size: 15px;
		color: white;
		font-weight: bold;
		margin: 0;
		padding: 5px 10px;
		text-align: center;
	}
`;

const Players = ({ position, type, name }, ref) => {
	return (
		<Container ref={ref} position={position} type={type}>
			<p>{name}</p>
		</Container>
	);
};

export default forwardRef(Players);
