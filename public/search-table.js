function SearchTable (title='Untitled') {
	this.title = title;
	this.baseUrl = 'http://localhost:3000/api/companies/';
	this.totalLength = 0;
	this.pageLength = this.setPageLength();
	this.displayData = this.getData(this.baseUrl);
	this.searchTerm = '';
	this.offset = 0;
	this.laborType = null;
}

SearchTable.prototype.setPageLength = function (pageLength=10) {
	this.pageLength = pageLength;
}

SearchTable.prototype.getData = function (url) {
	fetch(url)
		.then((data) => data.json())
		.then((data) => {
			this.totalLength = data.total;
			let companies = data.results;
			this.pageLength = companies.length();
			return companies.map((company) => {
				new Company(company);
			})
		})
		.catch((error) => {
			console.log(error);
		});
}

SearchTable.prototype.filterData = function (searchTerm) {
	this.searchTerm = searchTerm;
	const searchUrl = this.baseUrl + "?q=" + searchTerm;
	this.displayData = this.getData(searchUrl);
}

SearchTable.prototype.getNextPage = function() {
	return null;
};

SearchTable.prototype.getPreviousPage = function () {
	return null;
}

SearchTable.prototype.constructUrl = function () {
	const url = this.baseUrl;
	const paramStrings = [];
	if (this.searchTerm !== '') {
		paramStrings.push('q=' + this.searchTerm);
	}
	if (this.offset !== 0) {
		paramStrings.push('start=' + this.offset);
	}
	if (this.pageLength !== 10) {  // given the assumption the default in the API remains 10
		paramStrings.push('limit=' + this.pageLength);
	}
	if (this.laborType !== null) {
		paramStrings.push('laborType=' + this.laborType.join(','));
	}
	param_strings.forEach((param) => {
		url += (url.split('?')[1] ? '&':'?') + param;
	})
	return url;
}

