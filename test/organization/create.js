const dynamodb = require('../../shared/lib/dynamo');
const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Asset on DynamoDB
 * This endpoint receive a simple POST Payload:
 * After receive a simple payload:
 * See MOCK DUMMY DATA below
 * Register on DynamoDB Table
 */
const createOrganization = async (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = getId();

	let params = {
		TableName: DYNAMO_TABLE,
		Item: {
			PK: `ORG#${ORG_ID}`,
			SK: `#METADATA#${ORG_ID}`,
			company_id: data.company_id,
			name: data.name,
			domain_name: data.domain_name,
			country: data.country,
			data: `ORG#${name}`,
			created_at: util.getDateFormated(),
			updated_at: util.getDateFormated(),
		},
	};

	return await dynamodb.save(params);
};

(async () => {
	const organizationCreated = await createOrganization({
		company_id: '98789278000194',
		name: 'Central Nacional Unimed',
		domain_name: 'cnu.com.br',
		country: 'Brazil',
	});

	console.log(
		'ORGANIZATION --> ',
		JSON.stringify(organizationCreated, null, 2)
	);
})();

/**  MOCK DUMMY DATA ORGANIZATION
[{"company_id":"02877565000187","name":"Medicos Sem Fronteiras","domain_name":"msf.org.br","country":"Brazil"},
{"company_id":"02367196000182","name":"VAGAS Tecnologia","domain_name":"vagas.com.br","country":"Brazil"},
{"company_id":"84981171000139","name":"Leroy Merlin Cia Brasileira de Bricolagem","domain_name":"leroymerlin.com.br","country":"Brazil"},
{"company_id":"16880307000164","name":"Hospital Israelita Albert Einstein","domain_name":"einstein.br", "country":"Brazil"},
{"company_id":"98789278000194","name":"Central Nacional Unimed","domain_name":"cnu.com.br","country":"Brazil"}]
 */
