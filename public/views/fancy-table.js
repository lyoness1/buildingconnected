// View to handle rendering of DataTable and table actions
function FancyTable (dataTable) {
	this.table = dataTable;
}

FancyTable.prototype.render = function () {
	this.$table = makeElement('table', {'class': 'fancy-table data-table'})
	this.$header = this.renderHeader();
	this.$body = this.renderBody();
	this.$footer = this.renderFooter();
	this.$table.appendChild(this.$header);
	this.$table.appendChild(this.$footer);
	this.$table.appendChild(this.$body);
	return this.$table;
}

FancyTable.prototype.renderHeader = function () {
	// Entire header row
	var $header = makeElement('thead');
	var $row = makeElement('tr');
	var $cell = makeElement('th');
	var $headerWrapper = makeElement('div', {'class': 'header-wrapper'});
	// Table title
	var $title = makeElement('span', {'class': 'table-title'})
	$title.innerHTML = 'Find a Company';
	// Search input box and wrapper
	var $searchBox = makeElement('input', {'class': 'search-input', 'placeholder': 'Search by name'});
	$searchBox.addEventListener('input', this.updateFilter.bind(this));
	var $inputWrapper = makeElement('span', {'class': 'input-wrapper'});
	$inputWrapper.appendChild($searchBox);
	// Append pieces together
	$headerWrapper.appendChild($title);
	$headerWrapper.appendChild($inputWrapper);
	$cell.appendChild($headerWrapper);
	$row.appendChild($cell);
	$header.appendChild($row);
	return $header;
}

FancyTable.prototype.renderBody = function () {
	var $body = makeElement('tbody', {'class': 'fancy-table-body'});
	this.table.data.map((company) => {
		var $row = this.renderRow(company);
		$row.addEventListener('click', this.handleExpandRow.bind(this));
		$body.appendChild($row);
	});
	return $body;
}

FancyTable.prototype.renderRow = function (company) {
	var $cell = makeElement('td');
	$cell.innerHTML = company.name;
	var $row = makeElement('tr', {'id': 'index-' + this.table.data.indexOf(company)});
	$row.appendChild($cell);
	return $row;
}

FancyTable.prototype.renderFooter = function () {
	var $footer = makeElement('tfoot');
	var $row = makeElement('tr');
	var $cell = makeElement('td');
	var $wrapper = makeElement('div', {'class': 'footer-wrapper'});
	this.$footerMessage = this.renderFooterMessage();
	this.$buttons = this.renderButtons();
	$wrapper.appendChild(this.$footerMessage);
	$wrapper.appendChild(this.$buttons);
	$cell.appendChild($wrapper);
	$row.appendChild($cell);
	$footer.appendChild($row);
	return $footer;
}

FancyTable.prototype.renderFooterMessage = function () {
	var $displayMessage = makeElement('span', {'class': 'display-message'});
	var start = parseInt(this.table.params.start + 1);
	var end = (start + this.table.params.limit > this.table.length) ? this.table.length : (start + this.table.params.limit - 1 );
	$displayMessage.innerHTML = 'Displaying rows ' + start + '-' + end + ' of ' + this.table.length;
	return $displayMessage;
}

FancyTable.prototype.renderButtons = function () {
	var $buttons = makeElement('span', {'class': 'buttons'});

	var $previousBtn = makeElement('button', {'id': 'previous-btn'});
	$previousBtn.innerHTML = '< Previous ';
	$previousBtn.addEventListener('click', this.getPreviousPage.bind(this));
	if (this.table.params.start === 0) {
		$previousBtn.classList.add('disabled');
		$previousBtn.setAttribute('disabled', '')
	} else if ($previousBtn.classList.contains('disabled')) {
		$previousBtn.classList.remove('disabled');
		$previousBtn.removeAttribute('disabled');
	}

	var $nextBtn = makeElement('button', {'id': 'next-btn'});
	$nextBtn.innerHTML = ' Next >';
	$nextBtn.addEventListener('click', this.getNextPage.bind(this));
	if (this.table.params.start + this.table.params.limit + 1 > this.table.length) {
		$nextBtn.classList.add('disabled');
		$nextBtn.setAttribute('disabled', '')
	} else if ($nextBtn.classList.contains('disabled')) {
		$nextBtn.classList.remove('disabled');
		$nextBtn.removeAttribute('disabled', '')
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
	var rowIndex = e.currentTarget.id.split('-')[1];
	var company = this.table.data[rowIndex];
	var $row = makeElement('tr', {'id': 'index-' + this.table.data.indexOf(company)});

	var $nameSubRow = makeElement('div', {'class': 'company-name expanded' });
	$nameSubRow.innerHTML = company.name;

	var $infoSubRow = makeElement('div', {'class': 'company-info'});
	var $logo = makeElement('img', {'class': 'logo', 'src': company.avatarUrl});
	var $logoContainer = makeElement('div', {'class': 'logo-container'});
	$logoContainer.appendChild($logo);
	var $info = this.renderInfo(company);
	$infoSubRow.appendChild($logoContainer);
	$infoSubRow.appendChild($info);

	var $cell = makeElement('td');
	$cell.appendChild($nameSubRow);
	$cell.appendChild($infoSubRow);

	$row.appendChild($cell)
	$row.addEventListener('click', this.handleCollapseRow.bind(this));

	e.currentTarget.replaceWith($row);
}

FancyTable.prototype.handleCollapseRow = function (e) {
	var rowIndex = e.currentTarget.id.split('-')[1];
	var company = this.table.data[rowIndex];
	var $row = this.renderRow(company);
	$row.addEventListener('click', this.handleExpandRow.bind(this));
	e.currentTarget.replaceWith($row);
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

	var $container = makeElement('div', {'class': 'company-info-text'});
	$container.appendChild($website);
	$container.appendChild($phone);
	$container.appendChild($laborTypes);
	return $container;
}
