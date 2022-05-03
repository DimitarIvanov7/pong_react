const checkCollision = (player, ball) => {
	const getOffset = (el) => {
		const rect = el.getBoundingClientRect();
		return {
			x: rect.left + window.scrollX,
			y: rect.top + window.scrollY,
		};
	};

	const playerCords = getOffset(player);

	const ballCords = getOffset(ball);

	if (
		playerCords.x < ballCords.x + ball.offsetWidth &&
		playerCords.x + player.offsetWidth > ballCords.x &&
		playerCords.y < ballCords.y + ball.offsetHeight &&
		playerCords.y + player.offsetHeight > ballCords.y
	) {
		return true;
	}

	return false;
};

export default checkCollision;
