// View to handle rendering of DataTable and table actions
function FancyTable (dataTable) {
	this.table = dataTable;
}

FancyTable.prototype.render = function () {
	this.$table = makeElement('table', {'id': 'fancy-table', 'class': 'data-table'})
	this.$header = this.renderHeader();
	this.$body = this.renderBody();
	this.$footer = this.renderFooter();
	this.$table.appendChild(this.$header);
	this.$table.appendChild(this.$footer);
	this.$table.appendChild(this.$body);
	return this.$table;
}

FancyTable.prototype.renderHeader = function () {
	var $header = makeElement('thead');
	var $row = makeElement('row');
	var $cell = makeElement('th');
	var $title = makeElement('span')
	$title.innerHTML = 'Find a Company';
	var $searchBox = makeElement('input', {'id': 'search-input', 'placeholder': 'Search by name'});
	$searchBox.addEventListener('input', this.updateFilter.bind(this));
	$cell.appendChild($title);
	$cell.appendChild($searchBox);
	$row.appendChild($cell);
	$header.appendChild($row);
	return $header;
}

FancyTable.prototype.renderBody = function () {
	var $body = makeElement('tbody', {'id': 'fancy-table-body'});
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

FancyTable.prototype.renderFooter = function () {
	var $footer = makeElement('tfoot');
	var $row = makeElement('tr');
	var $cell = makeElement('td');
	this.$footerMessage = this.renderFooterMessage();
	this.$buttons = this.renderButtons();
	$cell.appendChild(this.$footerMessage);
	$cell.appendChild(this.$buttons);
	$row.appendChild($cell);
	$footer.appendChild($row);
	return $footer;
}

FancyTable.prototype.renderFooterMessage = function () {
	var $displayMessage = makeElement('span', {'id': 'display-message'});
	var start = this.table.params.start + 1;
	var end = (start + this.table.params.limit > this.table.length) ? this.table.length : (start + this.table.params.limit - 1 );
	$displayMessage.innerHTML = 'Displaying rows ' + start + ' through ' + end + ' of ' + this.table.length;
	return $displayMessage;
}

FancyTable.prototype.renderButtons = function () {
	var $buttons = makeElement('span', {'class': 'buttons'});

	var $previousBtn = makeElement('button', {'id': 'previous-btn'});
	$previousBtn.innerHTML = 'Previous';
	$previousBtn.addEventListener('click', this.getPreviousPage.bind(this));
	if (this.table.params.start === 0) {
		$previousBtn.classList.add('disabled');
	} else {
		$previousBtn.classList.contains('disabled') ? $previousBtn.classList.remove('disabled') : noop();
	}

	var $nextBtn = makeElement('button', {'id': 'next-btn'});
	$nextBtn.innerHTML = 'Next';
	$nextBtn.addEventListener('click', this.getNextPage.bind(this));
	if (this.table.params.start + this.table.params.limit + 1 > this.table.length) {
		$nextBtn.classList.add('disabled');
	} else {
		$nextBtn.classList.contains('disabled') ? $nextBtn.classList.remove('disabled') : noop();
	}

	$buttons.appendChild($previousBtn);
	$buttons.appendChild($nextBtn);
	return $buttons;
}

FancyTable.prototype._update = function () {
	var $currentBody = this.$body;
	this.$body = this.renderBody();
	replaceElement($currentBody, this.$body);
	var $currentFooter = this.$footer;
	this.$footer = this.renderFooter();
	replaceElement($currentFooter, this.$footer);
}

FancyTable.prototype.updateFilter = debounce(function (e) {
	this.table.updateFilterPromise(e.target.value).then((table) => {
		this._update();
	})
}, 1000);

FancyTable.prototype.getNextPage = function () {
	this.table.getNextPagePromise().then((table) => {
		this._update();
	});
}

FancyTable.prototype.getPreviousPage = function () {
	this.table.getPreviousPagePromise().then((table) => {
		this._update();
	});
}

FancyTable.prototype.handleExpandRow = function (e) {
	var $
	var rowIndex = e.currentTarget.id.split('-')[1];
	var company = this.table.data[rowIndex];

	var $name = makeElement('span', {'class': 'company-name expanded' });
	$name.innerHTML = company.name;

	var $logo = makeElement('img', {'class': 'logo', 'src': company.avatarUrl});
	var $logoContainer = makeElement('span', {'class': 'logo-container'});
	$logoContainer.appendChild($logo);

	var $infoContainer = this.renderInfo(company);

	var $newCell = document.createElement('td');
	$newCell.appendChild($name);
	$newCell.appendChild($logoContainer);
	$newCell.appendChild($infoContainer);
	e.target.replaceWith($newCell);
}

FancyTable.prototype.renderInfo = function (company) {
	var $phone = makeElement('p');
	$phone.innerHTML = "Phone: " + company.phone;

	var $website = makeElement('p');
	$website.innerHTML = "Website: ";
	var $link = makeElement('a', {'href': company.website, 'target': '_blank'});
	$link.innerHTML = company.website;
	$website.appendChild($link);

	var $laborTypes = makeElement('p');
	$laborTypes.innerHTML = "Labor Type(s): " + company.laborType[0];
	company.laborType.slice(1).forEach((type) => {
		$laborTypes.innerHTML += ", " + type;
	});

	var $container = makeElement('span', {'class': 'company-info-text'});
	$container.appendChild($website);
	$container.appendChild($phone);
	$container.appendChild($laborTypes);
	return $container;
}
