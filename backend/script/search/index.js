const { $and } = require("./query");

class Store {
	#tokenReg = /[a-z0-9]+/g;
	#tokens = {};
	#cb;

	constructor({ cb = () => {}, tokens = {} }) {
		this.#cb = cb;
		this.#tokens = tokens;
	}

	tokenize(arr) {
		for (let ele of arr) {
			const temp = this.#cb(ele).toLowerCase();
			const matches = new Set(temp.match(this.#tokenReg));

			for (let match of matches) {
				if (this.#tokens[match]) this.#tokens[match].push(ele);
				else this.#tokens[match] = [ele];
			}
		}
	}

	get tokens() {
		return { ...this.#tokens };
	}

	search(query, threshold = 2) {
		if (query.match(/\&/)) query = $and(query);
		else query = [query];

		let result = [];

		for (let q of query) {
			const querySet = new Set(q.toLowerCase().match(this.#tokenReg));
			const qtl = querySet.size;
			const queryObj = {};
			console.log(querySet, qtl);
			for (let qt of querySet) {
				if (this.#tokens[qt]) {
					this.#tokens[qt].forEach((ele) => {
						const text = this.#cb(ele);
						if (queryObj[text]) queryObj[text].cnt++;
						else
							queryObj[text] = {
								data: ele,
								cnt: 1,
							};
					});
				}
			}
			console.log(queryObj);
			const sortedRes = Object.entries(queryObj)
				.sort(([, a], [, b]) => b.cnt - a.cnt)
				.reduce((r, [, v]) => (threshold == -1 || v.cnt > qtl - threshold ? [...r, v.data] : r), []);
			result = [...result, ...sortedRes];
		}
		return result;
	}
}

module.exports = Store;