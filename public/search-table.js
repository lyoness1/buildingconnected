function SearchTable (title='Untitled') {
	this.title = title;
	this.baseUrl = 'http://localhost:3000/api/companies/';
	this.totalLength = 0;
	this.pageLength = this.setPageLength(10);
	this.displayData = [];
	this.searchTerm = '';
	this.offset = 0;
	this.laborType = [];
	this.getData(this.baseUrl);
}

SearchTable.prototype.constructUrl = function () {
	let url = this.baseUrl;
	let paramStrings = [];
	if (this.searchTerm !== '') {
		paramStrings.push('q=' + this.searchTerm);
	}
	if (this.offset !== 0) {
		paramStrings.push('start=' + this.offset);
	}
	if (this.pageLength !== 10) {  // assuming the default in the API remains 10
		paramStrings.push('limit=' + this.pageLength);
	}
	if (this.laborType !== undefined) {
		paramStrings.push('laborType=' + this.laborType.join(','));
	}
	paramStrings.forEach((param) => {
		url += (url.split('?')[1] ? '&':'?') + param;
	})
	return url;
}

SearchTable.prototype.getData = function (url) {
	fetch(url)
		.then((data) => data.json())
		.then((data) => {
			this.totalLength = data.total;
			let companies = data.results;
			this.displayData = companies.map((company) => {
				new Company(company);
			})
		})
		.catch((error) => {
			console.log(error);
		});
}

SearchTable.prototype.getNextPage = function() {
	if (this.offset + this.pageLength < this.totalLength) {
		this.offset += this.pageLength;
		this.getData(this.constructUrl());
	}
};

SearchTable.prototype.getPreviousPage = function () {
	if (this.start - this.pageLength > 0) {
		this.offset -= this.pageLength;
		this.getData(this.constructUrl());
	}
}

SearchTable.prototype.setPageLength = function (pageLength) {
	this.pageLength = pageLength;
	this.getData(this.constructUrl());
}

SearchTable.prototype.updateSearchFilter = function (searchTerm) {
	this.searchTerm = searchTerm;
	this.getData(this.constructUrl());
}

SearchTable.prototype.updateLaborType = function(laborType) {
	this.laborType = laborType;
	this.getData(this.constructUrl());
}
