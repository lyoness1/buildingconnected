// View to handle rendering of dataTable and table actions
function FancyTable (dataTable) {
	this.table = dataTable;
}

FancyTable.prototype.render = function () {
	var $table = makeElement('table', {'id': 'fancy-table'})
	var $header = this.renderHeader();
	var $body = this.renderBody();
	var $footer = this.renderFooter();
	$table.appendChild($header);
	$table.appendChild($footer);
	$table.appendChild($body);
	return $table;
}

FancyTable.prototype.renderHeader = function () {
	var $header = makeElement('thead');
	var $row = makeElement('row');
	var $cell = makeElement('td');
	var $title = makeElement('span')
	$title.innerHTML = 'Companies';
	var $searchBox = makeElement('input', {'id': 'search-input', 'placeholder': 'Search by name'});
	$searchBox.addEventListener('input', this.updateFilter.bind(this));
	var $searchBoxContainer = makeElement('span');
	$searchBoxContainer.appendChild($searchBox);
	$cell.appendChild($title);
	$cell.appendChild($searchBoxContainer);
	$row.appendChild($cell);
	$header.appendChild($row);
	return $header;
}

FancyTable.prototype.renderBody = function () {
	var $body = makeElement('tbody');
	this.table.data.map((company) => {
		var $cell = document.createElement('td');
		$cell.innerHTML = company.name;
		var $row = makeElement('tr', {'id': 'index-' + this.table.data.indexOf(company)});
		$row.addEventListener('click', this.handleExpandRow.bind(this));
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
}

FancyTable.prototype.renderFooter = function () {
	var $footer = document.createElement('tfoot');
	var $row = document.createElement('tr');
	var $previousBtn = makeElement('button', {'id': 'previous-btn'});
	$previousBtn.innerHTML = 'Previous';
	$previousBtn.addEventListener('click', this.getPreviousPage.bind(this));
	var $nextBtn = makeElement('button', {'id': 'next-btn'});
	$nextBtn.innerHTML = 'Next';
	$nextBtn.addEventListener('click', this.getNextPage.bind(this));
	$row.appendChild($previousBtn);
	$row.appendChild($nextBtn);
	$footer.appendChild($row);
	return $footer;
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

FancyTable.prototype.handleExpandRow = function (e) {
	var rowIndex = e.currentTarget.id.split('-')[1];
	var company = this.table.data[rowIndex];

	var $logo = makeElement('img', {'class': 'logo'});
	$logo.src = company.avatarUrl;
	var $logoContainer = document.createElement('span');
	$logoContainer.appendChild($logo);

	var $infoContainer = document.createElement('span');
	$infoContainer.innerHTML = "Information \n more information \n even more..."

	var $newCell = document.createElement('td');
	$newCell.appendChild($logoContainer);
	$newCell.appendChild($infoContainer);
	e.target.replaceWith($newCell);
}
