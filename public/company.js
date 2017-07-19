function Company (company) {
	this.id = uniqueId()
	this.displayName = company.name;
	this.searchName = company.name.toLowerCase();
	this.laborType = company.laborType;
	this.avatarUrl = company.avatarUrl;
	this.website = company.website;
	this.phone = company.phone;
}