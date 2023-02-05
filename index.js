//NOTE - external modules
import chalk from "chalk";
import inquirer from "inquirer";

//NOTE - Node modules
import fs from "fs";

operations();

//NOTE - menu inicial com as opções de escolha do usuário
function operations() {
	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "O que você deseja fazer?",
				choices: [
					"Criar conta",
					"Consultar saldo",
					"Depositar",
					"Sacar",
					"Sair",
				],
			},
		])
		.then((answer) => {
			const action = answer["action"];

			if (action === "Criar conta") {
				createAccount();
			} else if (action === "Depositar") {
				deposit();
			} else if (action === "Consultar saldo") {
				getAccountBalance();
			} else if (action === "Sacar") {
				withdraw();
			} else if (action === "Sair") {
				console.log(chalk.bgBlue.black("Obrigado por usar nossos serviços"));
				process.exit();
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

//NOTE - check if an account exists
function checkAccounts(accountName) {
	if (!fs.existsSync(`accounts/${accountName}.json`)) {
		console.log(chalk.bgRed.white("Esta conta não existe, tente novamente"));
		return false;
	}
	return true;
}

//NOTE - create account
function createAccount() {
	console.log(chalk.bgGreen.black("parabens por escolher o nosso banco!"));
	console.log(chalk.green("Defina as opções da sua conta a seguir"));

	buildAccount();
}

function buildAccount() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite um nome para sua conta",
			},
		])
		.then((answer) => {
			const accountName = answer["accountName"];
			console.info(accountName);

			if (!fs.existsSync("accounts")) {
				fs.mkdirSync("accounts");
				return;
			}

			if (fs.existsSync(`accounts/${accountName}.json`)) {
				console.log(
					chalk.bgRed.black(
						"Esta conta ja existe, por favor escolha outro nome"
					)
				);
				buildAccount();
				return;
			} else {
				fs.writeFileSync(
					`accounts/${accountName}.json`,
					'{ "balance": 0 }',
					(err) => console.error(err)
				);
				console.log(
					chalk.bgGreen.white("Prabéns!! sua conta foi criada com sucesse")
				);
				operations();
			}
		})
		.catch((err) => console.error(err));
}

//NOTE - Fazer um deposito numa conta existente
function deposit() {
	//prompt para o usuário digitar a conta para deposito
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite o nome da sua conta",
			},
		])
		//tratando a resposta do usuário
		.then((answer) => {
			const accountName = answer["accountName"];
			if (!checkAccounts(accountName)) {
				return deposit();
			}
			//prompt para o usuario escolher o valor do deposito
			inquirer
				.prompt([
					{
						name: "amount",
						message: "Quanto você deseja depositar?",
					},
				])
				//tratando a resposta do usuário adicionando o valor a sua conta
				.then((answer) => {
					const amount = answer["amount"];

					addAmount(accountName, amount);
					operations();
				})
				//tratamento de possiveis erros
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

//NOTE - helper function para adicionar valores a conta
function addAmount(accountName, amount) {
	const accountData = getAccount(accountName);
	console.log(accountData);

	if (!amount) {
		console.log(
			chalk.bgRed.white("Ocorreu um erro, tente novamente mais tarde")
		);
		return deposit();
	}

	accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

	fs.writeFileSync(
		`accounts/${accountName}.json`,
		JSON.stringify(accountData),
		(err) => console.log(err)
	);

	console.log(
		chalk.green(`Deposito no valor de ${amount} realizado com sucesso`)
	);
}

//NOTE - helper function que retorna os dados da conta para tratamento
function getAccount(accountName) {
	const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
		encoding: "utf8",
		flag: "r",
	});

	return JSON.parse(accountJSON);
}

//NOTE - Consultar saldo
function getAccountBalance() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Por favor Digite o nome da sua conta",
			},
		])
		.then((answer) => {
			const accountName = answer["accountName"];

			if (!checkAccounts(accountName)) {
				return getAccountBalance();
			}

			const accountData = getAccount(accountName);

			console.log(
				chalk.bgBlue.white(`Seu saldo é de R$${accountData.balance}`)
			);
			operations();
		})
		.catch((err) => console.error(err));
}

//NOTE - Sacar valores da conta
function withdraw() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite o nome da sua conta",
			},
		])
		.then((answer) => {
			const accountName = answer["accountName"];

			if (!checkAccounts(accountName)) {
				return withdraw();
			}

			inquirer
				.prompt([
					{
						name: "amount",
						message: "Digite o valor do saque",
					},
				])
				.then((answer) => {
					const amount = answer["amount"];
					removeAmount(accountName, amount);
				})
				.catch((err) => console.error(err));
		})
		.catch((err) => console.error(err));
}

//NOTE - helper function para remover valores da conta e atualizar valores no saldo
function removeAmount(accountName, amount) {
	const accountData = getAccount(accountName);

	if (!amount) {
		console.log(chalk.bgRed.white("Por favor digite um valor válido"));
		return withdraw();
	}
	if (accountData.balance < amount) {
		console.log(chalk.bgRed.white("Valor indisponivel"));
		return withdraw();
	}
	accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);
	fs.writeFileSync(
		`accounts/${accountName}.json`,
		JSON.stringify(accountData),
		function (err) {
			console.error(err);
		}
	);
	console.log(chalk.bgGreen.white(`Saque realizado com sucesso no valor de R$${amount}`));
	operations();
}
