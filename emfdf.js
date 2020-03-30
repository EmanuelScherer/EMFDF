/**
 * Emanuel Master Functions DialogFlow (EMFDF)
 * !AVISO todos os 'GUI' devem ser false, pois não então prontos!
 * 
 * @requires inquirer^7.0.6
 * @requires dialogflow^1.2.0
 * @requires inquirer-table-prompt^0.2.1
 * @requires google-cloud/pubsub^1.6.0
 * @requires colors^1.4.0
 * @requires emfc
 * 
 * @author Emanuel de Souza Scherer
 * 
 * @copyright Emanuel de Souza Scherer 2020 - Todos os direitos reservados
 * 
 * @module EMFDF
 * 
 * @todo GUI
*/

// 	LIBS
const inquirer = require('inquirer');
const dialogflow = require('dialogflow');
const { PubSub } = require('@google-cloud/pubsub');
const emfc = require('emfc');

//	LETS GERAIS
let credentials;
let entitiesClient;
let sessionsClient;
let intentsClient;
let projectId;
let agentPath;

// PUBSUB
let pubsub = new PubSub();

// SESSOES
let Sessions = []

const print = (a) => console.info(a)
print("\n" +
	"                        ______ __  __ ______   _____  ______ \n".yellow +
	"                       |  ____|  \\/  |  ____| |  __ \\|  ____|\n".yellow +
	"                       | |__  | \\  / | |__    | |  | | |__   \n".yellow +
	"                       |  __| | |\\/| |  __|   | |  | |  __|  \n".yellow +
	"                       | |____| |  | | |      | |__| | |     \n".yellow +
	"                       |______|_|  |_|_|      |_____/|_|       ".yellow)

