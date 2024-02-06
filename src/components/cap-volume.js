import { LitElement, html, css, nothing } from "../lib/lit.js";
import {
	fetchCasesList,
	fetchReporterData,
	fetchVolumeData,
	getBreadcrumbLinks,
} from "../lib/data.js";
import { isEmpty } from "../lib/isEmpty.js";
import { fetchOr404 } from "../lib/fetchOr404.js";
import { baseStyles } from "../lib/wc-base.js";
import "./cap-breadcrumb.js";

export default class CapVolume extends LitElement {
	static properties = {
		casesData: { attribute: false },
		reporterData: { attribute: false },
		volumeData: { attribute: false },
		reporter: { type: String },
		volume: { type: String },
	};

	constructor() {
		super();
		this.casesData = [];
		this.reporterData = {};
		this.volumeData = {};
	}

	static styles = [
		baseStyles,

		css`
			p,
			ul {
				font-family: var(--font-sans-text);

				@media (min-width: 35rem) {
					font-size: var(--font-size-175);
				}
			}

			ul {
				padding: 0;
			}

			li {
				list-style-type: none;
			}

			a:link,
			a:visited,
			a:hover,
			a:active {
				text-decoration: none;
				color: var(--color-blue-400);
			}

			a:hover {
				color: var(--color-blue-500);
				text-decoration: underline;
			}

			.volume {
				grid-column: 1 / -1;
				padding-inline: var(--spacing-500);
				padding-block-start: var(--spacing-400);
				padding-block-end: var(--spacing-550);
			}

			.volume__headingGroup {
				margin-block-start: var(--spacing-100);
			}

			.volume__heading {
				font-weight: 600;
				font-size: var(--font-size-250);
				position: relative;
			}

			.volume__subHeading {
				font-size: var(--font-size-175);
				margin-block-start: var(--spacing-0);
				font-weight: 500;
			}

			.volume__caseList {
				margin-block-start: var(--spacing-150);
				display: block;
			}
		`,
	];

	connectedCallback() {
		super.connectedCallback();
		fetchOr404(
			() =>
				fetchCasesList(
					this.reporter,
					this.volume,
					(data) => (this.casesData = data),
				),
			() =>
				fetchReporterData(this.reporter, (data) => (this.reporterData = data)),
			() =>
				fetchVolumeData(
					this.reporter,
					this.volume,
					(data) => (this.volumeData = data),
				),
		);
	}

	render() {
		if (
			!isEmpty(this.casesData) &&
			!isEmpty(this.reporterData) &&
			!isEmpty(this.volumeData)
		) {
			window.document.title = `Volume: ${this.reporterData.short_name} volume ${this.volume} | Caselaw Access Project`;
			return html`
				<cap-caselaw-layout>
					<div class="volume">
						<cap-breadcrumb
							.navItems=${getBreadcrumbLinks(this.reporterData, this.volume)}
						></cap-breadcrumb>
						<hgroup class="volume__headingGroup">
							<h1 class="volume__heading">
								${this.volume} ${this.reporterData.short_name}
							</h1>
							<p class="volume__subHeading">
								${this.reporterData.full_name}
								(${this.reporterData.start_year}-${this.reporterData.end_year})
								volume ${this.volume}.
							</p>
						</hgroup>
						<ul class="volume__caseList">
							${this.casesData.map(
								(c) =>
									html`<li>
										<a
											href="/caselaw/?reporter=${this.reporter}&volume=${this
												.volume}&case=${String(c.first_page).padStart(
												4,
												"0",
											)}-${String(c.ordinal).padStart(2, "0")}"
										>
											${c.name_abbreviation},
											${c.citations.filter((c) => c.type == "official")[0].cite}
											(${c.decision_date.substring(0, 4)})
										</a>
									</li>`,
							)}
						</ul>
					</div>
				</cap-caselaw-layout>
			`;
		} else {
			return nothing;
		}
	}
}

customElements.define("cap-volume", CapVolume);
