function TableView() {
	this.searchTable = new SearchTable();
	this.searchTable.getData().then(() => {
		this.render();
	})
}

TableView.prototype.render = function () {
	this.table = document.createElement('table');
	var body = document.createElement('tbody');
	this.searchTable.data.map((company) => {
		let row = document.createElement('tr');
		let cell = document.createElement('td');
		cell.innerHTML = company.name;
		row.appendChild(cell);
		body.appendChild(row);
	});
	this.table.appendChild(body);
}