const emfdf = module.exports = {

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/
	TesteList: async () => {

		await inquirer.prompt([{

			type: 'list',
			name: 'a',
			message: 'Teste modo List',
			choices: ['A', 'B', 'C', 'D']

		}

		])
			.then(escolha => {
				console.log('Escolha:', escolha.a);
			})
			.catch(error => {
				if (error.isTtyError) {
					print("Não consigo mostrar no console")
				}
				else {
					print("Deu muito " + error)
				}
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/
	TesteRaw: async () => {

		await inquirer.prompt([{

			type: 'rawlist',
			name: 'a',
			message: 'Teste modo RawList',
			choices: ['A', 'B', 'C', 'D']

		}

		])
			.then(escolha => {

				console.log('Escolha:', escolha.a);

			})
			.catch(error => {

				if (error.isTtyError) {

					print("Não consigo mostrar no console")

				}
				else {

					print("Deu muito " + error)

				}
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/
	TesteExpand: async () => {

		await inquirer.prompt([{

			type: 'expand',
			name: 'a',
			message: 'Teste modo ExpandList',
			choices: [

				{
					key: 'a',
					value: 'A'
				},
				{
					key: 'b',
					value: 'B'
				},
				{
					key: 'c',
					value: 'C'
				},
				{
					key: 'd',
					value: 'D'
				},

			]

		}

		])
			.then(escolha => {

				console.log('Escolha:', escolha.a);

			})
			.catch(error => {

				if (error.isTtyError) {

					print("Não consigo mostrar no console")

				}
				else {

					print("Deu muito " + error)

				}
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/	
	TesteCheck: async () => {

		await inquirer.prompt([{

			type: 'checkbox',
			name: 'a',
			message: 'Teste modo Checkbox',
			choices: ['A', 'B', 'C', 'D']

		}

		])
			.then(escolha => {

				console.log('Escolha:', escolha.a);

			})
			.catch(error => {

				if (error.isTtyError) {

					print("Não consigo mostrar no console")

				}
				else {

					print("Deu muito " + error)

				}
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/
	TestePass: async () => {

		await inquirer.prompt([
			{
				type: 'password',
				name: 'a',
				message: 'Teste modo Password',
			},
		])
			.then(escolha => {
				// Logging out the secret defeats the purpose though ;)
				console.info('Escolha:', escolha.a);
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/	
	TesteInput: async () => {

		await inquirer
			.prompt([
				{
					name: 'a',
					message: 'Teste do Input',
				},
			])
			.then(answers => {
				console.info('Resposta:', answers.a);
			});

	},

	/**
	 * Apenas um teste do inquirer (lib para seleção no console)
	*/
	TesteEditor: async () => {

		await inquirer
			.prompt([
				{
					type: 'editor',
					name: 'a',
					message: 'Testando o Editor',
				},
			])
			.then(answers => {
				console.info('Answer:', answers.a);
			});

	},

	/**
	 * Inicia a EMFDF (Deve ser usada antes do resto, se o Projeto do DialogFlow não mudar durante a execução DEVE ser usado apenas 1 vez)
	 * 
	 * @param {String} ProjectDF - Project ID do DialogFlow
	 * @param {String} CredentialsDF - Path(Full) para o arquivo de credenciais do DialogFlow
	 * 
     * @example
     * <caption>Exemplo de uso - Gera a seleção acima ⇧</caption>
	 * Start('ID LEGAL', '/um/caminho/muito/legal/para/as/credentials.json)
	 * 	
	*/
	Start: (ProjectDF, CredentialsDF) => {

		if (!emfc.VerifyParams([{param: 'ProjectDF', valor: ProjectDF},
								{param: 'CredentialsDF', valor: CredentialsDF}], ['string', 'string'])) {resolve(false); return false}

		credentials = require(CredentialsDF)

		entitiesClient = new dialogflow.v2.EntityTypesClient({
			credentials: credentials,
		});

		sessionsClient = new dialogflow.v2.SessionsClient({
			credentials: credentials,
		});

		intentsClient = new dialogflow.v2.IntentsClient({
			credentials: credentials
		});

		projectId = ProjectDF

		agentPath = entitiesClient.projectAgentPath(projectId);

		// if (process.platform == 'win32') {

		// 	exec('set GOOGLE_APPLICATION_CREDENTIALS="'+CredentialsPub+'"')
		// 	exec('$env:GOOGLE_APPLICATION_CREDENTIALS="'+CredentialsPub+'"')

		// }
		// else {
			
		// 	exec('cd ~/Documentos/Codigos/meta_digital_center; echo aaaaaaaaaaa;export GOOGLE_APPLICATION_CREDENTIALS="'+CredentialsPub+'"')

		// }

		emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'EMFDF Iniciado com sucesso!'}])

	},

	/**
	 * !USE Start() antes de usar esse metodo! 
	 * 
	 * Cria uma nova envidade no DialogFlow
	 * 
	 * @returns {Promise<boolean>} promessa com true ou false (true - ok, false - error) 
	 * 
	 * @param {boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * @param {Array<{value: 'Nome do Valor', synonyms: Array<'Sinonimo1', 'Sinonimo2'>}>} Entidades - Valores que a entidade terá
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * true (Se deu tudo certo) | false (Se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * CreateEntity(false, 'Cartao_de_Credito', [{value: 'Cartao', synonyms: ['Credit Card', 'Cartão Credito', 'Parcelado']}])
	 * .then(r => {
	 * 
	 * 		//SEU CODIGO -> r referece ao retorno
	 * 
	 * })
	 * 
	*/
	CreateEntity: (GUI, Titulo, Entidades) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI},
									{param: 'Titulo', valor: Titulo}, 
									{param: 'Entidades', valor: Entidades}], [true, 'string', [{value: 'Nome do Valor', synonyms: ['Sinonimo1']}]])) {resolve(false); return false}

			await VStart()

			if (!GUI) {

				let EntityType = {
					displayName: Titulo,
					kind: 'KIND_MAP',
					entities: [
						// infinitos objetos
						// { value: 'New York', synonyms: ['New York', 'NYC'] },
						// { value: 'Los Angeles', synonyms: ['Los Angeles', 'LA', 'L.A.'] },
					],
				};

				for (e in Entidades) {

					EntityType.entities.push(Entidades[e])

				}

				const Request = {
					parent: agentPath,
					entityType: EntityType,
				};

				entitiesClient.createEntityType(Request)
					.then((responses) => {

						emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Entidade Criada com sucesso'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])}])

						//console.log('Created new entity type:', JSON.stringify(responses[0]));
					
						resolve(true)
					
					})
					.catch((err) => {

						emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Não foi possivel criar entidade'},
											  	  {tag: 'Entidade', print: Titulo},
												  {tag: 'Valores', print: JSON.stringify(Entidades)}, 
												  {tag: 'Erro', print: err}])

						
						resolve(false)

					})

			}
			else {



			}

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Edita uma entidade do DialogFlow (REMOVE tudo da configuração anterior)
	 * 
	 * Se deseja modificar MANTENDO os valores anteriores use AddEntity() ou RemoveEntity() 
	 * 
	 * @returns {Promise<Boolean>} true se deu certo, false se deu errado
	 * 
	 * @param {boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * @param {Array<{value: 'Nome do Valor', synonyms: Array<'Sinonimo1', 'Sinonimo2'>}>} Entidades - Valores que a entidade terá
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * true (Se deu tudo certo) | false (Se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * emfd.EditEntity(false, 'Cartao_de_Credito', [{value: 'Cartao', synonyms: ['Credit Card', 'Cartão Credito', 'Parcelado']}])
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 *	})
	*/
	EditEntity: (GUI, Titulo, Entidades) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI},
									{param: 'Titulo', valor: Titulo},
									{param: 'Entidades', valor: Entidades}], [true, 'string', [{value: 'Nome do Valor', synonyms: ['Sinonimo1', 'Sinonimo2']}]])) {resolve(false); return false}

			await VStart()

			class EntityNotFoundError extends Error { };

			entitiesClient.listEntityTypes({ parent: agentPath })
			.then((responses) => {

				const resources = responses[0];

				for (let i = 0; i < resources.length; i++) {

					const entity = resources[i];

					if (entity.displayName === Titulo) {

						return entity;

					}

				}

				throw new EntityNotFoundError();

			})
			.then((entity) => {

				//console.log('Found ' + Titulo + ': ', JSON.stringify(entity));

				let updatedEntityList = [];

				for (e in Entidades) {

					updatedEntityList.push(Entidades[e])

				}

				entity.entities = updatedEntityList;

				const request = {
					entityType: entity,
					updateMask: {
						paths: ['entities'],
					},
				};

				return entitiesClient.updateEntityType(request);

			})
			.then((responses) => {

				emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Entidade editada com sucesso'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])}])

				resolve(true)

				//console.log('Updated entity type:', JSON.stringify(responses[0]));

			})
			.catch((err) => {
				// If this is the error we throw earlier in the chain, log the
				// cause of the problem.
				if (err instanceof EntityNotFoundError) {

					//console.error('Could not find the entity named ' + Titulo);
					
					emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Entidade não foi encontrada'},
											  {tag: 'Entidade', print: Titulo},
											  {tag: 'Valores', print: JSON.stringify(responses[0])}])

					resolve(false)

				}
				//console.error('Error updating entity type:', err);

				emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Entidade não pode ser editada'},
										  {tag: 'Entidade', print: Titulo},
										  {tag: 'Valores', print: JSON.stringify(responses[0])},
										  {tag: 'Erro', print: err}])

				resolve(false)

			});

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Adiciona valores e/ou sinonimos da entidade do DialogFlow
	 * 
	 * @returns {Promise<Boolean>} true se deu certo, false se deu errado
	 * 
	 * @param {boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * @param {Array<{value: 'Nome do Valor', synonyms: Array<'Sinonimo1', 'Sinonimo2'>}>} Entidades - Valores novos que a entidade terá
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * true (Se deu tudo certo) | false (Se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * AddEntity(false, 'Cartao_de_Credito', [{value: 'Cartao', synonyms: ['Credito']}])
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * })
	*/
	AddEntity: (GUI, Titulo, Entidades) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI},
									{param: 'Titulo', valor: Titulo},
									{param: 'Entidades', valor: Entidades}], [true, 'titulo', [{value: 'Nome do Valor', synonyms: ['Sinonimo1', 'Sinonimo2']}]])) {resolve(false); return false} 

			await VStart()

			class EntityNotFoundError extends Error { };

			entitiesClient.listEntityTypes({ parent: agentPath })
			.then((responses) => { // reading

				let achou = false

				const resources = responses[0];

				let entity

				for (r in resources) {

					const entityAntiga = resources[r];

					if (entityAntiga.displayName === Titulo) {

						entity = entityAntiga
						achou = true

					}

				}

				if (achou) {

					return entity;

				}


				throw new EntityNotFoundError();

			})
			.then((entity) => { // editing

				//console.log('Found ' + Titulo + ': ', JSON.stringify(entity));

				let updatedEntityList = [];

				for (e in entity.entities) {

					updatedEntityList.push(entity.entities[e])

				}

				for (e in Entidades) {

					updatedEntityList.push(Entidades[e])

				}

				entity.entities = updatedEntityList;

				const request = {
					entityType: entity,
					updateMask: {
						paths: ['entities'],
					},
				};

				return entitiesClient.updateEntityType(request);

			})
			.then((responses) => {

				emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Entidade modificada com sucesso'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])}])

				resolve(true)

				//console.log('Updated entity type:', JSON.stringify(responses[0]));

			})
			.catch((err) => {
				// If this is the error we throw earlier in the chain, log the
				// cause of the problem.
				if (err instanceof EntityNotFoundError) {
					//console.error('Could not find the entity named ' + Titulo);

					emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Entidade não encontrada'},
										   {tag: 'Entidade', print: Titulo},
										   {tag: 'Valores', print: JSON.stringify(responses[0])}])

					resolve(false)

				}

				emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Não foi possivel modificar entidade'},
										  {tag: 'Entidade', print: Titulo},
										  {tag: 'Valores', print: JSON.stringify(responses[0])},
										  {tag: 'Erro', print: err}])

				resolve(false)


				resolve(false)

				//console.error('Error updating entity type:', err);

			});

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Remove valores e/ou sinonimos da entidade do DialogFlow
	 * 
	 * @returns {Promise<Boolean>} true se deu certo, false se deu errado
	 * 
	 * @param {booleanean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * @param {Array<{value: 'Nome do Valor', synonyms: Array<'Sinonimo1', 'Sinonimo2'>}>} Entidades - Valores a serem removidos, se deseja remover todo o valor defina apenas value, se deseja remover um ou mais sinonimos defina dentro de synonyms
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * true (Se deu tudo certo) | false (Se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * RemoveEntity(false, 'Cartao_de_Credito', [{value: 'Cartao', synonyms: ['Credito']}])
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * })
	*/
	RemoveEntity: (GUI, Titulo, Entidades) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI},
									{param: 'Titulo', valor: Titulo},
									{param: 'Entidades', valor: Entidades}], [true, 'titulo', [{value: 'Nome do Valor', synonyms: ['Sinonimo1', 'Sinonimo2']}]])) {resolve(false); return false}
		
			await VStart()

			class EntityNotFoundError extends Error { };

			entitiesClient.listEntityTypes({ parent: agentPath })
			.then((responses) => { // reading

				let achou = false

				const resources = responses[0];

				let entity

				for (r in resources) {

					const entityAntiga = resources[r];

					if (entityAntiga.displayName === Titulo) {

						entity = entityAntiga
						achou = true

					}

				}

				if (achou) {

					return entity;

				}

				throw new EntityNotFoundError();

			})
			.then((entity) => { // editing

				//console.log('Found ' + Titulo + ': ', JSON.stringify(entity));

				let updatedEntityList = [];

				for (e in entity.entities) {

					updatedEntityList.push(entity.entities[e])

				}

				for (e in Entidades) {

					if (Entidades[e].synonyms == undefined) {

						for (l in updatedEntityList) {

							if (updatedEntityList[l].value == Entidades[e].value) {

								updatedEntityList.splice(parseInt(l), 1)

							}

						}

					}
					else {

						for (l in updatedEntityList) {

							if (updatedEntityList[l].value == Entidades[e].value) {

								for (r in Entidades[e].synonyms) {

									updatedEntityList[l].synonyms.splice(updatedEntityList[l].synonyms.indexOf(Entidades[e].synonyms[r]), 1)

								}

							}

						}

					}

				}


				entity.entities = updatedEntityList;

				const request = {
					entityType: entity,
					updateMask: {
						paths: ['entities'],
					},
				};

				return entitiesClient.updateEntityType(request);

			})
			.then((responses) => {

				emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Entidade editada com sucesso'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])}])

				resolve(true)

				//console.log('Updated entity type:', JSON.stringify(responses[0]));

			})
			.catch((err) => {
				// If this is the error we throw earlier in the chain, log the
				// cause of the problem.
				if (err instanceof EntityNotFoundError) {

					//console.error('Could not find the entity named ' + Titulo);

					emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Entidade não encontrada'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])}])

					resolve(false);
				}

				emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Não foi possivel modificar entidade'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])},
											   {tag: 'Erro', print: err}])

				resolve(false)

				//console.error('Error updating entity type:', err);
			});

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Deleta uma entidade do DialogFlow (REMOVE toda a entidade)
	 * 
	 * Se deja remover apenas uma parte da entidade, use RemoveEntity
	 * 
	 * @returns {Promise<Boolean>} true se deu certo, false se deu errado
	 * 
	 * @param {Boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * true (Se deu tudo certo) | false (Se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * DeleteEntity(false, 'Cartao_de_Credito')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * })
	*/
	DeleteEntity: (GUI, Titulo) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor:GUI},
									{param: 'Titulo', valor: Titulo}], [true, 'titulo'])) {resolve(false); return false} 

			await VStart()

			emfdf.GetEntityLink(false, Titulo)
			.then(async(link) => {

				await entitiesClient.deleteEntityType({ name: link })
				.then(e => {

					emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Entidade deletada com sucesso'},
					{tag: 'Entidade', print: Titulo}])
		
					resolve(true)

				})
				.catch(err => {
					
					emfc.PrintError('EMFDF', [{tag: 'Info', print: 'Não foi possivel deletar a entidade'},
											   {tag: 'Entidade', print: Titulo},
											   {tag: 'Valores', print: JSON.stringify(responses[0])},
											   {tag: 'Erro', print: err}])

					resolve(false)

				});

			})

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Lista todas as entidades
	 * 
	 * @returns {Promise<Array<{
    			 entities: Array<Object>,
    			 name: 'projects/testezinhos-do-emanuelzinho-ki/agent/entityTypes/44bd7661-4b12-4edf-aa5d-ec5e8bae57b4',
    			 displayName: 'aaaa',
    			 kind: 'KIND_MAP',
    			 autoExpansionMode: 'AUTO_EXPANSION_MODE_UNSPECIFIED',
    			 enableFuzzyExtraction: false
				  }>>} uma promessa com todas as Entidades
	 * @example
     * <caption>Exemplo de retono</caption>
     * [{
	 * 		"entities":[{"synonyms":["duasygduasd","a"],"value":"qwerqywterqywer"}],
	 * 		"name":"projects/testezinhos-do-emanuelzinho-ki/agent/entityTypes/44bd7661-4b12-4edf-aa5d-ec5e8bae57b4",
	 * 		"displayName":"aaaa",
	 * 		"kind":"KIND_MAP",
	 * 		"autoExpansionMode":"AUTO_EXPANSION_MODE_UNSPECIFIED",
	 * 		"enableFuzzyExtraction":false
	 * }]
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * ListEntiys()
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	*/
	ListEntiys: () => {

		return new Promise(async (resolve) => {

			await VStart()

			let r = []

			await entitiesClient
				.listEntityTypes({ parent: agentPath })
				.then((responses) => {

					for (e in responses[0]) {

						r.push(responses[0][e])

					}

				})

			resolve(r)

		})

	},

	/**
	 * !USE Start() antes de usar esse metodo!
	 * 
	 * Pega o link(name) da entidade Titulo
	 * 
	 * @returns {Promise<String>} Uma promessa com o link(name) da entidade Titulo
	 * 
	 * @param {Boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Titulo - Nome visivel da entidade no DialogFlow
	 * 
	 * @example
     * <caption>Exemplo de retono</caption>
     * projects/testezinhos-do-emanuelzinho-ki/agent/entityTypes/44bd7661-4b12-4edf-aa5d-ec5e8bae57b4
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * DeleteEntity(false, 'Cartao_de_Credito')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * })
	 * 
	*/
	GetEntityLink: (GUI, Titulo) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI}, 
									{param: 'Titulo', valor: Titulo}], [true, 'string'])) {resolve(false); return false}
			
			await VStart()

			await emfdf.ListEntiys()
				.then((l) => {

					for (e in l) {

						if (l[e].displayName == Titulo) {

							resolve(l[e].name)

						}

					}

				})

		})

	},

	/**
	 * Detecta a intenção atravez do input
	 * 
	 * @returns {Promise<{Input: String, 
	 * Respostas: Array<String>, 
	 * Parametros: Array<{nome: String, valor: String}>,
	 * ParametrosNecessarios: Boolean,
	 * Intencao: String,
	 * Indice: Number,
	 * Lingua: String,
	 * Sessao: String,
	 * Horario: TimeRanges,
	 * InicioSessao: TimeRanges,
	 * TerminoSessao: TimeRanges,
	 * Final: TimeRanges | String} | boolean>} Retorna promessa com um JSON (se deu certo), false (se deu errado)
	 * 
	 * @param {String} Session - ID da sessão (deve ser unico e menor que 37 caracteres)
	 * @param {String} Input - O Texto de input do usuario (deve ser menor que 257 caracteres)
	 * @param {String} Language - O codigo da lingua usada, Possiveis: [pt-br, pt, en, fr, ...] -> mais aki https://cloud.google.com/dialogflow/docs/reference/language
	 * 
	 * @example <caption>Exemplo de retono</caption>
     * {
	 *		Input: 'eae',
	 *		Respostas: [ 'Oi!' ],
	 *		Parametros: [],
	 *	 	ParametrosNecessarios: true,
	 *		Intencao: 'Default Welcome Intent',
	 *		Indice: 1,
	 *		Lingua: 'pt-br',
	 *		Sessao: '123',
	 *		Horario: 2020-03-27T14:04:10.477Z,
	 *		InicioSessao: 2020-03-27T14:04:10.477Z,
	 *		TerminoSessao: 'Não terminou',
	 *		Final: false
	 *	}
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * DetectIntent('123', 'eae', 'pt-BR')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	*/
	DetectIntent: async (Session, Input, Language) => {

		return new Promise(async (resolve) => {

			if (!emfc.VerifyParams([{param: 'Session', valor: Session},
									{param: 'Input', valor: Input},
									{param: 'Language', valor: Language}], ['string', 'string', 'pt-br'])) {resolve(false); return false}

			await VStart()

			const formattedSession = sessionsClient.sessionPath(projectId, Session);

			const queryInput = {

				"text": {
					"text": Input,
					"languageCode": Language
				}

			};

			const request = {

				session: formattedSession,
				queryInput: queryInput,

			};

			sessionsClient.detectIntent(request)
			.then(responses => {
				const response = responses[0];

				let Respostas = []
				let Parametros = []
				let ParametrosNecessarios;
				let Intencao = response.queryResult.intent.displayName;
				let Indice = response.queryResult.intentDetectionConfidence;
				let Lingua = response.queryResult.languageCode;
				let Tempo = new Date();
				let Inicio;
				let Final;
				let Termino = 'Não terminou';
				let i;

				for (r in response.queryResult.fulfillmentMessages) {

					Respostas.push(response.queryResult.fulfillmentMessages[r].text.text[0])

				}

				for (p in response.queryResult.parameters.fields) {

					if (response.queryResult.parameters.fields[p].structValue != null) {

						Parametros.push({nome: p, valor: response.queryResult.parameters.fields[p].structValue.fields[Object.keys(response.queryResult.parameters.fields[p].structValue.fields)[0]][response.queryResult.parameters.fields[p].structValue.fields.name.kind]})

					}
					else {
					
						Parametros.push({nome: p, valor: response.queryResult.parameters.fields[p][response.queryResult.parameters.fields[p].kind]})

					}

				}

				if (response.queryResult.diagnosticInfo != null) {

					if (response.queryResult.diagnosticInfo.fields.end_conversation.boolValue) {

						Final = true

					}
					else {

						Final = false

					}

				}
				else {

					Final = false

				}

				let b = false

				for (s in Sessions) {

					if (Sessions[s].session == Session) {
						
						b = true;
						
						if (Final) {

							Sessions[s].Termino = Tempo
							Termino = Tempo

							i = s

						}
						else {

							Inicio = Sessions[s].Inicio

						}
						
						break
					
					}

				}

				if (!b) {

					if (!Final) {

						Sessions.push({session: Session, Inicio: Tempo, Termino: 'Não terminou'})
						Inicio = Tempo

					}
					else {

						Sessions.push({session: Session, Inicio: Tempo, Termino: Tempo})
						Termino = Tempo
						Inicio = Tempo

					}

				}

				ParametrosNecessarios = response.queryResult.allRequiredParamsPresent

				emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Mensagem recebida do DialogFlow'},
									{tag: 'Input', print: Input},
									{tag: 'Respostas', print: JSON.stringify(Respostas)},
									{tag: 'Parametros', print: JSON.stringify(Parametros)},
									{tag: 'ParametrosNecessarios', print: ParametrosNecessarios},
									{tag: 'Intenção', print: Intencao},
									{tag: 'Indice', print: Indice},
									{tag: 'Lingua', print: Lingua},
									{tag: 'Sessão', print: Session},
									{tag: 'HorarioAtual', print: Tempo},
									{tag: 'InicioSessão', print: Inicio},
									{tag: 'TerminoSessão', print: Termino},
									{tag: 'Final de Conversa', print: Final}])

				if (Final) {

					Sessions.splice(i, 1)

				}

				resolve({Input: Input, 
						 Respostas: Respostas,
						 Parametros: Parametros,
						 ParametrosNecessarios: ParametrosNecessarios,
						 Intencao: Intencao,
						 Indice: Indice,
						 Lingua: Lingua,
						 Sessao: Session,
						 Horario: Tempo,
						 InicioSessao: Inicio,
						 TerminoSessao: Termino,
						 Final: Final
						})

				//console.log(JSON.stringify(response))

			})
			.catch(err => {
				
				// emfc.PrintError("EMFDF", [{tag: 'Info', print: 'Intenção não pode ser reconhecida'},
				// 						  {tag: 'Erro', print: err}])
				
				throw new ErroIntenção('Intenção '+name+' não pode ser reconhecida', 'DetectIntent('+name+')')

				//console.error(err);
			});

		})

	},

	/**
	 * Cria uma nova intenção no DialogFlow
	 * 
	 * @param {Boolean} GUI - Define se será utilizado o GUI no console
	 * @param {String} Name - O nome da nova intenção
	 * @param {Array<String>} TrainingPhrases - Frases de treino
	 * @param {Array<String>} Responses - Respostas para o usuario
	 * @param {Number} Priority - Prioridade da intenção -> -1: Ignore | 0: Low | 1: Normal | 2: High | 3: Highest
	 * @param {Boolean} EndInteraction - Define se a intenção termina a conversa/sessão
	 * @param {Array<{name: 'name', required: true, prompt: Array<'pergunta?'>, entity: 'entidade'}>} Parameters - Os parametros da intenção | name - Nome do parametro | required - Se o parametro é Necessario | prompt - Perguntas para o usario para colocar o parametro | entity - A entidade do parametro
	 * 
	 * @example <caption>Exemplo de retono</caption>
     * {
	 *		Input: 'eae',
	 *		Respostas: [ 'Oi!' ],
	 *		Parametros: [],
	 *	 	ParametrosNecessarios: true,
	 *		Intencao: 'Default Welcome Intent',
	 *		Indice: 1,
	 *		Lingua: 'pt-br',
	 *		Sessao: '123',
	 *		Horario: 2020-03-27T14:04:10.477Z,
	 *		InicioSessao: 2020-03-27T14:04:10.477Z,
	 *		TerminoSessao: 'Não terminou',
	 *		Final: false
	 *	}
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * CreateIntent(false, 'IntençãoLegalGalera', ['Muito legal', 'hehe'], ['Um resposta legal'], 1, false, [{name: 'UmParametroLegal', required: true, prompt: ['Uma pergunta para legal quando n tem'], entity: 'UmaEntiadeReferenteAEssaEntidade'}])
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	 * 
	*/
	CreateIntent: (GUI, Name, TrainingPhrases, Responses, Priority, EndInteraction, Parameters) => {

		return new Promise(async resolve => {

			if (!emfc.VerifyParams([{param: 'GUI', valor: GUI},
									{param: 'Name', valor: Name},
									{param: 'TrainingPhrases', valor: TrainingPhrases},
									{param: 'Responses', valor: Responses},
									{param: 'Priority', valor: Priority},
									{param: 'EndInteraction', valor: EndInteraction},
							   		{param: 'Parameters', valor: Parameters}], [false, 'NomeIntenção', ['Frase Treino 1', 'Frase Treino 2'], ['Resposta 1', 'Resposta 2'], 1, false, [{name: 'name', required: true, prompt: ['pergunta?'], entity: 'entidade'}]])) {resolve(false); return false}

			await VStart()

			const formattedParent = intentsClient.projectAgentPath(projectId);

			let trainingPhrases = []
			let messages = []
			let parameters = []
			// let outputContexts = []

			for (i in TrainingPhrases) {

				trainingPhrases.push({type: 0, parts: [{text: TrainingPhrases[i]}]})

			}

			for (i in Responses) {

				messages.push({text: {text: [Responses[i]]}})

			}

			if (Parameters != null) {

				for (i in Parameters) {

					parameters.push({displayName: Parameters[i].name, 
									 value: "$"+Parameters[i].name,
									 entityTypeDisplayName: "@"+Parameters[i].entity,
									 mandatory: Parameters[i].required,
									 prompts: Parameters[i].prompt})

				}

			}
			else {parameters = null}

			// if (OutputContexts != null) {

			// 	outputContexts.push()

			// }
			// else {outputContexts = null}

			if (Priority >= 3) {

				Priority = 1000000

			}
			else if (Priority == 2) {

				Priority = 750000

			}
			else if (Priority == 1) {

				Priority = 500000

			}
			else if (Priority == 0) {

				Priority = 250000

			}
			else if (Priority <= -1) {

				Priority = -1

			}

			const intent = {

				displayName: Name,
				priority: Priority,
				endInteraction: EndInteraction,
				trainingPhrases: trainingPhrases,
				parameters: parameters,
				messages: messages,

			};

			const request = {
				parent: formattedParent,
				intent: intent,
			};

			await intentsClient.createIntent(request)
			.then(responses => {
				const response = responses[0];
				
				resolve(true)

				//console.log(response)

			})
			.catch(err => {
				console.error(err);
			});

		})

	},

	/**
	 * Deleta uma intenção do DialogFlow
	 * 
	 * @param {String} name - Nome da intenção (DisplayName)
	 * 
	 * @returns {boolean} True quando funcionou, False se não
	 * 
	 * @example <caption>Exemplo de retono</caption>
     * true (Se deu certo) | false (Se deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * DeleteIntent('IntençãoLegalGalera')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	 * 
	*/
	DeleteIntent: (name) => {

		return new Promise(async resolve => {

			if (!emfc.VerifyParams([{param: 'name', valor: name}], ['string'])) {resolve(false); return false}

			await VStart()

			emfdf.GetLinkItent(name)
			.then(r => {

				let intent = {

					name: r

				}

				intentsClient.deleteIntent(intent)
				.then(r => {

					emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Intenção deletada com sucesso'},
										   {tag: 'Intenção', print: name}])

					resolve(true)

				})
				.catch(e => {

					throw new ErroIntenção('Intenção '+name+' não pode ser deletada', 'DeleteIntent('+name+')')

				})

			})

		})

	},

	/**
	 * Lista todas as Intenções do DialogFlow
	 * 
	 * @returns {Promise<Array<{inputContextNames: Object[],
     * events: Object[],
     * trainingPhrases: Object[],
     * outputContexts: String[],
     * parameters: Object[],
     * messages: Object[],
     * defaultResponsePlatforms: Object[],
     * followupIntentInfo: Object[],
     * name: 'projects/<Agent ID>/agent/intents/<Intent ID>',
     * displayName: 'displayName',
     * priority: 500000,
     * isFallback: false,
     * webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
     * action: '',
     * resetContexts: false,
     * rootFollowupIntentName: '',
     * parentFollowupIntentName: '',
	 * mlDisabled: false}>>} Retorna todas as informações das intenções
	 *
	 * @example 
	 * <caption>Exemplo de retono</caption>
     * [
	 *		{
	 *			inputContextNames: [],
	 *			events: [],
	 *			trainingPhrases: [],
	 *			outputContexts: [],
	 *			parameters: [],
	 *			messages: [ [Object] ],
	 *			defaultResponsePlatforms: [],
	 *			followupIntentInfo: [],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/0efee60c-35b9-402a-bd90-2ace47b4d76f',
	 *			displayName: 'a',
	 *			priority: 500000,
	 *			isFallback: false,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: '',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false
	 *		},
	 *		{	
	 *			inputContextNames: [],
	 *			events: [],
	 *			trainingPhrases: [],
	 *			outputContexts: [],
	 *			parameters: [],
	 *			messages: [ [Object] ],
	 *			defaultResponsePlatforms: [],
	 *			followupIntentInfo: [],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/1e721b11-d6aa-4b78-baf6-d1786b818b57',
	 *			displayName: 'Default Fallback Intent',
	 *			priority: 500000,
	 *			isFallback: true,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: 'input.unknown',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false
	 *		},
	 *		{	
	 *			inputContextNames: [],
	 *			events: [],
	 *			trainingPhrases: [],
	 *			outputContexts: [],
	 *			parameters: [ [Object] ],
	 *			messages: [ [Object], [Object] ],
	 *			defaultResponsePlatforms: [],
	 *			followupIntentInfo: [],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/4fed5af1-6997-45ee-9ea4-462008be3d50',
	 *			displayName: 'NomeIntenção',
	 *			priority: 500000,
	 *			isFallback: false,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: '',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false
	 *		},
	 *		{	
	 *			inputContextNames: [],
	 *			events: [ 'WELCOME' ],
	 *			trainingPhrases: [],
	 *			outputContexts: [],
	 *			parameters: [],
	 *			messages: [ [Object] ],
	 *			defaultResponsePlatforms: [],
	 *			followupIntentInfo: [],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/692a420a-e953-4e95-a92b-1dee64d5f769',
	 *			displayName: 'Default Welcome Intent',
	 *			priority: 500000,
	 *			isFallback: false,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: 'input.welcome',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false
	 *		}	
	 *	]
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * ListIntents('pt-BR')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	 * 
	*/
	ListIntents: (language) => {

		return new Promise(async resolve => {

			await VStart()

			await intentsClient.listIntents({parent : agentPath, languageCode: language})
			.then(r => {

				resolve(r[0])

			})

		})

	},

	/**
	 * Pega a intentenção name
	 * 
	 * @param {String} name - Nome da intenção a ser retornada
	 * 
	 * @returns {Promise<{
	 * 			inputContextNames: Object[],
	 *			events: Object[],
	 *			trainingPhrases: Object[],
	 *			outputContexts: String[],
	 *			parameters: Object[],
	 *			messages: Object[],
	 *			defaultResponsePlatforms: Object[],
	 *			followupIntentInfo: Object[],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/0efee60c-35b9-402a-bd90-2ace47b4d76f',
	 *			displayName: 'aa',
	 *			priority: 500000,
	 *			isFallback: false,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: '',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false}>} A intenção
	 *
	 * @example 
	 * <caption>Exemplo de retono</caption>
     * {
	 *		inputContextNames: [],
	 *		events: [],
	 *		trainingPhrases: [],
	 *		outputContexts: [],
	 *		parameters: [],
	 *		messages: [
	 *			{
	 *			platform: 'PLATFORM_UNSPECIFIED',
	 *			text: [Object],
	 *			message: 'text'
	 *			}
	 *		],
	 *		defaultResponsePlatforms: [],
	 *		followupIntentInfo: [],
	 *		name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/a55e0d4a-38ed-42dc-bad7-5f17eb336e09',
	 *		displayName: 'IntençãoLegalGalera',
	 *		priority: 500000,
	 *		isFallback: false,
	 *		webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *		action: '',
	 *		resetContexts: false,
	 *		rootFollowupIntentName: '',
	 *		parentFollowupIntentName: '',
	 *		mlDisabled: false
	 *	}
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * GetIntent('IntençãoLegalGalera', 'pt-BR')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	*/
	GetIntent: (name, language) => {

		return new Promise(resolve => {

			VStart()

			emfdf.ListIntents(language)
			.then(list => {

				for (l in list) {

					if (list[l].displayName == name) {

						resolve(list[l])
						return list[l]

					}

				}

				throw new ErroIntenção('Intenção '+name+' não pode ser encontrada', 'GetIntent('+name+')')

			})
			.catch(e => {})

		})

	},

	/**
	 * Edita uma intenção do DialogFlow (SOBRESCREVE a intenção anterior)
	 * 
	 * @param {String} name - Nome da Intenção a ser modificada
	 * @param {{inputContextNames: Object[],
	 *			events: Object[],
	 *			trainingPhrases: Object[],
	 *			outputContexts: String[],
	 *			parameters: Object[],
	 *			messages: Object[],
	 *			defaultResponsePlatforms: Object[],
	 *			followupIntentInfo: Object[],
	 *			name: 'projects/testezinhos-do-emanuelzinho-ki/agent/intents/d9c25fe8-bb52-4571-a42a-c4daa85f8547',
	 *			displayName: 'Q',
	 *			priority: 500000,
	 *			isFallback: false,
	 *			webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
	 *			action: '',
	 *			resetContexts: false,
	 *			rootFollowupIntentName: '',
	 *			parentFollowupIntentName: '',
	 *			mlDisabled: false
	 *			}} edit - Os novos valores da intenção (Deve ser igual ao padrão de intenção do DialogFlow -> [aki]{@link https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.html#.Intent}, Apenas name não deve ser alterado)
	 * 
	*/
	EditIntent: (name, edit) => {

		return new Promise(async resolve =>{

			await VStart()

			emfdf.GetLinkItent(name, 'pt-BR')
			.then (link => {

				let intent = {

					name: link

				}

				for (p in edit) {

					intent[p] = edit[p]

				}

				let request = {

					intent: intent,

				}

				intentsClient.updateIntent(request)
				.then(r => {

					emfc.PrintOk('EMFDF', [{tag: 'Info', print: 'Intenção '+name+' modificada com sucesso'},
											{tag: 'Modificação:', print: JSON.stringify(r)}])

				})
				.catch(e => {

					throw new ErroIntenção('Não foi possivel fazer update na instação '+name, 'EditIntent('+name+', '+JSON.stringify(edit)+')')

				})

			})

		})

	},

	/**
	 * Pega o name(link) da Intenção
	 * 
	 * @param {String} name - Nome da intenção
	 * 
	 * @returns {Promise<String>} O name(link) da intenção 
	 * 
	 * @example 
	 * <caption>Exemplo de retono</caption>
     * projects/testezinhos-do-emanuelzinho-ki/agent/intents/a55e0d4a-38ed-42dc-bad7-5f17eb336e09
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * GetLinkItent('IntençãoLegalGalera', 'pt-BR')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	 * 
	*/
	GetLinkItent: (name, language) => {

		return new Promise(async resolve => {

			if (!emfc.VerifyParams([{param: 'name', valor: name}], ['string'])) {resolve(false); return false}

			await VStart()

			await emfdf.ListIntents(language)
			.then(r => {

				for (i in r) {

					if (r[i].displayName == name) {

						resolve(r[i].name)
						return(r[i].name)

					}

				}

				throw new ErroIntenção('Intenção '+name+' não encontrada', 'GetLinkItent(\''+name+'\')')

			})
			.catch(e => {})

		})

	},

	/**
	 * Envia Message para o Topico dentro do Pub/Sub
	 * 
	 * @returns {Promise<Boolean>} true (se deu certo), false (se algo deu errado)
	 * 
	 * @param {Boolean} Gui - Define se será utilizado o GUI no console 
	 * @param {String} Topico - Nome do topico no Pub/Sub
	 * @param {String | {}} Message - Mensagem para enviar para o Pub/Sub
	 * 
	 * @example 
	 * <caption>Exemplo de retono</caption>
     * true (se deu certo), false (se algo deu errado)
	 * 
	 * @example
	 * <caption>Exemplo de uso - Gera retorno acima ⇧</caption>
	 * emfd.SendToPubSub(false, 'mdc_int_rpa', 'eae blz?')
	 * .then(r => {
	 *
	 *		//SEU CODIGO -> r referece ao retono
	 *
	 * }) 
	 * 
	*/
	SendToPubSub: async (Gui, Topico, Message) => {

		return new Promise(async (resolve) => {

			await VStart()

			// const topicName = 'mdc_int_rpa';

			// const ObjTopic = {

			// 	orchestratorInfo: {

			// 		'clientId': 'eae blz?',
			// 		'userKey': '67sFvQ61tTh8MQQg59rEef2Bcgcw-Lsef2XU4IMwJLhdM',
			// 		'tenantLogicalName': 'InovTeamDefszqw301979',
			// 		'tenantURL': 'inovteam/InovCenter',
			// 		'processKey': '',
			// 		'accessToken': '',
			// 		'processName': 'SRVC_ResetECC_1_Mestre'

			// 	}

			// }

			const data = JSON.stringify(Message);

			// Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
			const dataBuffer = Buffer.from(data);

			const messageId = await pubsub.topic(Topico).publish(dataBuffer);

			emfc.PrintOk("EMFDF", [{tag: "Info", print: "Enviado com sucesso para Pub/Sub"}, 
								{tag: "Mensagem", print: JSON.stringify(Message)},
								{tag: "Id", print: messageId}])

			resolve(true)

		})

	},

}

let VStart = async () => {

	if (credentials == undefined || entitiesClient == undefined || sessionsClient == undefined || projectId == undefined || agentPath == undefined) {

		emfc.PrintError("EMFDF", [{tag: 'Erro', print: 'EMFDF não inicializada corretamente'},
								  {tag: 'Solução', print: 'Use Start() antes dos outros metodos'}])

		let ID;
		let CDF;

		await emfc.Input("Digite ID do projeto do DialogFlow")
		.then(id => {ID = id})

		await emfc.Input("Digite o path das credenciais do DialogFlow")
		.then(cdf => {CDF = cdf})

		emfdf.Start(ID, CDF)


	}

}
/**
 * @class ErroIntenção
*/
class ErroIntenção extends Error{

	/** 
	 * @param {String} erro - O print de erro 
	 * @param {String} onde - Onde ocorreu
	*/
	constructor(erro, onde) {

		super()

		emfc.PrintError("EMFDF", [{tag: 'Info', print: 'Erro em Intenção'},
								  {tag: 'Erro', print: erro},
								  {tag: 'Onde', print: onde}])

	}

}

//print('oi')