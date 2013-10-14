$('.airport-filter').mouseup(function () {
	socket.emit('cityChangeReq', $(this).attr('id'));
});