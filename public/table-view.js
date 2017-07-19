function TableView() {
	this.table = new SearchTable('Find a Company');
	this.view = this.render();
}

TableView.prototype.render = function () {
	let node = createNode('h1');
	node.innerHTML = 'Title!';
	return node;
}

/**
const table = document.getElementById('search-table');


	<h1>Find a Company</h1>
	<ul id='companies'></ul>

	<script type="text/javascript" src="/company.js"></script>
	<script type="text/javascript" src="/search.js"></script>
	<script type="text/javascript" src="/utils.js"></script>

	<script type="text/javascript">
		const ul = document.getElementById('companies')

		const url = 'http://localhost:3000/api/companies/'
		fetch(url)
			.then((data) => data.json())
			.then((data) => {
				let companies = data.results
				return companies.map((company) => {
					let li = createNode('li')
						span = createNode('span')
					span.innerHTML = company.name
					append(li, span)
					append(ul, li)
				})
			})
			.catch((error) => {
				console.log(error)
			})

	</script>
*/
