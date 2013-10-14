$('div.filter').mouseup(function () {
	$(this).toggleClass('inactive');
	$(this).toggleClass('active');
	
	socket.emit('filterReq', $(this).attr('id'), $(this).hasClass('active'));
});