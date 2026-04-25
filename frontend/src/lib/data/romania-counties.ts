/**
 * Auto-generated metadata for Romanian counties used by RomaniaMap.svelte.
 * Codes match `data-county` attributes in /static/maps/romania-counties.svg.
 * lx/ly = label position in SVG viewBox coordinates (700x460).
 */
export interface CountyMeta {
	readonly code: string;
	readonly name: string;
	readonly slug: string;
	readonly lx: number;
	readonly ly: number;
}

export const COUNTIES: ReadonlyArray<CountyMeta> = [
	{ code: "IF", name: "Ilfov", slug: "ilfov", lx: 427.0, ly: 366.5 },
	{ code: "CS", name: "Caraș-Severin", slug: "caras-severin", lx: 143.5, ly: 299.2 },
	{ code: "TM", name: "Timiș", slug: "timis", lx: 109.7, ly: 237.5 },
	{ code: "BT", name: "Botoșani", slug: "botosani", lx: 474.2, ly: 49.3 },
	{ code: "BN", name: "Bistrița-Năsăud", slug: "bistrita-nasaud", lx: 320.3, ly: 112.1 },
	{ code: "CJ", name: "Cluj", slug: "cluj", lx: 255.3, ly: 141.8 },
	{ code: "AB", name: "Alba", slug: "alba", lx: 247.7, ly: 207.7 },
	{ code: "HD", name: "Hunedoara", slug: "hunedoara", lx: 206.9, ly: 243.2 },
	{ code: "MM", name: "Maramureș", slug: "maramures", lx: 282.6, ly: 62.2 },
	{ code: "MS", name: "Mureș", slug: "mures", lx: 329.1, ly: 174.3 },
	{ code: "SJ", name: "Sălaj", slug: "salaj", lx: 233.9, ly: 110.2 },
	{ code: "SM", name: "Satu Mare", slug: "satu-mare", lx: 220.3, ly: 58.7 },
	{ code: "AG", name: "Argeș", slug: "arges", lx: 341.9, ly: 324.3 },
	{ code: "SB", name: "Sibiu", slug: "sibiu", lx: 299.9, ly: 234.6 },
	{ code: "VL", name: "Vâlcea", slug: "valcea", lx: 287.7, ly: 312.8 },
	{ code: "BV", name: "Brașov", slug: "brasov", lx: 374.1, ly: 250.0 },
	{ code: "CV", name: "Covasna", slug: "covasna", lx: 413.6, ly: 233.9 },
	{ code: "HR", name: "Harghita", slug: "harghita", lx: 391.4, ly: 174.7 },
	{ code: "IS", name: "Iași", slug: "iasi", lx: 504.8, ly: 115.2 },
	{ code: "NT", name: "Neamț", slug: "neamt", lx: 447.1, ly: 137.7 },
	{ code: "PH", name: "Prahova", slug: "prahova", lx: 418.7, ly: 312.5 },
	{ code: "SV", name: "Suceava", slug: "suceava", lx: 403.3, ly: 87.9 },
	{ code: "BC", name: "Bacău", slug: "bacau", lx: 461.5, ly: 185.0 },
	{ code: "BR", name: "Brăila", slug: "braila", lx: 528.2, ly: 312.7 },
	{ code: "BZ", name: "Buzău", slug: "buzau", lx: 471.6, ly: 300.4 },
	{ code: "GL", name: "Galați", slug: "galati", lx: 539.8, ly: 246.8 },
	{ code: "VS", name: "Vaslui", slug: "vaslui", lx: 536.2, ly: 175.2 },
	{ code: "VN", name: "Vrancea", slug: "vrancea", lx: 488.5, ly: 245.6 },
	{ code: "TL", name: "Tulcea", slug: "tulcea", lx: 607.1, ly: 317.4 },
	{ code: "DJ", name: "Dolj", slug: "dolj", lx: 251.9, ly: 395.7 },
	{ code: "GJ", name: "Gorj", slug: "gorj", lx: 229.9, ly: 315.5 },
	{ code: "MH", name: "Mehedinți", slug: "mehedinti", lx: 191.4, ly: 353.1 },
	{ code: "OT", name: "Olt", slug: "olt", lx: 306.8, ly: 385.6 },
	{ code: "TR", name: "Teleorman", slug: "teleorman", lx: 362.1, ly: 409.5 },
	{ code: "CL", name: "Călărași", slug: "calarasi", lx: 485.1, ly: 388.5 },
	{ code: "DB", name: "Dâmbovița", slug: "dambovita", lx: 381.7, ly: 333.5 },
	{ code: "GR", name: "Giurgiu", slug: "giurgiu", lx: 410.5, ly: 401.1 },
	{ code: "IL", name: "Ialomița", slug: "ialomita", lx: 496.0, ly: 356.6 },
	{ code: "CT", name: "Constanța", slug: "constanta", lx: 574.1, ly: 381.6 },
	{ code: "AR", name: "Arad", slug: "arad", lx: 128.5, ly: 196.8 },
	{ code: "BH", name: "Bihor", slug: "bihor", lx: 169.0, ly: 128.3 },
	{ code: "B", name: "București", slug: "bucuresti", lx: 422.6, ly: 375.8 },
];

export const COUNTY_BY_CODE: ReadonlyMap<string, CountyMeta> = new Map(COUNTIES.map((c) => [c.code, c]));
