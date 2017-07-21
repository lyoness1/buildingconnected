// Model to handle API communication
function DataTable () {
	this.baseUrl = 'http://localhost:3000/api/companies/';
	this.length = 0;
	this.data = null;
	this.params = {
		searchTerm: null,
		start: 0,
		limit: 10,
		laborType: null
	}
}

DataTable.prototype.constructUrl = function () {
	var url = this.baseUrl;
	var {searchTerm, start, limit, laborType} = this.params;
	var paramStrings = [];
	searchTerm ? paramStrings.push('q=' + searchTerm) : noop();
	(start !== 0) ? paramStrings.push('start=' + start) : noop();
	limit ? paramStrings.push('limit=' + limit) : noop();
	laborType ? paramStrings.push('laborType=' + laborType.join(',')) : noop();
	paramStrings.forEach((param) => {
		url += (url.split('?')[1] ? '&':'?') + param;
	})
	return url;
}

DataTable.prototype.getDataPromise = function () {
	var url = this.constructUrl();
	return fetch(url).then((response) => {
		return response.json().then((data) => {
			this.data = data.results;
			this.length = data.total;
			return Promise.resolve(this);
		}).catch((error) => {
      return Promise.reject(new ResponseError('Invalid JSON: ' + error.message));
    });
	}).then((dataTable) => {
		return dataTable;
	}).catch((error) => {
    return Promise.reject(new NetworkError(error.message));
  });
}

DataTable.prototype.getNextPagePromise = function() {
	var {searchTerm, start, limit, laborType} = this.params;
	(start + limit < this.length) ? (this.params.start += limit) : noop();
	return this.getDataPromise();
};

DataTable.prototype.getPreviousPagePromise = function() {
	var {searchTerm, start, limit, laborType} = this.params;
	(start - limit >= 0) ? (this.params.start -= limit) : noop();
	return this.getDataPromise();
};

DataTable.prototype.setLimitPromise = function (limit) {
	(limit >= 1 && limit <= 100) ? this.params.limit = limit : (
		console.log('Limit must be between 0 and 100')
	);
	return this.getDataPromise();
}

DataTable.prototype.updateFilterPromise = function (searchTerm) {
	this.params.searchTerm = searchTerm;
	return this.getDataPromise();
}
