function SearchTable () {
	this.baseUrl = 'http://localhost:3000/api/companies/';
	this.params = {
		searchTerm: null,
		start: null,
		limit: null,
		laborType: null
	}
}

SearchTable.prototype.constructUrl = function () {
	var url = this.baseUrl;
	var {searchTerm, start, limit, laborType} = this.params;
	var paramStrings = [];
	searchTerm ? paramStrings.push('q=' + this.searchTerm) : noop();
	start ? paramStrings.push('start=' + this.start) : noop();
	limit ? paramStrings.push('limit=' + this.limit) : noop();
	laborType ? paramStrings.push('laborType=' + this.laborType.join(',')) : noop();
	paramStrings.forEach((param) => {
		url += (url.split('?')[1] ? '&':'?') + param;
	})
	return url;
}

SearchTable.prototype.getData = function () {
	var url = this.constructUrl();
	return new Promise((res, rej) => {
		 fetch(url).then((data) => 
			data.json()
		).then((data) => {
			this.data = data.results;
			this.length = data.total;
		}).catch((error) => {
			console.log(error);
		}.bind(this));
	}.bind(this));
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
	if (pageLength !== this.pageLength) {
		this.pageLength = pageLength;
		this.getData(this.constructUrl());
	}
}

SearchTable.prototype.updateSearchFilter = function (searchTerm) {
	this.searchTerm = searchTerm;
	this.getData(this.constructUrl());
}

SearchTable.prototype.updateLaborType = function(laborType) {
	this.laborType = laborType;
	this.getData(this.constructUrl());
}
