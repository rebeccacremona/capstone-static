import { LitElement, html } from "../lib/lit.js";

class ReporterProvider extends LitElement {
	static get properties() {
		return {
			loading: { state: true },
			breweries: { attribute: false },
		};
	}

	constructor() {
		super();
		this.loading = false;
		this.breweries = [];
	}

	connectedCallback() {
		super.connectedCallback();

		this.fetchBreweries();
	}

	async fetchBreweries() {
		this.loading = true;
		const response = await fetch(
			"https://api.openbrewerydb.org/breweries/search?query=minneapolis"
		);
		const jsonResponse = await response.json();
		console.log(jsonResponse);
		this.breweries = jsonResponse;
		this.loading = false;
	}

	render() {
		if (this.loading) {
			return html` <p>Loading...</p> `;
		}

		return html`
			<h1>Breweries App</h1>

			<h2>Breweries</h2>
			<p>Found ${this.breweries.length} breweries</p>

			<ul>
				${this.breweries.map((brewery) => html` <li>${brewery.name}</li> `)}
			</ul>
		`;
	}
}

customElements.define("reporter-provider", ReporterProvider);