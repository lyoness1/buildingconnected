// View to handle rendering of dataTable and table actions
function FancyTable (dataTable) {
	this.table = dataTable;
}

FancyTable.prototype.render = function () {
	var $table = document.createElement('table');
	$table.setAttribute('id', 'fancy-table');
	var $body = this.renderBody();
	var $footer = this.renderFooter();
	$table.appendChild($footer);
	$table.appendChild($body);
	return $table;
}

FancyTable.prototype.renderBody = function () {
	var $body = document.createElement('tbody');
	this.table.data.map((company) => {
		var $cell = document.createElement('td');
		$cell.innerHTML = company.name;
		var $row = document.createElement('tr');
		var index = this.table.data.indexOf(company);
		$row.setAttribute('id', 'index-' + index);
		$row.appendChild($cell);
		$body.appendChild($row);
	});
	return $body;
}

FancyTable.prototype.updateBody = function () {
	var $currentBody = document.getElementsByTagName('tbody')[0] || null;
	var $newBody = this.renderBody();
	if ($currentBody) {
		var $currentBodyParent = document.getElementsByTagName('table')[0];
		$currentBodyParent.replaceChild($newBody, $currentBody);
	}
	Array.from(document.getElementsByTagName('tr')).slice(0,-1).forEach((row) => {
		row.addEventListener('click', this.handleClickRow.bind(this));
	});
}

FancyTable.prototype.renderFooter = function () {
	var $footer = document.createElement('tfoot');
	var $row = document.createElement('tr');
	var $previousBtn = document.createElement('button');
	$previousBtn.innerHTML = 'Previous';
	$previousBtn.setAttribute('id', 'previous-btn');
	var $nextBtn = document.createElement('button');
	$nextBtn.innerHTML = 'Next';
	$nextBtn.setAttribute('id', 'next-btn');
	$row.appendChild($previousBtn);
	$row.appendChild($nextBtn);
	$footer.appendChild($row);
	return $footer;
}

FancyTable.prototype.addEventListeners = function () {
	document.getElementById('search-input').addEventListener(
		'input', this.updateFilter.bind(this)
	);
	document.getElementById('previous-btn').addEventListener(
		'click', this.getPreviousPage.bind(this)
	);
	document.getElementById('next-btn').addEventListener(
		'click', this.getNextPage.bind(this)
	);
	Array.from(document.getElementsByTagName('tr')).slice(1).forEach((row) => {
		row.addEventListener('click', this.handleClickRow.bind(this));
	});
}

FancyTable.prototype.updateFilter = debounce(function (e) {
	var value = e.target.value;
	this.table.updateFilterPromise(value).then((table) => {
		this.updateBody();
	})
}, 1000);

FancyTable.prototype.getNextPage = function () {
	this.table.getNextPagePromise().then((table) => {
		this.updateBody();
	});
}

FancyTable.prototype.getPreviousPage = function () {
	this.table.getPreviousPagePromise().then((table) => {
		this.updateBody();
	});
}

FancyTable.prototype.handleClickRow = function (e) {
	var $row = e.target.parentNode;
	console.log($row);
}
