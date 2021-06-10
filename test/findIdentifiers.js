'use strict';
const AWS = require('aws-sdk');
AWS.config.update({
	region: 'sa-east-1',
	accessKeyId: 'AKIA3HPWWSDGMD3YKOGQ',
	secretAccessKey: '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',
	convertEmptyValues: true,
	endpoint: 'dynamodb.sa-east-1.amazonaws.com',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const DYNAMO_TABLE = 'table-consent-management-prod';

const findIdentifiers = async (event) => {
	return new Promise((resolve, reject) => {
		//Quantidade de Identificadores
		let params = {
			TableName: DYNAMO_TABLE,
			FilterExpression: 'begins_with(#data_key, :data_key)',
			ExpressionAttributeNames: {
				'#data_key': 'data_key',
			},
			ExpressionAttributeValues: {
				':data_key': `ORG#312#PERS#IDEN#`,
			},
		};

		dynamodb.scan(params, onScan);

		let datapack = [];
		function onScan(erro, data) {
			try {
				datapack = datapack.concat(data.Items);
				if (typeof data.LastEvaluatedKey != 'undefined') {
					params.ExclusiveStartKey = data.LastEvaluatedKey;
					dynamodb.scan(params, onScan);
				} else {
					resolve(datapack);
				}
			} catch (error) {
				let mensagem = {
					mensagem: 'Erro para fazer a query na tabela',
					err: error,
				};
				console.log(mensagem);
				reject(mensagem);
			}
		}
	});
};

const findConsents = async (event) => {
	return new Promise((resolve, reject) => {
		// Quantidade de consents
		let params = {
			TableName: DYNAMO_TABLE,
			FilterExpression: 'begins_with(#data_key, :data_key)',
			ExpressionAttributeNames: {
				'#data_key': 'data_key',
			},
			ExpressionAttributeValues: {
				':data_key': `ORG#312#CONS#IDEN#KEY#`,
			},
		};

		dynamodb.scan(params, onScan);

		let datapack = [];
		function onScan(erro, data) {
			try {
				datapack = datapack.concat(data.Items);
				if (typeof data.LastEvaluatedKey != 'undefined') {
					params.ExclusiveStartKey = data.LastEvaluatedKey;
					dynamodb.scan(params, onScan);
				} else {
					resolve(datapack);
				}
			} catch (error) {
				let mensagem = {
					mensagem: 'Erro para fazer a query na tabela',
					err: error,
				};
				console.log(mensagem);
				reject(mensagem);
			}
		}
	});
};
function onlyUnique(array) {
	var flags = [],
		output = [],
		l = array.length,
		i;
	for (i = 0; i < l; i++) {
		if (flags[array[i].data_key]) continue;
		flags[array[i].data_key] = true;
		output.push(array[i]);
	}
	return output;
}

(async () => {
	let identifiers = await findIdentifiers();
	let consents = await findConsents();

	let distinctIdentifiers = onlyUnique(identifiers);
	let distinctConsents = onlyUnique(consents);
	let result = distinctIdentifiers.length - distinctConsents.length;
	console.log(
		'Identifiers:',
		JSON.stringify(distinctIdentifiers.length, null, 2)
	);
	console.log('Consents:', JSON.stringify(istinctConsents.length, null, 2));
})();
