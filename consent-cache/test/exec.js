// const exec = require('../workers/consumer.js');
const exec = require('./consumer.js');
const payload = require('./payload-sqs.json');
const callback = (erro, data) => {
	console.log('************');
	console.log(
		'Erro:  ',
		erro === null ? 'Não há erros' : JSON.stringify(erro, null, 2)
	);
	console.log('************');
	console.log('Sucesso:  ', JSON.stringify(data, null, 2));
	console.log('************');
};

(() => {
	const result = exec.run(payload, {}, callback);
	console.log('RESULT __    ', JSON.stringify(result, null, 2));
})();
